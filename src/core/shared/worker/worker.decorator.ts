import 'reflect-metadata';

const TASK_METADATA = Symbol('TASK_METADATA');

export function Task(taskName: string): MethodDecorator {
  return (target, propertyKey) => {
    const handlers =
      Reflect.getMetadata(TASK_METADATA, target.constructor) || {};
    handlers[taskName] = propertyKey;
    Reflect.defineMetadata(TASK_METADATA, handlers, target.constructor);
  };
}

export function getTaskHandlers(target: any) {
  return Reflect.getMetadata(TASK_METADATA, target.constructor) || {};
}
