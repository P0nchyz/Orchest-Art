let instance = null;

export class AudioService {
  constructor() {
    if (instance) {
      throw new Error('Use AudioService.getInstance()');
    }

    this.audioContext = null;
    this.masterGain = null;

    /**
     * @type {Map<string, AudioBuffer>}
     * Stores decoded audio samples.
     * Key: "instrument-note" (e.g. "piano-C4")
     * Value: AudioBuffer
     */
    this.buffers = new Map();

    /**
     * @type {Map<string, GainNode>}
     * Tracks notes currently sustaining
     * Key: "instrument-note"
     * Value: GainNode
     */
    this.activeSources = new Map();

    instance = this;
  }

  /**
   * Gets the single instance of AudioService
   * @returns {AudioService}
   */
  static getInstance() {
    if (!instance) {
      instance = new AudioService();
    }
    return instance;
  }

  /**
   * Initialize the AudioContext
   * Must be called by user gesture
   */
  async init() {
    if (this.audioContext) return;

    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    console.log('Audio Context Ready.');
  }

  /**
   * Loads audio samples per instrument
   * @param {string} instrumentName - e.g. "piano"
   * @param {Object<string, string>} sampleMap - e.g. {"C4": "/samples/Piano.mf.C4.wav", ... }
   */
  async loadSamples(instrumentName, sampleMap) {
    if (!this.audioContext) {
      console.warn('Audio Context not initialized.');
      return;
    }

    const loadPromises = [];
    for (const [note, url] of Object.entries(sampleMap)) {
      loadPromises.push(this.fetchAndDecode(url, `${instrumentName}-${note}`));
    }
    await Promise.all(loadPromises);
    console.log(`Samples for ${instrumentName} laoded.`);
  }

  /**
   * Fetches an audio file and decodes it into AudioBuffer
   * @private
   */
  async fetchAndDecode(url, key) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.buffers.set(key, audioBuffer);
    } catch (e) {
      console.error(`Failed to load or decode sample: ${url}`, e);
    }
  }

  /**
   * Plays a note inmediatly
   * @param {string} instrument
   * @param {string} note
   * @param {object} options
   * @param {number} options.startTime - When to start. 0 = now
   * @param {number} options.gain - Volume
   */
  play(instrument, note, options = {}) {
    if (!this.audioContext) return;

    const key = `${instrument}-${note}`;
    const buffer = this.buffers.get(key);
    if (!buffer) {
      console.warn(`Sample not found: ${key}`);
      return;
    }

    if (this.activeSources.has(key)) {
      this.stop(instrument, note, { release: 0.01 });
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.setValueAtTime(
      options.gain || 1.0,
      this.audioContext.currentTime
    );

    source.connect(gainNode).connect(this.masterGain);

    source.start(options.startTime || this.audioContext.currentTime);

    this.activeSources.set(key, gainNode);

    source.onended = () => {
      if (this.activeSources.get(key) === gainNode) {
        this.activeSources.delete(key);
      }
    };
  }

  /**
   * Stops a note with release
   * @param {string} instrument
   * @param {string} note
   * @param {object} options
   * @param {number} options.release - Release time in seconds
   */
  stop(instrument, note, options = {}) {
    if (!this.audioContext) return;

    const key = `${instrument}-${note}`;
    const gainNode = this.activeSources.get(key);

    if (gainNode) {
      const releaseTime = options.release !== undefined ? options.release : 1;
      const stopTime = this.audioContext.currentTime + releaseTime;

      gainNode.gain.setValueAtTime(
        gainNode.gain.value,
        this.audioContext.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime);
    }
  }

  /**
   * Sets the master volume
   * @param {number} level
   */
  setMasterValume(level) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(level, this.audioContext.currentTime);
    }
  }
}