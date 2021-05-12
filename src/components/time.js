const el = document.getElementById('time');
const DEFAULT_TIME = '00:00.000';

const currentValue = time.querySelector('.time-current');
const totalValue = time.querySelector('.time-total--value');
currentValue.innerHTML = DEFAULT_TIME;
totalValue.innerHTML = DEFAULT_TIME;

const f2 = (n) => (n >= 10 ? n : '0' + n);
const f3 = (n) => (n >= 100 ? n : '0' + f2(n));

const format = (duration) => {
  let t = new Date(duration * 1000);
  let s =
    f2(t.getMinutes()) +
    ':' +
    f2(t.getSeconds()) +
    '.' +
    f3(t.getMilliseconds());

  return s
    .split('')
    .map((c) =>
      c.localeCompare('.') === 0 || c.localeCompare(':') === 0
        ? c
        : '<span class="letter">' + c + '</span>'
    )
    .join('');
};

export default {
  unmount() {},
  mount(autio) {
    console.log('time component mount');
    const handleDurationChange = () => {
      totalValue.innerHTML = format(autio.duration);
      currentValue.innerHTML = format(autio.currentTime);
    };
    autio.addEventListener('durationchange', handleDurationChange);

    var timer = null;
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handlePause = () => {
      stop();
    };

    const handlePlayAndRateCahange = (e) => {
      stop();
      timer = setInterval(() => {
        currentValue.innerHTML = format(autio.currentTime);
      }, audio.playbackRate * 100);
    };

    ['play', 'ratechange'].forEach((e) => {
      audio.addEventListener(e, handlePlayAndRateCahange);
    });

    autio.addEventListener('pause', handlePause);

    this.unmount = () => {
      console.log('time component unmount');
      stop();

      try {
        audio.removeEventListener('durationchange', handleDurationChange);
        audio
          .removeEventListener('pause', handlePause)

          [('play', 'ratechange')].forEach((e) => {
            if (autio) {
              audio.removeEventListener(e, handlePlayAndRateCahange);
            }
          });
      } catch (e) {
        console.warn(e);
      }
      currentValue.innerHTML = DEFAULT_TIME;
      totalValue.innerHTML = DEFAULT_TIME;
    };
  },
};
