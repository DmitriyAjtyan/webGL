import { setStyleObject } from "../../utils";

const messageStyles = {
  messageTextElement: {
    wordBreak: 'break-word',
  },
};

const messageComponent = ({ messageText, messageDate }) => {
  const parsedDate = new Date(messageDate)
  const hours = parsedDate.getHours();
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const minutes = parsedDate.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const seconds = parsedDate.getSeconds();
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const time = `${formattedHours}:${formattedMinutes}:${formattedSeconds} `;

  const messageElement = document.createElement('div');
  const messageTextElement = document.createElement('span');
  const messageDateElement = document.createElement('span');

  messageTextElement.textContent = messageText;
  setStyleObject(messageTextElement, messageStyles.messageTextElement)

  messageDateElement.textContent = time;

  messageElement.appendChild(messageDateElement);
  messageElement.appendChild(messageTextElement);

  return messageElement;
}

export default messageComponent;
