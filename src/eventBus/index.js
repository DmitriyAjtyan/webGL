import { CHAT_EVENTS } from "../consts";

const eventsMap = {
  [CHAT_EVENTS.CHAT_ERROR]: [],
  [CHAT_EVENTS.RECEIVE_CHAT_MESSAGE]: [],
  [CHAT_EVENTS.SEND_CHAT_MESSAGE]: [],
};

const eventBus = {
  subscribe: (eventName, handler) => {
    // console.log('eventBus.subscribe: to ', eventName, ', handler ', handler);
    const eventHandlersList = eventsMap[eventName] || [];
    eventHandlersList.push(handler);
    eventsMap[eventName] = eventHandlersList;
  },
  unsubscribe: (eventName, handler) => {
    // console.log('eventBus.unsubscribe: from ', eventName, ', handler ', handler);
    const eventHandlersList = eventsMap[eventName];

    if (eventHandlersList) {
      const handlerIndex = eventHandlersList.indexOf(handler);

      if (handlerIndex !== -1) {
        eventHandlersList.splice(handlerIndex, 1);
      }
    }
  },
  emitEvent: (eventName, eventPayload) => {
    // console.log('eventBus.emitEvent: ', eventName);
    const eventHandlersList = eventsMap[eventName];

    if (eventHandlersList && eventHandlersList.length > 0) {
      eventHandlersList.forEach((handler) => handler(eventPayload));
    }
  }
};

export default eventBus;
