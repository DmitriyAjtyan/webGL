vec2 transform2DPixelsToClipSpaceCoordinates(vec2 positionAttribute, vec2 resolutionAttribute) {
  // Находим долю текущих координт от максимального значения (от размеров области отрисовки)
  vec2 partOfMax = positionAttribute / resolutionAttribute;

  // Преобразуем координаты в пикселях в координаты пространства отсечения (от -1 до 1)
  vec2 clipSpaceCoordinates = (partOfMax * 2.0) - 1.0;

  // Устанавливаем начало координат сверху слева, как это принято в графических api (меняем знак у оси Y)
  vec2 reversedYCoordinates = clipSpaceCoordinates * vec2(1, -1);

  return reversedYCoordinates;
}
