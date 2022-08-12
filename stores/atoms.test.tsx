import { render } from "@testing-library/react";
import { useAtom } from "jotai";
import * as React from "react";
import { persistAtom } from "./atoms";

describe("persistAtom()", () => {
  it("should set initial value", () => {
    const theme = persistAtom<"light" | "dark">("theme", "light");
    let value: any;
    const Component = () => {
      value = useAtom(theme);
      return null;
    };

    render(<Component />);
    expect(value[0]).toBe("light");
  });

  it("should persist value to localStorage on mount", () => {
    persistAtom<"light" | "dark">("theme", "light");

    expect(localStorage.getItem("theme")).toBe(
      JSON.stringify({ value: "light", version: 1 })
    );
  });

  it("should persist value to localStorage on set", () => {
    const theme = persistAtom<"light" | "dark">("theme", "light");

    const Component = () => {
      const [, setValue] = useAtom(theme);
      React.useEffect(() => {
        setValue("dark");
      });
      return null;
    };

    render(<Component />);
    expect(localStorage.getItem("theme")).toBe(
      JSON.stringify({ value: "dark", version: 1 })
    );
  });

  it("should replace stale versions", () => {
    persistAtom<"light" | "dark">("theme", "light");
    expect(localStorage.getItem("theme")).toBe(
      JSON.stringify({ value: "light", version: 1 })
    );

    persistAtom<"light" | "dark">("theme", "dark", { version: 2 });
    expect(localStorage.getItem("theme")).toBe(
      JSON.stringify({ value: "dark", version: 2 })
    );
  });

  it("should not overwrite stored values on mount", () => {
    persistAtom<"light" | "dark">("theme", "light");
    expect(localStorage.getItem("theme")).toBe(
      JSON.stringify({ value: "light", version: 1 })
    );

    persistAtom<"light" | "dark">("theme", "dark");
    expect(localStorage.getItem("theme")).toBe(
      JSON.stringify({ value: "light", version: 1 })
    );
  });
});
