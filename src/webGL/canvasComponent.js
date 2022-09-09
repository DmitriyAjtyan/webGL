const createCanvasForWebGL = ({ width, height, id }) => {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  canvasElement.id = id;

  return canvasElement;
}

export default createCanvasForWebGL;
