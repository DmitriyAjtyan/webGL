import initChat from './chat';
import initWebGLCanvas from './webGL/initWebGL';

const startGame = () => {
  const gameContainer = document.createElement('div');
  gameContainer.style.display = 'flex';
  gameContainer.style.justifyContent = 'flex-start'
  gameContainer.style.height = '480px';
  document.body.appendChild(gameContainer);

  initWebGLCanvas(gameContainer);
  initChat(gameContainer);
}

startGame();
