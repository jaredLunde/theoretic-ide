import type { FieldAtomValidateOn, Validate } from "form-atoms";
import type { Getter } from "jotai";
import * as yup from "yup";
import { isSchema } from "yup";

export function yupValidate<Value>(
  schema: ((get: Getter) => yup.AnySchema) | yup.AnySchema,
  config: YupValidateConfig = {}
) {
  const {
    on,
    ifDirty,
    ifTouched,
    formatError = (err) => err.errors,
    abortEarly = false,
  } = config;
  const ors: ((
    state: Parameters<Exclude<Validate<Value>, undefined>>[0]
  ) => Promise<string[] | undefined>)[] = [];

  const chain = Object.assign(
    async (
      state: Parameters<Exclude<Validate<Value>, undefined>>[0]
    ): Promise<string[] | undefined> => {
      let result: string[] | undefined;
      const shouldHandleEvent = !on || on.includes(state.event);

      if (shouldHandleEvent) {
        const shouldHandleDirty =
          ifDirty === undefined || ifDirty === state.dirty;
        const shouldHandleTouched =
          ifTouched === undefined || ifTouched === state.touched;

        if (shouldHandleDirty && shouldHandleTouched) {
          const validator = isSchema(schema) ? schema : schema(state.get);

          try {
            await validator.validate(state.value, { strict: true, abortEarly });
            result = [];
          } catch (err) {
            if (yup.ValidationError.isError(err)) {
              return formatError(err);
            }

            throw err;
          }
        }
      }

      if (ors.length > 0) {
        for (const or of ors) {
          const errors = await or(state);
          if (errors?.length) {
            result = errors;
            break;
          } else if (errors) {
            result = errors;
          }
        }
      }

      return result;
    },
    {
      or(config: Omit<YupValidateConfig, "abortEarly" | "formatError">) {
        const or = yupValidate(schema, { formatError, abortEarly, ...config });
        ors.push(or);
        return chain;
      },
    }
  );

  return chain;
}

export type YupValidateConfig = {
  on?: FieldAtomValidateOn | FieldAtomValidateOn[];
  ifTouched?: boolean;
  ifDirty?: boolean;
  formatError?: (error: yup.ValidationError) => string[];
  abortEarly?: boolean;
};
