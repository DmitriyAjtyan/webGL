// атрибут, который будет получать данные из буфера
attribute vec2 a_position;

// значение этой переменной останется одним и тем же на протяжении всего рендеринга примитива
uniform vec2 u_resolution;

// Значение varying переменной передастся в фрагментный шейдер
varying vec4 v_color;

// все шейдеры имеют функцию main
void main() {
  // gl_Position - специальная переменная вершинного шейдера,
  // которая отвечает за установку положения
  gl_Position = vec4(transform2DPixelsToClipSpaceCoordinates(a_position, u_resolution), 0, 1);

  // Преобразуем координаты пространства отсечения в координаты пространства цветов, чтобы задать цвета пикселей, основываясь на их положении
  v_color = transformClipSpaceCoordinatesToColorSpaceCoordinates(gl_Position);
}
