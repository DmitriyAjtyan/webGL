import { CHAT_EVENTS } from "../../consts";
import eventBus from "../../eventBus";

let websocket = null;

const websocketSendMessageHandler = (message) => {
  const messageObject = {
    text: message,
    date: Date.now(),
  };

  try {
    websocket.send(JSON.stringify(messageObject));
  } catch(error) {
    eventBus.emitEvent(CHAT_EVENTS.CHAT_ERROR, error);
  }
};

const websocketReceiveMessageHandler = (message) => {
  try {
    const parsedMessage = JSON.parse(message.data);
    const messageDate = parsedMessage.date;
    const messageText = parsedMessage.text;
    eventBus.emitEvent(CHAT_EVENTS.RECEIVE_CHAT_MESSAGE, { messageDate, messageText });
  } catch(error) {
    eventBus.emitEvent(CHAT_EVENTS.CHAT_ERROR, error);
  }
};

const closeWebsocketConnection = () => {
  websocket.close();
  eventBus.unsubscribe(CHAT_EVENTS.SEND_CHAT_MESSAGE, websocketSendMessageHandler);
};

const initWebsocketConnection = (websocketUrl) => {
  websocket = new WebSocket(websocketUrl);

  eventBus.subscribe(CHAT_EVENTS.SEND_CHAT_MESSAGE, websocketSendMessageHandler);

  websocket.onopen = () => {
    console.log('\nsocket connection is opened with 127.0.0.1:8080, using ws protocol\n');
  };

  websocket.onmessage = websocketReceiveMessageHandler;

  websocket.onerror = (error) => {
    console.error('websocket error: ', error);
  };

  // code 1000 - normal
  // code 1006 - connection was lost
  websocket.onclose = (closeEvent) => {
    console.log('\nwebsocket connection with 127.0.0.1:8080 was closed with code ', closeEvent.code, ' due to reason: ', closeEvent.reason);
  };
};

export { initWebsocketConnection, closeWebsocketConnection };
