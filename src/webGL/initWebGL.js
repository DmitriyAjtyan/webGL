import { loadShader } from '../utils';
import drawRandom2DRectangle from './figures/2d/randomRectangle';
import drawFixed2DRectangle from './figures/2d/fixedRectangle';
import fragmentShaderLink from './shaders/2DFigure/fragmentShader.glsl';
import vertexShaderLink from './shaders/2DFigure/vertexShader.glsl';
import transform2DPixelsToClipSpaceCoordinates from './shaders/shadersUtils/transform2DPixelsToClipSpaceCoordinates.glsl';
import transformClipSpaceCoordinatesToColorSpaceCoordinates from './shaders/shadersUtils/transformClipSpaceCoordinatesToColorSpaceCoordinates.glsl';

const gameFieldDimensions = {
  width: 640,
  height: 480,
};

const resizeWebGLArea = ({ webGLContext, width, height }) => {
  // Множитель пикселей для HD-DPI (увеличит количество отрисовываемых пикселей в 2 / 3 / 4 раза; возможно вызовет фризы)
  const realToCSSPixels = window.devicePixelRatio;
  const newWidth = width * realToCSSPixels;
  const newHeight = height * realToCSSPixels;

  if (webGLContext.canvas.width !== newWidth && webGLContext.canvas.height !== newHeight) {
    webGLContext.canvas.width = newWidth;
    webGLContext.canvas.height = newHeight;

    webGLContext.viewport(0, 0, webGLContext.canvas.width, webGLContext.canvas.height);
  }
}

const initWebGLContext = (canvasElement) => {
  let webGLContext = null;

  try {
    webGLContext = canvasElement.getContext('webgl') || canvasElement.getContext('experimental-webgl');
  } catch(error) {
    console.error('initWebGL: ', error);
  }

  if (!webGLContext) {
    console.error("Unable to initialize WebGL. Your browser may not support it.");
    webGLContext = null;
  }

  return webGLContext;
}

const getShader = async ({ webGLContext, shaderLinks, shaderType }) => {
  const shadersPromises = [];

  shaderLinks.forEach((link) => shadersPromises.push(loadShader(link)));                         // Загружаем текст шейдера откуда-нибудь

  const shadersTexts = await Promise.all(shadersPromises);
  let resultShaderText = '';

  shadersTexts.forEach((shaderText) => {
    resultShaderText = `
      ${resultShaderText}
      ${shaderText}
    `;
  })

  const shader = webGLContext.createShader(shaderType);                                           // Создаём шейдер с типом, который нужен

  webGLContext.shaderSource(shader, resultShaderText);                                            // Указываем шейдеру текст кода на glsl/hlsl

  webGLContext.compileShader(shader);                                                             // Компилируем шейдер

  if (!webGLContext.getShaderParameter(shader, webGLContext.COMPILE_STATUS)) {                    // Проверяем нормально ли скомпилировался шейдер
    console.error('webGL shader compilation error: ', webGLContext.getShaderInfoLog(shader));     // Если нет, то выводим ошибку и
    webGLContext.deleteShader(shader);                                                            // освобождаем ресурсы, занятые шейдером
    return;
  }

  return shader;                                                                                  // Если всё в порядке, то возвращаем скомпилированный готовый шейдер
}

const getShaderProgram = ({ webGLContext, vertexShader, fragmentShader }) => {
  const shaderProgram = webGLContext.createProgram();                                             // Создаём шейдерную программу (штука, которая выполняет шейдеры и связывает их с данными)

  webGLContext.attachShader(shaderProgram, vertexShader);                                         // Прикрепляем вершинный шейдер с шейдерной программой
  webGLContext.attachShader(shaderProgram, fragmentShader);                                       // Прикрепляем фрагментный шейдер с шейдерной программой
  webGLContext.linkProgram(shaderProgram);                                                        // Линкуем всю программу (по факту линковка, как после компиляции)

  if (!webGLContext.getProgramParameter(shaderProgram, webGLContext.LINK_STATUS)) {               // Проверяем нормально ли слинковалась шейдерная программа
    console.error('webGL link shader program error');                                             // Если нет, то выводим ошибку и
    webGLContext.deleteProgram(shaderProgram);                                                    // освобождаем ресурсы, занятые программой
    return;
  }

  return shaderProgram;
};

const initWebGLCanvas = async (containerForAppend) => {
  /*
   *
   *
    ЭТАП ИНИЦИАЛИЗАЦИИ
   *
   *
  */

  const canvasElement = document.createElement('canvas');
  (containerForAppend || document.body).appendChild(canvasElement);
  canvasElement.width = gameFieldDimensions.width;
  canvasElement.height = gameFieldDimensions.height;

  /** @type {WebGLRenderingContext} */
  const webGLContext = initWebGLContext(canvasElement);

  if (!webGLContext) {
    return;
  }

  // Создаём вершинный и фрагментный шейдеры
  const vertexShader = await getShader({
    webGLContext,
    shaderLinks: [
      transformClipSpaceCoordinatesToColorSpaceCoordinates,
      transform2DPixelsToClipSpaceCoordinates,
      vertexShaderLink
    ],
    shaderType: webGLContext.VERTEX_SHADER,
  });
  const fragmentShader = await getShader({ webGLContext, shaderLinks: [fragmentShaderLink], shaderType: webGLContext.FRAGMENT_SHADER });

  // Создаём шейдерную программу (программу на видеокарте)
  const shaderProgram = getShaderProgram({ webGLContext, vertexShader, fragmentShader });

  // После того, как создана шейдерная программа, её нужно снабдить данными. Данные передадутся шейдерам, а именно в атрибуты, которые объявлены в тексте
  // программы шейдера. Сначала сработает вершинный шейдер. В нём объявлен один атрибут attribute vec4 a_position (a_position). Чтобы передать ему
  // данные нужно получить на него ссылку (обязательно до первой отрисовки!)
  const positionAttributePointer = webGLContext.getAttribLocation(shaderProgram, 'a_position');

  // Получение ссылки на uniform переменную, чтобы прокинуть в неё данные о размерах canvas
  const resolutionUniformPointer = webGLContext.getUniformLocation(shaderProgram, 'u_resolution');

  // Получение ссылки на uniform переменную, чтобы прокинуть в неё данные о цвете
  const colorUniformPointer = webGLContext.getUniformLocation(shaderProgram, 'u_rectangleColor');

  // Получение ссылки на атрибут, чтобы прокинуть в него буфер цветов для рисуемой фигуры
  const colorAttributePointer = webGLContext.getAttribLocation(shaderProgram, 'a_color');

  // Аттрибуты получают данные из буферов webGL. Поэтому надо создать буфер
  const geometryBufferPointer = webGLContext.createBuffer();
  const colorBufferPointer = webGLContext.createBuffer();

  setGeometry({ webGLContext, geometryBufferPointer });
  setColorBufferData({ webGLContext, colorBufferPointer });

  /*
   *
   *
    ЭТАП РЕНДЕРИНГА
   *
   *
  */

  // Задаём нужные размеры для области отрисовки
  resizeWebGLArea({ webGLContext, width: 640, height: 480 });

  // Устанавливаем цвет очистки (по факту фон)
  webGLContext.clearColor(0.0, 0.0, 0.0, 1.0);
  // Очищаем canvas (сбрасываем цвет каждого пикселя к цвету очистки)
  webGLContext.clear(webGLContext.COLOR_BUFFER_BIT);

  // Указываем webGL какую шейдерную программу надо выполнить
  webGLContext.useProgram(shaderProgram);

  // Установка значений uniform переменной (после useProgram)
  webGLContext.uniform2f(resolutionUniformPointer, webGLContext.canvas.width, webGLContext.canvas.height);

  webGLContext.uniform4f(colorUniformPointer, Math.random(), Math.random(), Math.random(), Math.random());

  configureAttribute({
    webGLContext,
    attributePointer: positionAttributePointer,
    bufferPointer: geometryBufferPointer,
    attributeConfig: {                            // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
      size: 2,                                    // 2 компоненты на итерацию
      type: webGLContext.FLOAT,                   // наши данные - 32-битные числа с плавающей точкой
      normalize: false,                           // не нормализовать данные
      stride: 0,                                  // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
      offset: 0,                                  // начинать с начала буфера
    }
  });

  configureAttribute({
    webGLContext,
    attributePointer: colorAttributePointer,
    bufferPointer: colorBufferPointer,
    attributeConfig: {
      size: 4,
      type: webGLContext.UNSIGNED_BYTE,           // Цвета в webGL - это значения от 0.0 до 1.0 - чисто положительные. Цвета можно закодировать
      normalize: true,                            // тремя байтами (r, g, b по 256 значений). Следовательно unsigned int здесь подходит лучше всего.
      stride: 0,
      offset: 0,
    }
  });

  // После связывания атрибутов и данных можно выполнить шейдерную программу.
  // Для этого нужно указать тип примитивов, используемых для отрисовки (точки / треугольники / линии),
  // отступ от начало буфера, сколько раз вытащить данные из буфера
  const primitiveType = webGLContext.TRIANGLES;
  const offsetStart = 0;
  const count = 6;

  // запускаем программу
  webGLContext.drawArrays(primitiveType, offsetStart, count);

  // draw50Rects(webGLContext);
  // drawRandom2DRectangle({ webGLContext })
  // startGame(webGLContext);
}

// перерисовывает 50 рандомных прямоугольников раз в 1 / частота экрана секунд
const draw50Rects = (webGLContext) => {
  webGLContext.clear(webGLContext.COLOR_BUFFER_BIT);
  for(let i = 0; i < 50; i++) {
    drawRandom2DRectangle({ webGLContext })
  }

  requestAnimationFrame(() => draw50Rects(webGLContext))
}

const configureAttribute = ({ webGLContext, attributePointer, bufferPointer, attributeConfig = {} }) => {
  // Чтобы воспользоваться атрибутом в шейдере (для передачи в него данных) его для начала нужно включить (а до этого получить на него ссылку)
  webGLContext.enableVertexAttribArray(attributePointer);
  // Потом привязать необходимый буффер с данными
  webGLContext.bindBuffer(webGLContext.ARRAY_BUFFER, bufferPointer);

  // vertexAttribPointer привязывает к атрибуту текущий ARRAY_BUFFER в webGL (если после этого сменить текущий буфер, то к аттрибуту будет привязан старый)
  webGLContext.vertexAttribPointer(
    attributePointer,
    attributeConfig.size,
    attributeConfig.type,
    attributeConfig.normalize,
    attributeConfig.stride,
    attributeConfig.offset
  );
}

const setGeometry = ({ webGLContext, geometryBufferPointer }) => {
  webGLContext.bindBuffer(webGLContext.ARRAY_BUFFER, geometryBufferPointer);

  // Пустой буфер бесполезен, поэтому его надо наполнить необходимыми СТРОГО ТИПИЗИРОВАННЫМИ данными (для позиций значения от -1 до 1)
  // значения по умолчанию: x = 0, y = 0, z = 0, w = 1
  const vertexData = [
    50, 50,
    50, 400,
    400, 50,
    400, 400,
    50, 400,
    400, 50
  ];

  // Данные помещаются в строго типизированный массив и копируются в geometryBuffer на видеокарте; static_draw - означает, что мы не будем менять эти данные (надо для оптимизаций)
  webGLContext.bufferData(webGLContext.ARRAY_BUFFER, new Float32Array(vertexData), webGLContext.STATIC_DRAW);
}

const setColorBufferData = ({ webGLContext, colorBufferPointer }) => {
  webGLContext.bindBuffer(webGLContext.ARRAY_BUFFER, colorBufferPointer);

  // фиксированный цвет - rgb для каждой вершины одинаковое
  // const r1 = Math.random();
  // const g1 = Math.random();
  // const b1 = Math.random();

  // const r2 = Math.random();
  // const g2 = Math.random();
  // const b2 = Math.random();

  // максимальное значение Math.random() * 256 = 255.9999999999. При касте в uint всё, что после точки, отбросится и будет максимум 255
  const colors = [
    Math.random() * 256, Math.random() * 256, Math.random() * 256, 255,
    Math.random() * 256, Math.random() * 256, Math.random() * 256, 255,
    Math.random() * 256, Math.random() * 256, Math.random() * 256, 255,
    Math.random() * 256, Math.random() * 256, Math.random() * 256, 255,
    Math.random() * 256, Math.random() * 256, Math.random() * 256, 255,
    Math.random() * 256, Math.random() * 256, Math.random() * 256, 255,
  ]

  webGLContext.bufferData(webGLContext.ARRAY_BUFFER, new Uint8Array(colors), webGLContext.STATIC_DRAW);
}

const startGame = (webGLContext) => {
  const canvasElementRef = webGLContext.canvas;
  const rectangleCoordinates = {
    x1: Math.round((canvasElementRef.width / 2)) - 75,
    y1: canvasElementRef.height,
    x2: Math.round((canvasElementRef.width / 2)) + 75,
    y2: canvasElementRef.height - 30,
  };

  drawFixed2DRectangle({
    webGLContext,
    ...rectangleCoordinates
  });

  const handleUserKeydown = (event) => {
    if ((event.code === 'ArrowRight' || event.code === 'KeyD') && rectangleCoordinates.x2 < canvasElementRef.width) {
      requestAnimationFrame(() => {
        rectangleCoordinates.x1 += 20;
        rectangleCoordinates.x2 += 20;

        webGLContext.clear(webGLContext.COLOR_BUFFER_BIT);
        drawFixed2DRectangle({
          webGLContext,
          ...rectangleCoordinates,
        });
      })
    }

    if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && rectangleCoordinates.x1 > 0) {
      requestAnimationFrame(() => {
        rectangleCoordinates.x1 -= 20;
        rectangleCoordinates.x2 -= 20;

        webGLContext.clear(webGLContext.COLOR_BUFFER_BIT);
        drawFixed2DRectangle({
          webGLContext,
          ...rectangleCoordinates,
        });
      })
    }
  }

  document.addEventListener('keydown', handleUserKeydown);
}

export default initWebGLCanvas;
