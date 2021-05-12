import Helper from './helper';
export default (data, functionContext) => {
  let { options, ctx, h, w } = functionContext;
  let { colors } = options;

  let helper = new Helper(ctx);

  data = helper.mutateData(data, 'shrink', 300);
  data = helper.mutateData(data, 'scale', h / 2);
  data = helper.mutateData(data, 'split', 5).slice(0, 4);

  let colorIndex = 0;
  data.forEach((points) => {
    const options = {
      lineColor: colors[colorIndex],
      radius: h * 0.015,
    };

    const origin = [0, h / 2];

    let wavePoints = helper.getPoints('line', w, origin, points.length, points);
    helper.drawPolygon(wavePoints.end, options);

    let invertedPoints = helper.getPoints(
      'line',
      w,
      origin,
      points.length,
      points,
      { offset: 100 }
    );
    helper.drawPolygon(invertedPoints.start, options);
    colorIndex++;
  });
};
