import { render, screen } from "@testing-library/react";
import { styles } from "@/dash.config";
import { Icon } from "./icon";

describe("<Icon>", () => {
  it("should set a 'src'", async () => {
    render(<Icon name="System/add-box-fill" aria-label="Home" />);
    expect(screen.getByRole("img")).toHaveStyleRule(
      "mask-image",
      "url(/icons/System/add-box-fill.svg)"
    );
  });

  it("should set a 'color'", async () => {
    render(
      <Icon name="System/add-box-fill" aria-label="Home" color="amber5" />
    );
    expect(screen.getByRole("img")).toHaveStyleRule(
      "color",
      styles.tokens.color.amber5
    );
  });

  it("should set a 'size' with numeric value", async () => {
    render(<Icon name="System/add-box-fill" aria-label="Home" size={24} />);
    const img = screen.getByRole("img");
    expect(img).toHaveStyleRule("width", "24px");
    expect(img).toHaveStyleRule("height", "24px");
    expect(img).toHaveStyleRule("contain", "strict");
  });

  it("should set a 'size' with numeric array value", async () => {
    render(
      <Icon name="System/add-box-fill" aria-label="Home" size={[24, 36]} />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveStyleRule("width", "24px");
    expect(img).toHaveStyleRule("height", "36px");
    expect(img).toHaveStyleRule("contain", "strict");
  });

  it("should set a 'size' with mixed array value", async () => {
    render(
      <Icon name="System/add-box-fill" aria-label="Home" size={[24, "2rem"]} />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveStyleRule("width", "24px");
    expect(img).toHaveStyleRule("height", "2rem");
    expect(img).toHaveStyleRule("contain", "strict");
  });

  it("should set a 'size' with empty height value", async () => {
    render(
      <Icon name="System/add-box-fill" aria-label="Home" size={[24, ""]} />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveStyleRule("width", "24px");
    expect(img).toHaveStyleRule("height", "auto");
    expect(img).toHaveStyleRule("contain", "none");
  });

  it("should set a 'size' with empty width value", async () => {
    render(
      <Icon name="System/add-box-fill" aria-label="Home" size={["", 24]} />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveStyleRule("width", "auto");
    expect(img).toHaveStyleRule("height", "24px");
    expect(img).toHaveStyleRule("contain", "none");
  });

  it("should set a 'size' with null height value", async () => {
    render(
      <Icon name="System/add-box-fill" aria-label="Home" size={[24, null]} />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveStyleRule("width", "24px");
    expect(img).toHaveStyleRule("height", "auto");
    expect(img).toHaveStyleRule("contain", "none");
  });

  it("should set a 'size' with null width value", async () => {
    render(
      <Icon name="System/add-box-fill" aria-label="Home" size={[null, 24]} />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveStyleRule("width", "auto");
    expect(img).toHaveStyleRule("height", "24px");
    expect(img).toHaveStyleRule("contain", "none");
  });

  it("should set a 'size' with null values", async () => {
    render(
      <Icon name="System/add-box-fill" aria-label="Home" size={[null, null]} />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveStyleRule("width", "1em");
    expect(img).toHaveStyleRule("height", "1em");
    expect(img).toHaveStyleRule("contain", "strict");
  });

  it("should set a default 'size'", async () => {
    render(<Icon name="System/add-box-fill" aria-label="Home" />);
    const img = screen.getByRole("img");
    expect(img).toHaveStyleRule("width", "1em");
    expect(img).toHaveStyleRule("height", "1em");
    expect(img).toHaveStyleRule("contain", "strict");
  });

  it("should be hidden without 'aria-label' attribute", async () => {
    render(<Icon name="System/add-box-fill" />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should set custom 'role' attribute", async () => {
    render(
      <Icon name="System/add-box-fill" role="tooltip" aria-label="Home" />
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});
