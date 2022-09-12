const setFixed2DRectangleToArrayBuffer = ({ webGLContext, x1, y1, x2, y2 }) => {
  const positionsArray = [
    x1, y1,
    x1, y2,
    x2, y1,
    x2, y1,
    x2, y2,
    x1, y2,
  ];

  webGLContext.bufferData(webGLContext.ARRAY_BUFFER, new Float32Array(positionsArray), webGLContext.DYNAMIC_DRAW);
}

export const drawFixed2DRectangle = ({ webGLContext, x1, y1, x2, y2 }) => {
  setFixed2DRectangleToArrayBuffer({ webGLContext, x1, y1, x2, y2 });

  webGLContext.drawArrays(webGLContext.TRIANGLES, 0, 6);
}
