import { render, screen } from "@testing-library/react";
import { Fieldset } from "./fieldset";

describe("<Fieldset>", () => {
  it("should append class name a fieldset", () => {
    render(<Fieldset className="foo" />);
    expect(screen.getByRole("group")).toHaveClass("foo");
  });
});

describe("<Legend>", () => {
  it("should forward aria-* props to visually hidden legend element", () => {
    render(
      <Fieldset>
        <Fieldset.Legend aria-label="foo">Hello</Fieldset.Legend>
      </Fieldset>
    );

    expect(screen.getAllByText("Hello")[0]).toHaveAttribute("aria-label");
    expect(screen.getAllByText("Hello")[1]).not.toHaveAttribute("aria-label");
  });

  it("should forward role prop to visually hidden legend element", () => {
    render(
      <Fieldset>
        <Fieldset.Legend role="heading">Hello</Fieldset.Legend>
      </Fieldset>
    );

    expect(screen.getAllByText("Hello")[0]).toHaveAttribute("role");
    expect(screen.getAllByText("Hello")[1]).not.toHaveAttribute("role");
  });

  it("should not forward non role/aria-* props to visually hidden legend element", () => {
    render(
      <Fieldset>
        <Fieldset.Legend className="foo">Hello</Fieldset.Legend>
      </Fieldset>
    );

    expect(screen.getAllByText("Hello")[0]).not.toHaveClass("foo");
    expect(screen.getAllByText("Hello")[1]).toHaveClass("foo");
  });
});
