const el = document.getElementById('pause-btn');
el.classList.add('disabled');

export default {
  unmount() {},
  mount(audio) {
    console.log('pause button mount');
    el.classList.remove('disabled');
    const handleClick = () => {
      if (audio.duration > 0 && !audio.paused) {
        audio.pause();
        el.classList.add('active');
      }
    };

    const handleChangeState = () => {
      el.classList.remove('active');
    };

    audio.addEventListener('play', handleChangeState);

    el.addEventListener('click', handleClick);
    this.unmount = () => {
      console.log('pause button unmount');
      el.removeEventListener('click', handleClick);
      audio.removeEventListener('play', handleChangeState);
      el.classList.add('disabled');
    };
  },
};
