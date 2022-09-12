export const setStyleObject = (element, styleObject) => {
  if (element && styleObject) {
    Object.assign(element.style, styleObject);
  }
};

export const getRandomInt = (range) => Math.floor(Math.random() * range);

export const loadShader = async (downloadLink) => {
  try {
    const shaderFile = await fetch(downloadLink);
    const shaderFileText = await shaderFile.text();

    return shaderFileText;
  } catch(error) {
    console.error('loadShader: ', error, '\ntrying to load: ', downloadLink);
    return '';
  }
};
