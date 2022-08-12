import type { Getter } from "jotai";
import * as yup from "yup";
import type { YupValidateConfig } from "./yup-validate";
import { yupValidate } from "./yup-validate";

export const validate = Object.assign(
  (
    schema:
      | ((get: Getter) => yup.AnySchema<any, any, any>)
      | yup.AnySchema<any, any, any>,
    config: ValidateConfig = {}
  ) => {
    return yupValidate(schema, {
      on: ["submit", "user"],
      formatError(error) {
        return error.inner.map((err) => JSON.stringify(err));
      },
      ...config,
    });
  },
  {
    onBlur: validateOnBlur,
    onChange: validateOnChange,
  }
);

export const message = {
  min({ originalValue, min, label, path }: Message<{ min: number }>) {
    return JSON.stringify({
      type: "min",
      min,
      label,
      path,
      originalValue,
      "aria-label": `The minimum number of characters required by this field is: ${min}. The current value contains ${originalValue.length} characters.`,
    });
  },

  max({ originalValue, max, label, path }: Message<{ max: number }>) {
    return JSON.stringify({
      type: "max",
      max,
      label,
      path,
      originalValue,
      "aria-label": `The maximum number of characters allowed for this field is: ${max}. The current value contains ${originalValue.length} characters.`,
    });
  },

  email({ originalValue, regex, label, path }: Message<{ regex: RegExp }>) {
    return JSON.stringify({
      type: "email",
      regex: regex.toString(),
      label,
      path,
      originalValue,
    });
  },

  url(fieldName: Message<{ regex: RegExp }> | string) {
    const cb = ({
      originalValue,
      regex,
      label,
      path,
    }: Message<{ regex: RegExp }>) =>
      JSON.stringify({
        type: "url",
        label,
        path,
        regex: regex.toString(),
        originalValue,
      });

    if (typeof fieldName === "string") {
      return (message: Message<{ regex: RegExp }>) =>
        cb({ ...message, path: fieldName });
    }

    return cb(fieldName);
  },
};

export const valid = {
  email: yup.string().email(message.email),
  password: yup.string().min(10, message.min),
  url: yup.string().url(message.url),
  displayName: yup
    .string()
    .matches(/^[\w]/, {
      message: `Your display name must start with a letter, a number, or an underscore`,
    })
    .matches(/^[A-Za-z0-9_.-]*$/, {
      message: ({ originalValue }) =>
        `Your display name contains illegal characters: ${Array.from(
          new Set(
            [...originalValue.matchAll(/[^A-Za-z0-9_.-]/g)].map((v) => "" + v)
          )
        ).join("")}`,
    })
    .min(2, message.min)
    .max(39, message.max)
    .required("Required"),
};

export function validateOnBlur(
  schema:
    | ((get: Getter) => yup.AnySchema<any, any, any>)
    | yup.AnySchema<any, any, any>,
  config: ValidateConfig = {}
) {
  return validate(schema).or({ on: "blur", ifTouched: true, ...config });
}

export function validateOnChange(
  schema:
    | ((get: Getter) => yup.AnySchema<any, any, any>)
    | yup.AnySchema<any, any, any>,
  config: ValidateConfig = {}
) {
  return validate(schema).or({
    on: ["blur", "change"],
    ifTouched: true,
    ...config,
  });
}

export function parseErrors(errors: string[]): yup.ValidationError[] {
  return errors.map((error) => {
    const parsed = JSON.parse(error) as yup.ValidationError;
    const nextError = new yup.ValidationError(
      parsed.inner.length
        ? parsed.inner.map((err) => {
            const nextError = new yup.ValidationError(
              err.inner.length ? err.inner : err.message,
              err.value,
              err.path,
              err.type
            );
            nextError.params = err.params;
            nextError.cause = err.cause;
            nextError.stack = err.stack;
            return nextError;
          })
        : parsed.message,
      parsed.value,
      parsed.path,
      parsed.type
    );

    nextError.params = parsed.params;
    nextError.cause = parsed.cause;
    nextError.stack = parsed.stack;
    return nextError;
  });
}

type ValidateConfig = Omit<YupValidateConfig, "abortEarly" | "formatError">;
export type Message<T> = {
  originalValue: string;
  label: string;
  path: string;
} & T;
