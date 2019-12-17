import {Container, injectable} from 'inversify';
import {asyncErrorHandler} from './errorHandler';
import {EventEmitter} from 'events';

const EventListenersMetadataKey = Symbol.for('eventListeners');

interface EventListenersMetadata {
    listenerClass: Function;
    methodName: string;
    eventClass: Function;
}

export function EventListener(eventType: Function) {
    function setMetadata(object: any, methodName: string) {
        const newMetadata: EventListenersMetadata = {
            listenerClass: object,
            methodName,
            eventClass: eventType
        };

        const currentMetadataList = Reflect.getMetadata(EventListenersMetadataKey, global);

        if (!currentMetadataList) {
            Reflect.defineMetadata(EventListenersMetadataKey, [newMetadata], global);
        } else {
            currentMetadataList.push(newMetadata);
            Reflect.defineMetadata(EventListenersMetadataKey, currentMetadataList, global);
        }
    }

    function wrapMethodToCheckEventType(object: any, methodName: string, descriptor: PropertyDescriptor) {
        descriptor = descriptor || Object.getOwnPropertyDescriptor(object, methodName);
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            if (args.length > 1 || !(args[0] instanceof eventType)) {
                throw new Error('Wrong event type');
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    }

    return (object: any, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        setMetadata(object, methodName);

        return wrapMethodToCheckEventType(object, methodName, descriptor);
    };
}

@injectable()
export class EventPublisher {
    private readonly eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public subscribe(eventClass, handler): void {
        this.eventEmitter.on(eventClass.name, asyncErrorHandler(handler));
    }

    public publish(event): void {
        this.eventEmitter.emit(event.constructor.name, event);
    }
}

export function registerEventListeners(container: Container) {
    container.bind(EventPublisher).toSelf().inSingletonScope();

    const listenersMetadata: EventListenersMetadata[] = Reflect.getMetadata(EventListenersMetadataKey, global) || [];

    const publisher = container.get(EventPublisher);
    listenersMetadata.forEach(listenerMetadata => {
        const listener = container.get(listenerMetadata.listenerClass.constructor);
        const handler = listener[listenerMetadata.methodName].bind(listener);
        publisher.subscribe(listenerMetadata.eventClass, handler);
    });
}

