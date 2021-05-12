import { getStartPosition } from '../utils';

const el = document.getElementById('stop-btn');
el.classList.add('disabled');

export default {
  unmount() {},
  mount(audio) {
    console.log('stop button mount');
    el.classList.remove('disabled');
    const handleClick = () => {
      audio.pause();
      audio.currentTime = getStartPosition(audio);
    };

    el.addEventListener('click', handleClick);
    this.unmount = () => {
      console.log('stop button unmount');
      el.removeEventListener('click', handleClick);
      el.classList.add('disabled');
    };
  },
};
