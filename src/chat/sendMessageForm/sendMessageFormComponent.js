import eventBus from "../../eventBus";
import { CHAT_EVENTS } from "../../consts";
import { setStyleObject } from "../../utils";

const messageFormStyles = {
  messageInputLabelElement: {
    marginBottom: '5px',
  },
  messageInputElement: {
    borderRadius: '4px',
    borderStyle: 'hidden',
  },
  sendMessageFormElement: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid black',
    borderRadius: '4px',
    padding: '5px',
  },
};

const MESSAGE_INPUT_ID = 'message';
const MESSAGE_INPUT_LABEL_TEXT = 'Введите сообщение';

let messageInputElement = null;

const handleSendMessage = (event) => {
  event.preventDefault();
  const text = messageInputElement.value || '';
  if (text) {
    eventBus.emitEvent(CHAT_EVENTS.SEND_CHAT_MESSAGE, text);
  }
  messageInputElement.value = '';
};

const sendMessageFormComponent = () => {
  const messageInputLabelElement = document.createElement('label');
  messageInputLabelElement.htmlFor = MESSAGE_INPUT_ID;
  messageInputLabelElement.textContent = MESSAGE_INPUT_LABEL_TEXT;
  setStyleObject(messageInputLabelElement, messageFormStyles.messageInputLabelElement);

  messageInputElement = document.createElement('input');
  messageInputElement.name = MESSAGE_INPUT_ID;
  messageInputElement.id = MESSAGE_INPUT_ID;
  setStyleObject(messageInputElement, messageFormStyles.messageInputElement);

  const sendMessageFormElement = document.createElement('form');
  sendMessageFormElement.onsubmit = handleSendMessage;

  sendMessageFormElement.appendChild(messageInputLabelElement);
  sendMessageFormElement.appendChild(messageInputElement);
  setStyleObject(sendMessageFormElement, messageFormStyles.sendMessageFormElement);

  return sendMessageFormElement;
};

export default sendMessageFormComponent;
