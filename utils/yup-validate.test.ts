import { act as domAct, renderHook } from "@testing-library/react";
import { fieldAtom, useFieldAtom } from "form-atoms";
import * as yup from "yup";
import { yupValidate } from "./yup-validate";

describe("yupValidate()", () => {
  it("should validate without a config", async () => {
    const nameAtom = fieldAtom({
      value: "",
      validate: yupValidate(yup.string().min(3, "3 plz")),
    });

    const field = renderHook(() => useFieldAtom(nameAtom));

    domAct(() => {
      field.result.current.actions.validate();
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("invalid");
    expect(field.result.current.state.errors).toEqual(["3 plz"]);
  });

  it("should throw multiple errors", async () => {
    const nameAtom = fieldAtom({
      value: "",
      validate: yupValidate(
        yup.string().min(3, "3 plz").matches(/foo/, "must match foo"),
        {
          abortEarly: false,
        }
      ),
    });

    const field = renderHook(() => useFieldAtom(nameAtom));

    domAct(() => {
      field.result.current.actions.validate();
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("invalid");
    expect(field.result.current.state.errors).toEqual([
      "3 plz",
      "must match foo",
    ]);
  });
  it("should use custom error formatting", async () => {
    const nameAtom = fieldAtom({
      value: "",
      validate: yupValidate(
        yup.string().min(3, "3 plz").matches(/foo/, "must match foo"),
        {
          formatError: (err) =>
            err.inner.map((e) =>
              JSON.stringify({ type: e.type, message: e.message })
            ),
          abortEarly: false,
        }
      ),
    });

    const field = renderHook(() => useFieldAtom(nameAtom));

    domAct(() => {
      field.result.current.actions.validate();
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("invalid");
    expect(field.result.current.state.errors).toEqual([
      JSON.stringify({ type: "min", message: "3 plz" }),
      JSON.stringify({ type: "matches", message: "must match foo" }),
    ]);
  });

  it("should validate 'on' a given event", async () => {
    const nameAtom = fieldAtom({
      value: "",
      validate: yupValidate(yup.string().min(3, "3 plz"), { on: "change" }),
    });

    const field = renderHook(() => useFieldAtom(nameAtom));

    domAct(() => {
      field.result.current.actions.validate();
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("valid");
    expect(field.result.current.state.errors).toEqual([]);

    domAct(() => {
      field.result.current.actions.setValue("f");
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("invalid");
    expect(field.result.current.state.errors).toEqual(["3 plz"]);
  });

  it("should validate only when dirty", async () => {
    const nameAtom = fieldAtom({
      value: "",
      validate: yupValidate(yup.string().min(3, "3 plz"), {
        ifDirty: true,
      }),
    });

    const field = renderHook(() => useFieldAtom(nameAtom));

    domAct(() => {
      field.result.current.actions.validate();
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("valid");
    expect(field.result.current.state.errors).toEqual([]);

    domAct(() => {
      field.result.current.actions.setValue("f");
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("invalid");
    expect(field.result.current.state.errors).toEqual(["3 plz"]);
  });

  it("should validate only when touched", async () => {
    const nameAtom = fieldAtom({
      value: "",
      validate: yupValidate(yup.string().min(3, "3 plz"), {
        ifTouched: true,
      }),
    });

    const field = renderHook(() => useFieldAtom(nameAtom));

    domAct(() => {
      field.result.current.actions.setTouched(true);
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("invalid");
    expect(field.result.current.state.errors).toEqual(["3 plz"]);
  });

  it("should validate multiple conditions", async () => {
    const nameAtom = fieldAtom({
      value: "",
      validate: yupValidate(yup.string().min(3, "3 plz"), {
        on: "user",
      }).or({ on: "change", ifDirty: true }),
    });

    const field = renderHook(() => useFieldAtom(nameAtom));

    domAct(() => {
      field.result.current.actions.validate();
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("invalid");
    expect(field.result.current.state.errors).toEqual(["3 plz"]);

    domAct(() => {
      field.result.current.actions.setValue("foo bar");
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("valid");
    expect(field.result.current.state.errors).toEqual([]);

    domAct(() => {
      field.result.current.actions.setValue("fo");
    });

    await domAct(() => Promise.resolve());
    expect(field.result.current.state.validateStatus).toBe("invalid");
    expect(field.result.current.state.errors).toEqual(["3 plz"]);
  });
});
