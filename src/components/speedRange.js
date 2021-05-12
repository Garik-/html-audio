import { debounce } from '../utils';

const el = document.getElementById('speed');
el.classList.add('disabled');
const range = el.querySelector('.speed-range');
const dot = range.querySelector('.speed-range--dot');
const progress = range.querySelector('.speed-range--progress');
const rangeValue = el.querySelector('.speed-range--value');

const WIDTH = progress.clientWidth;
const MIN_X = range.offsetLeft + dot.clientWidth;
const MAX_X = range.offsetLeft + range.clientWidth - dot.clientWidth / 2;
const DEBOUSE = 80;

const setRangeValue = (n) =>
  (rangeValue.innerHTML = n
    .toFixed(1)
    .split('')
    .map((c) =>
      c.localeCompare('.') === 0 ? c : '<span class="letter">' + c + '</span>'
    )
    .join(''));

    
const setProgressValue = (value) => {
  progress.style.setProperty('--value', value + '%');
};

function handleProgress(x) {
  dot.style.left = x + 'px';
  const value = (x * 100) / WIDTH;
  setProgressValue(value);

  if (Range.onchange) {
    Range.onchange(value);
  }
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

    if (e.clientX < MIN_X) {
      handleProgress(0);
      return true;
    }

    if (e.clientX > MAX_X) {
      handleProgress(range.clientWidth - dot.clientWidth);
      return true;
    }

    handleProgress(elmnt.offsetLeft - pos1);
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

dragElement(dot);

const Range = {
  unmount() {},
  onchange: undefined,
  mount(audio) {
    console.log('speed ragne mount');

    el.classList.remove('disabled');

    setProgressValue(100 - audio.playbackRate * WIDTH);
    setRangeValue(audio.playbackRate);

    this.onchange = debounce((value) => {
      audio.playbackRate = Math.max(1.0 - value / 100, 0.25);
      setRangeValue(audio.playbackRate);
    }, DEBOUSE);

    this.unmount = () => {
      console.log('speed ragne unmount');
      this.onchange = undefined;
      el.classList.add('disabled');
    };
  },
};

export default Range;
