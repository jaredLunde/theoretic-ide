import * as React from "react";
import * as yup from "yup";
import { Icon } from "@/components/icon";
import { box, grid } from "@/styles/layout";
import { text } from "@/styles/text";

export function YupError({ id, error, children }: YupErrorProps) {
  const ErrorComponent =
    children ??
    (typeof error === "object"
      ? defaultMessageComponents[error.type] ?? YupMessageComponent
      : StringMessageComponent);
  const message = yup.ValidationError.isError(error)
    ? parseMessage(error.message)
    : error;

  return !error ? null : (
    <div
      id={id}
      className={grid({
        cols: ["min-content", "1fr"],
        gap: 200,
        alignY: "start",
      })}
    >
      <Icon
        name="System/error-warning-fill"
        color="danger"
        className={box({ inset: ["0.05em", 0, 0, 0] })}
      />

      <span
        className={text({ size: 50, align: "left" })}
        aria-label={
          typeof message === "object" ? message["aria-label"] : undefined
        }
      >
        <ErrorComponent
          // @ts-expect-error: this is guarded by the conditions above
          message={error}
        />
      </span>
    </div>
  );
}

const defaultMessageComponents: Record<
  string,
  React.ComponentType<React.PropsWithChildren<{ message: YupError<any, any> }>>
> = {
  min({ message }: { message: YupError<"min", { min: number }> }) {
    return (
      <React.Fragment>
        {message.value.length}/{message.params!.min} characters
      </React.Fragment>
    );
  },

  max({ message }: { message: YupError<"max", { max: number }> }) {
    return (
      <React.Fragment>
        {message.value.length}/{message.params!.max} characters
      </React.Fragment>
    );
  },

  email(props: { message: YupError<"email", { regex: string }> }) {
    return (
      <React.Fragment>
        This should be a valid email address. For example:
        contact+support@theoretic.dev
      </React.Fragment>
    );
  },

  url({ message }: { message: YupError<"url", { regex: string }> }) {
    return (
      <React.Fragment>
        {message.path} should be a valid URL. For example:
        https://theoretic.dev.
      </React.Fragment>
    );
  },
  required(props: { message: YupError<"required"> }) {
    return <React.Fragment>This field is required.</React.Fragment>;
  },
};

function parseMessage(message: string): YupError<any> | string {
  try {
    return JSON.parse(message);
  } catch (e) {
    return message;
  }
}

function YupMessageComponent({ message }: { message: YupError<"none"> }) {
  return <React.Fragment>{message.errors.join(" ")}</React.Fragment>;
}

function StringMessageComponent({ message }: { message: string }) {
  return <React.Fragment>{message}</React.Fragment>;
}

export type YupError<
  T,
  P extends YupParams = YupParams
> = yup.ValidationError & {
  type?: T;
  value: string | number | readonly string[];
  params?: P;
  "aria-label"?: string;
};

export type YupParams = Record<string, unknown>;

export interface YupErrorProps {
  id?: string;
  error: YupError<any> | string | undefined;
  children?: React.ComponentType<
    React.PropsWithChildren<{ message: YupError<any> | string }>
  >;
}
