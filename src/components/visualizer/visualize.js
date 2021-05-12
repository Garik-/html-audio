import visual from './visual';
const DEFAULT_COLORS = [
  'rgb(70,113,170)',
  'rgb(137,204,211)',
  'rgb(32,138,170)',
  'rgb(191,96,107)',
  'rgb(145,101,159)',
  'rgb(70,113,170)',
];

let lastCanvasId, functionContext;

const defaultOptions = {
  stroke: 1,
  colors: DEFAULT_COLORS,
};

function getFunctionContext(canvasId) {
  console.log('getFunctionContext', canvasId);
  let canvas = document.getElementById(canvasId);

  let ctx = canvas.getContext('2d');
  let h = canvas.height;
  let w = canvas.width;

  ctx.strokeStyle = defaultOptions.colors[0];
  ctx.lineWidth = defaultOptions.stroke;

  return {
    options: defaultOptions,
    ctx,
    h,
    w,
    canvasId,
  };
}

export function visualize(data, canvasId) {
  if (!lastCanvasId || (lastCanvasId && lastCanvasId !== canvasId)) {
    functionContext = getFunctionContext(canvasId);
    lastCanvasId = canvasId;
  }

  //clear canvas
  functionContext.ctx.clearRect(0, 0, functionContext.w, functionContext.h);
  functionContext.ctx.beginPath();

  visual(data, functionContext);
}
