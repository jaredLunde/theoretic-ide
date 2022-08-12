import { render, screen } from "@testing-library/react";
import { Form } from ".";

describe("<Form.Field>", () => {
  it("should connect to provider", () => {
    render(
      <Form initialValues={{ name: "default" }} onSubmit={jest.fn()}>
        <Form.Field>
          <input type="text" name="name" />
        </Form.Field>
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("default");
  });

  it("should connect to provider from field prop", () => {
    render(
      <Form initialValues={{ name2: "default" }} onSubmit={jest.fn()}>
        <Form.Field name="name2">
          <input type="text" name="name" />
        </Form.Field>
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("default");
  });
});

describe("<Form.BaseField>", () => {
  it("should connect to provider", () => {
    render(
      <Form initialValues={{ name: "default" }} onSubmit={jest.fn()}>
        <Form.BaseField>
          <input type="text" name="name" />
        </Form.BaseField>
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("default");
  });

  it("should connect to provider from field prop", () => {
    render(
      <Form initialValues={{ name2: "default" }} onSubmit={jest.fn()}>
        <Form.BaseField name="name2">
          <input type="text" name="name" />
        </Form.BaseField>
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("default");
  });
});
