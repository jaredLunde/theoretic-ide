import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Form as Form_,
  useFieldAtomErrors,
  useFieldAtomInitialValue,
  useFieldAtomProps,
  useFormAtomErrors,
} from "form-atoms";
import type {
  FieldAtom,
  FormAtom,
  FormAtomErrors,
  FormAtomFields,
  FormProps as FormAtomsFormProps,
  FormAtomValues,
  Scope,
} from "form-atoms";
import * as React from "react";
import { vstack } from "@/styles/layout";
import { pluralize } from "@/utils/pluralize";
import { parseErrors } from "@/utils/validate";
import type { YupErrorProps } from "../yup-error";
import { YupError } from "../yup-error";

export const Form = Object.assign(
  <Fields extends FormAtomFields>(props: FormProps<Fields>) => {
    const { atom, scope, onSubmit, onReset, children, ...elementProps } = props;

    return (
      <Form_
        atom={atom}
        scope={scope}
        render={(form) => (
          <form
            onSubmit={form.submit(onSubmit)}
            onReset={(event) => {
              form.reset();
              onReset?.(event);
            }}
            {...elementProps}
          >
            {typeof children === "function"
              ? children(form.fieldAtoms)
              : children}
            <FormErrors atom={atom} scope={scope} />
          </form>
        )}
      />
    );
  },
  {
    BaseField,
    Field<Value extends string | number | readonly string[]>(props: {
      atom: FieldAtom<Value>;
      initialValue?: Value;
      scope?: Scope;
      renderError?: YupErrorProps["children"];
      children: React.ReactElement;
    }) {
      const { renderError, ...elementProps } = props;

      return (
        <FieldErrors
          atom={props.atom}
          scope={props.scope}
          renderError={renderError}
        >
          <BaseField {...elementProps} />
        </FieldErrors>
      );
    },
    FormErrors,
    FieldErrors,
  }
);

function FormErrors<Fields extends FormAtomFields>({
  atom,
  scope,
}: {
  atom: FormAtom<Fields>;
  scope?: Scope;
}) {
  const errors = useFormAtomErrors<Fields>(atom, scope);
  let numErrors = 0;

  // @ts-expect-error: type is unknown for some reason
  walkFormErrors<Fields>(errors, () => {
    numErrors++;
  });

  if (numErrors) {
    return (
      <VisuallyHidden asChild>
        <div aria-live="assertive">
          Your form has {pluralize(numErrors, "error")}. Please fix them and
          continue.
        </div>
      </VisuallyHidden>
    );
  }

  return null;
}

function BaseField<Value extends string | number | readonly string[]>(
  props: BaseFieldProps<Value>
) {
  const { atom, initialValue, scope, children, ...elementProps } = props;
  const fieldProps = useFieldAtomProps(atom, scope);
  useFieldAtomInitialValue(atom, initialValue, scope);
  return React.cloneElement(children, { ...elementProps, ...fieldProps });
}

function FieldErrors<Value>({
  children,
  renderError,
  ...props
}: FieldErrorProps<Value>) {
  const id = React.useId();
  const errors = useFieldAtomErrors(props.atom, props.scope);
  const parsedErrors = parseErrors(errors);

  return (
    <div className={vstack({ gap: 200 })}>
      {!errors.length
        ? children
        : React.cloneElement(children, {
            "aria-describedby": new Array(errors.length)
              .fill(null)
              .map((_, i) => `${id}:${i}`)
              .join(" "),
          })}

      {parsedErrors.map((error, i) => (
        <YupError
          {...props}
          key={i}
          children={renderError}
          error={error}
          id={`${id}:${i}`}
        />
      ))}
    </div>
  );
}

function walkFormErrors<Fields extends FormAtomFields>(
  errors: FormAtomErrors<Fields>,
  visitor: (error: string[], path: string[]) => void | false,
  path: string[] = []
) {
  for (const key in errors) {
    path.push(key);
    const field = errors[key];

    if (
      Array.isArray(field) &&
      field.length > 0 &&
      typeof field[0] === "string"
    ) {
      if (visitor(field, path) === false) return;
    } else if (Array.isArray(field) && field.length > 0) {
      for (const key in field) {
        path.push(key);
        const subField = field[key];

        if (typeof subField === "object") {
          walkFormErrors(subField, visitor, path);
        }

        path.pop();
      }
    } else if (!Array.isArray(field) && field && typeof field === "object") {
      // @ts-expect-error: not sure
      walkFormErrors(field, visitor, path);
    }

    path.pop();
  }
}

export interface FormProps<Fields extends FormAtomFields>
  extends Omit<FormAtomsFormProps<Fields>, "render" | "component">,
    Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit" | "children"> {
  onSubmit: (values: FormAtomValues<Fields>) => void | Promise<void>;
  children: ((fieldAtoms: Fields) => React.ReactNode) | React.ReactNode;
}

export interface BaseFieldProps<
  Value extends string | number | readonly string[]
> {
  atom: FieldAtom<Value>;
  initialValue?: Value;
  scope?: Scope;
  children: React.ReactElement;
}

export interface FieldProps<Value extends string | number | readonly string[]>
  extends BaseFieldProps<Value> {
  renderError: FieldErrorProps<Value>["renderError"];
}

export interface FieldErrorProps<Value>
  extends Omit<YupErrorProps, "error" | "children"> {
  atom: FieldAtom<Value>;
  scope?: Scope;
  renderError?: YupErrorProps["children"];
  children: React.ReactElement;
}
