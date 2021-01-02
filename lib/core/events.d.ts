import { Event, Handler, EventType, EventHandlerMap } from "../types/index";
declare class Events implements Event {
    list: EventHandlerMap;
    constructor();
    has(type: EventType): boolean;
    on<T = any>(type: EventType, handler: Handler<T>): void;
    off<T = any>(type: EventType, handler: Handler<T>): void;
    emit<T = any>(type: EventType, event?: T, isResult?: boolean): T;
}
export * from "../types/index";
export default Events;
