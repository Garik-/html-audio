import { visualize } from './visualize';

let drawVisual;

export default {
  _drawVisual: undefined,
  unmount() {
    console.log('unmount visualize');
    if (drawVisual) {
      window.cancelAnimationFrame(drawVisual);
    }
  },
  mount(canvas_id, audioContext) {
    const bufferLength = audioContext.analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    console.log('mount visualize', canvas_id);

    function renderFrame() {
      if (!document.getElementById(canvas_id)) {
        return;
      }
      drawVisual = requestAnimationFrame(renderFrame);
      audioContext.analyser.getByteFrequencyData(data);

      visualize(data, canvas_id);
    }

    renderFrame();
  },
};
