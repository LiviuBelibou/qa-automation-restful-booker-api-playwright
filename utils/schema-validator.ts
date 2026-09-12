import Ajv, { type JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  allErrors: true,
});

addFormats(ajv);

export function validateSchema<T>(
  schema: JSONSchemaType<T>,
  data: unknown,
): void {
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  if (!isValid) {
    const errors = ajv.errorsText(validate.errors, {
      separator: '\n',
    });

    throw new Error(`Schema validation failed:\n${errors}`);
  }
}
