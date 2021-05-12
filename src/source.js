import PlayButton from './components/playButton';
import StopButton from './components/stopButton';
import PauseButton from './components/pauseButton';
import TimeComponent from './components/time';
import SpeedRange from './components/speedRange';
import Visializer from './components/visualizer';

const AUDIO_TYPE_CHECK = /^audio\//;
const isAudioFile = (type) => AUDIO_TYPE_CHECK.test(type);
const DEFAULT_TITLE = 'GB Player';

class Component {
  unmount() {}
}

class ComponentProgressControl extends Component {
  constructor(el) {
    super();
    this.el = el;
  }

  mount(audio) {
    console.log('progress control mount');
    var timer = null;
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const handlePlayAndRateCahange = (e) => {
      stop();
      this.el.setAttribute('value', audio.currentTime);

      timer = setInterval(() => {
        this.el.setAttribute('value', audio.currentTime);
      }, audio.playbackRate * 1000);
    };

    const handleDurationChange = (e) => {
      this.el.setAttribute('max', audio.duration);
    };

    const handlePause = (e) => {
      stop();
    };

    audio.addEventListener('durationchange', handleDurationChange);
    ['play', 'ratechange'].forEach((e) => {
      audio.addEventListener(e, handlePlayAndRateCahange);
    });
    audio.addEventListener('pause', handlePause);

    this.unmount = () => {
      console.log('progress control unmount');

      this.el.removeAttribute('max');
      this.el.setAttribute('value', 0);

      audio.removeEventListener('durationchange', handleDurationChange);
      ['play', 'ratechange'].forEach((e) => {
        audio.removeEventListener(e, handlePlayAndRateCahange);
      });
      audio.removeEventListener('pause', handlePause);
    };
  }
}

class ComponentLoopControl extends Component {
  constructor() {
    super();
    this.start = 2;
    this.end = 12;
  }
  mount(audio) {
    console.log('loop control mount');
    var timer = null;
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const handlePlayAndRateCahange = (e) => {
      stop();
      audio.currentTime = this.start;
      this.timer = setInterval(() => {
        if (audio.currentTime > this.end) {
          audio.currentTime = this.start;
        }
      }, audio.playbackRate * 1000);
    };

    const handlePause = (e) => {
      stop();
    };

    ['play', 'ratechange'].forEach((e) => {
      audio.addEventListener(e, handlePlayAndRateCahange);
    });

    audio.addEventListener('pause', handlePause);

    this.unmount = () => {
      console.log('loop control unmount');

      ['play', 'ratechange'].forEach((e) => {
        audio.removeEventListener(e, handlePlayAndRateCahange);
      });
      audio.removeEventListener('pause', handlePause);
    };
  }
}

const audioContext = {
  _context: undefined,
  _analyser: undefined,
  get context() {
    if (this._context === undefined) {
      this._context = new (window.AudioContext || window.webkitAudioContext)();
    }

    return this._context;
  },

  get analyser() {
    if (this._analyser === undefined) {
      this._analyser = this.context.createAnalyser();
      this._analyser.minDecibels = -90;
      this._analyser.maxDecibels = -10;
      this._analyser.smoothingTimeConstant = 0.85;
      this._analyser.fftSize = 32768;

      const source = this.context.createMediaElementSource(
        document.getElementById('audio')
      );
      source.connect(this._analyser);
    }

    return this._analyser;
  },

  connect() {
    this.analyser.connect(this.context.destination);
  },

  disconnect() {
    if (this._analyser) {
      this.analyser.disconnect(this.context.destination);
    }
  },
};
// async
function getFileAudio(audio, file) {
  if (!isAudioFile(file.type)) {
    throw new Error('is not a audio file');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      audio.src = e.target.result;
      resolve();
    };
    reader.readAsDataURL(file);
    reader.onerror = (e) => reject(e);
  });
}

const canvasFullWidth = () => {
  const canvas = document.getElementById('visualizer');
  canvas.setAttribute('width', document.querySelector('.wrapper').clientWidth);
}

function init() {
  const fileElement = document.getElementById('audio-data');
  const audioElement = document.getElementById('audio');

  canvasFullWidth()

  const ProgressControl = new ComponentProgressControl(
    document.getElementById('progress-control')
  );

  const LoopControl = new ComponentLoopControl();

  fileElement.addEventListener('change', (e) => {
    PlayButton.unmount();
    StopButton.unmount();
    PauseButton.unmount();
    TimeComponent.unmount();
    SpeedRange.unmount();

    ProgressControl.unmount();

    // LoopControl.unmount();

    Visializer.unmount();

    audioContext.disconnect();

    getFileAudio(audioElement, e.target.files[0]).then(() => {
      document.title = e.target.files[0].name + ' — ' + DEFAULT_TITLE;

      PlayButton.mount(audioElement);
      StopButton.mount(audioElement);
      PauseButton.mount(audioElement);
      TimeComponent.mount(audioElement);
      SpeedRange.mount(audioElement);

      ProgressControl.mount(audioElement);

      // LoopControl.mount(audioElement);

      audioContext.connect();
      Visializer.mount('visualizer', audioContext)

    });
  });
}

document.addEventListener('DOMContentLoaded', init);
