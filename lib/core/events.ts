import {
  Event,
  Handler,
  EventType,
  EventHandlerMap,
  EventHandlerList,
} from "../types/index";

class Events implements Event {
  list: EventHandlerMap;
  constructor() {
    this.list = new Map<EventType, EventHandlerList>();
  }

  has(type: EventType): boolean {
    return !!this.list.get(type);
  }

  on<T = any>(type: EventType, handler: Handler<T>): void {
    const handlers = this.list.get(type);
    const added = handlers && handlers.push(handler);

    if (!added) {
      this.list.set(type, [handler]);
    }
  }

  off<T = any>(type: EventType, handler: Handler<T>): void {
    const handlers = this.list.get(type);
    if (handlers) {
      handlers.splice(handlers.indexOf(handler) >>> 0, 1);
    }
  }

  emit<T = any>(type: EventType, event?: T, isResult?: boolean): T {
    const handlers = this.list.get(type) || [];

    const result = handlers.slice().reduce((acc, handler) => {
      const res = handler(acc);
      return isResult ? res : event;
    }, event);
    return result;
  }
}

export * from "../types/index";
export default Events;
