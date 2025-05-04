import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ZodDto, zodToOpenAPI } from 'nestjs-zod';
import { ZodArray, ZodSchema, ZodTypeDef, z } from 'zod';

const isSchemaObject = (
  input: SchemaObject | ReferenceObject,
): input is SchemaObject => {
  return !('$ref' in input);
};

const updateRequiredProp = (
  properties: SchemaObject['properties'],
  required: SchemaObject['required'],
) => {
  const requiredArray = Array.isArray(required) ? required : [];
  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      if (isSchemaObject(value) && value.type === 'object')
        updateRequiredProp(value.properties, value.required);
      (value as any).required = requiredArray.includes(key);
    }
  }

  return properties;
};

export function zodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(schema: ZodSchema<TOutput, TDef, TInput>) {
  class AugmentedZodDto {
    public static isZodDto = true;
    public static schema = schema;

    public static _OPENAPI_METADATA_FACTORY(): Record<string, any> | undefined {
      const schemaObject = zodToOpenAPI(this.schema);
      return updateRequiredProp(schemaObject.properties, schemaObject.required);
    }

    public static create(input: unknown) {
      return this.schema.parse(input);
    }
  }

  return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput>;
}

export function zodResponse(
  data: z.AnyZodObject | ZodArray<z.AnyZodObject>,
  meta?: z.AnyZodObject,
) {
  const res = {
    success: z.boolean(),
    key: z.string(),
    data,
    meta: z.object({}).optional(),
  };

  if (meta) {
    res.meta = meta as any;
  }

  const standard = z.object(res);

  return zodDto(standard);
}

export function getPaginationZod() {
  return z.object({
    pagination: z.object({
      page: z.number(),
      nextPage: z.number(),
      previousPage: z.number(),
      perPage: z.number(),
      totalItems: z.number(),
      currentPageItems: z.number(),
      totalPages: z.number(),
    }),
  });
}
