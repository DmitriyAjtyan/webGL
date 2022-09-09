import { CHAT_EVENTS } from "../../consts";
import eventBus from "../../eventBus";
import { setStyleObject } from "../../utils";
import messageComponent from "../message";

const messagesListStyles = {
  messagesListElement: {
    overflowY: 'auto',
    marginBottom: '10px',
  },
};

let messagesListElement = null;

const handleNewChatMessage = (messageData) => {
  const newMessageElement = messageComponent(messageData);
  messagesListElement.appendChild(newMessageElement);

  messagesListElement.scrollTop = messagesListElement.scrollHeight;
};

eventBus.subscribe(CHAT_EVENTS.RECEIVE_CHAT_MESSAGE, handleNewChatMessage);

const messagesListComponent = () => {
  messagesListElement = document.createElement('div');
  setStyleObject(messagesListElement, messagesListStyles.messagesListElement);

  return messagesListElement;
};

export default messagesListComponent;
