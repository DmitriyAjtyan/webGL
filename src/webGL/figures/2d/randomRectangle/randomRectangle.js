import { getRandomInt } from '../../../../utils';

const set2DRectangleToArrayBuffer = ({ webGLContext, x, y, width, height }) => {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  const positionsArray = [
    x1, y1,
    x2, y1,
    x1, y2,
    x2, y2,
    x2, y1,
    x1, y2
  ];


  webGLContext.bufferData(webGLContext.ARRAY_BUFFER, new Float32Array(positionsArray), webGLContext.STATIC_DRAW);
}

export const drawRandom2DRectangle = ({ webGLContext }) => {
  set2DRectangleToArrayBuffer({ webGLContext, x: getRandomInt(300), y: getRandomInt(300), width: getRandomInt(300), height: getRandomInt(300) });

  // webGLContext.uniform4f(colorUniformPointer, Math.random(), Math.random(), Math.random(), 1);

  webGLContext.drawArrays(webGLContext.TRIANGLES, 0, 6);
}
