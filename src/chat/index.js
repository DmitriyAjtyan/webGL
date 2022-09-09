import { WEBSOCKET_URL } from "../consts";
import chatContainerComponent from "./chatContainer";
import { initWebsocketConnection } from "./websocket";

const initChat = (containerForAppend) => {
  // render chat
  const chatContainerElement = chatContainerComponent();
  (containerForAppend || document.body).appendChild(chatContainerElement);

  // create websocket connection
  initWebsocketConnection(WEBSOCKET_URL);
};

export default initChat;
