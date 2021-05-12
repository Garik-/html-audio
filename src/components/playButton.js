import { getStartPosition } from '../utils';

const el = document.getElementById('play-btn');
el.classList.add('disabled');

export default {
  unmount() {},
  mount(audio) {
    console.log('play button mount');
    const handleCanPlayThrough = () => {
      el.classList.remove('disabled');
    };

    const handleClick = () => {
      if (audio.duration > 0 && !audio.paused) {
        audio.pause();
        audio.currentTime = getStartPosition(audio)
      } else {
        audio.play();
      }
    };

    const handleChangeState = () => {
      el.classList.toggle('active');
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    ['play', 'pause'].forEach((e) =>
      audio.addEventListener(e, handleChangeState)
    );
    el.addEventListener('click', handleClick);

    this.unmount = () => {
      console.log('play button unmount');
      el.classList.add('disabled');
      el.removeEventListener('click', handleClick);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      ['play', 'pause'].forEach((e) =>
        audio.removeEventListener(e, handleChangeState)
      );
    };
  },
};
