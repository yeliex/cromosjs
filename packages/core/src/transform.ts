import { Static, Type } from '@sinclair/typebox';

export const ApiTransformObjectDefineSchema = Type.Object({
    prefix: Type.Any(),
    polyfills: Type.Object({}, { additionalProperties: Type.Any() }),
});

export type ApiTransformObjectDefine = Static<typeof ApiTransformObjectDefineSchema>;

export const ApiTransformDefineSchema = Type.Union([
    Type.String(),
    Type.Literal(false),
    ApiTransformObjectDefineSchema,
]);

export type ApiTransformDefine = Static<typeof ApiTransformDefineSchema>;

export const TransformDefineSchema = Type.Object({
    name: Type.String(),
    api: ApiTransformDefineSchema,
});

export type TransformDefine = Static<typeof TransformDefineSchema>;
