import 'reflect-metadata';
import { ZodSchema } from 'zod';

const TASK_METADATA = Symbol('TASK_METADATA');

export interface TaskMetadata {
  methodName: string;
  schema?: ZodSchema<unknown>;
}

export function Task<T = unknown>(
  taskName: string,
  schema?: ZodSchema<T>,
): MethodDecorator {
  return (target, propertyKey) => {
    const handlers =
      Reflect.getMetadata(TASK_METADATA, target.constructor) || {};
    handlers[taskName] = {
      methodName: propertyKey as string,
      schema,
    } satisfies TaskMetadata;

    Reflect.defineMetadata(TASK_METADATA, handlers, target.constructor);
  };
}

export function getTaskHandlers(target: any) {
  return Reflect.getMetadata(TASK_METADATA, target.constructor) || {};
}
