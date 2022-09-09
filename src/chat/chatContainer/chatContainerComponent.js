import { setStyleObject } from "../../utils";
import messagesListComponent from "../messagesList";
import sendMessageFormComponent from "../sendMessageForm";

const chatContainerStyles = {
  chatContainerElement: {
    maxWidth: '400px',
    width: '400px',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'gray',
    padding: '10px',
  }
}

const chatContainerComponent = () => {
  const messagesList = messagesListComponent();
  const sendMessageForm = sendMessageFormComponent();
  const chatContainerElement = document.createElement('div');

  chatContainerElement.appendChild(messagesList);
  chatContainerElement.appendChild(sendMessageForm);
  setStyleObject(chatContainerElement, chatContainerStyles.chatContainerElement);

  return chatContainerElement;
};

export default chatContainerComponent;
