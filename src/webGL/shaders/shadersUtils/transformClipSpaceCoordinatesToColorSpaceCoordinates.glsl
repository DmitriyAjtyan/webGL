// Преобразование координат пространства отсечения (от -1.0 до 1.0) в координаты пространства цветов (от 0.0 до 1.0)
vec4 transformClipSpaceCoordinatesToColorSpaceCoordinates(vec4 clipSpaceCoordinates) {
  vec4 colorSpaceCoordinates = clipSpaceCoordinates * 0.5 + 0.5;

  return colorSpaceCoordinates;
}
