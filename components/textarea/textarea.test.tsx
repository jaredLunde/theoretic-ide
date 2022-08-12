import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./textarea";

describe("<Textarea>", () => {
  it("should add accessible label", () => {
    render(<Textarea label="Email" />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInTheDocument();
  });

  it("should add multiple accessible labels", () => {
    render(
      <div>
        <div id="label">Friends</div>
        <Textarea label="Email" aria-labelledby="label" />
      </div>
    );

    expect(
      screen.getByRole("textbox", { name: /Friends/ })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInTheDocument();
  });

  it("should add prefix", () => {
    render(<Textarea prefix={<button />} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should hide prefix until focus when label is present", () => {
    render(<Textarea prefix={<button />} label="Email" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    fireEvent.focus(screen.getByRole("textbox", { name: /Email/ }));
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should add suffix", () => {
    render(<Textarea suffix={<button />} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should transform label when focused/blurred", () => {
    render(<Textarea label="Email" />);

    expect(
      screen.getByRole("label", { name: /Email/ }).firstChild
    ).toHaveStyleRule("transform", "translate3d(0, 0, 0)");

    fireEvent.focus(screen.getByRole("textbox", { name: /Email/ }));
    expect(
      screen.getByRole("label", { name: /Email/ }).firstChild
    ).toHaveStyleRule("transform", "translate3d(0, -1.45em, 0)");
  });

  it("should hide placeholder when there is a label and the field is blurred", () => {
    render(<Textarea label="Email" placeholder="jared.lunde@gmail.com" />);

    expect(screen.getByRole("textbox", { name: /Email/ })).not.toHaveAttribute(
      "placeholder"
    );

    fireEvent.focus(screen.getByRole("textbox", { name: /Email/ }));
    expect(screen.getByRole("textbox", { name: /Email/ })).toHaveAttribute(
      "placeholder",
      "jared.lunde@gmail.com"
    );
  });

  it("should invoke onFocus/onBlur callback", () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    render(<Textarea label="Email" onFocus={onFocus} onBlur={onBlur} />);

    expect(onBlur).not.toHaveBeenCalled();
    expect(onFocus).not.toHaveBeenCalled();
    fireEvent.focus(screen.getByRole("textbox", { name: /Email/ }));
    expect(onBlur).not.toHaveBeenCalled();
    expect(onFocus).toHaveBeenCalled();
    fireEvent.blur(screen.getByRole("textbox", { name: /Email/ }));
    expect(onBlur).toHaveBeenCalled();
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it("should invoke onChange callback", () => {
    const onChange = jest.fn();
    render(<Textarea label="Email" onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
    userEvent.type(screen.getByRole("textbox", { name: /Email/ }), "Hello");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("should be readOnly", () => {
    render(<Textarea label="Email" readOnly />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toHaveAttribute(
      "readOnly"
    );
  });

  it("should be disabled", () => {
    render(<Textarea label="Email" disabled />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeDisabled();
  });
});
