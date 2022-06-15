import { Schema } from "mongoose";

// Extends the base schema with the extendWith object and returns the new schema
export default function (baseSchema: Schema, extendWith: object): Schema {
  return new Schema(Object.assign({}, baseSchema.obj, extendWith));
}
