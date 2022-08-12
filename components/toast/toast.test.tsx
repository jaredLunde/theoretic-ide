import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast, Toast, toastsActions, toastsStore } from "./toast";

afterEach(() => {
  toastsActions.clear();
});

describe("toastsStore", () => {
  it("should push a toast to the store", () => {
    toast({ ttl: 5000, subject: "Success", message: "Hello world" });
    const [toastState] = toastsStore;
    expect(toastState.variant).toBe("info");
    expect(toastState.role).toBe("alert");
    expect(toastState.ttl).toBe(5000);
    expect(typeof toastState.id).toBe("string");
    expect(toastState.subject).toBe("Success");
    expect(toastState.message).toBe("Hello world");
    expect(toastState.startedAt).toBeCloseTo(Date.now());
    expect(Object.keys(toastState).sort()).toEqual([
      "id",
      "message",
      "role",
      "startedAt",
      "subject",
      "timeout",
      "ttl",
      "variant",
    ]);
  });

  it("should set a variant", () => {
    toast({ variant: "danger", message: "Hello world" });
    const [toastState] = toastsStore;
    expect(toastState.variant).toBe("danger");
  });

  it("should remove toast from store after ttl", () => {
    toast({ ttl: 500, subject: "Success", message: "Hello world" });
    expect(toastsStore.length).toBe(1);
    jest.advanceTimersByTime(500);
    expect(toastsStore.length).toBe(0);
  });

  it("should pause and restart toast ttl", () => {
    toast({ ttl: 2000, subject: "Success", message: "Hello world" });
    expect(toastsStore.length).toBe(1);
    jest.advanceTimersByTime(1000);

    toastsActions.pauseTimeout(toastsStore[0].id);
    jest.advanceTimersByTime(1000);
    expect(toastsStore.length).toBe(1);

    toastsActions.resumeTimeout(toastsStore[0].id);
    jest.advanceTimersByTime(1000);
    expect(toastsStore.length).toBe(0);
  });

  it("should remove toast when callback returned is invoked", () => {
    const remove = toast({
      ttl: 2000,
      subject: "Success",
      message: "Hello world",
    });
    expect(toastsStore.length).toBe(1);
    remove();
    expect(toastsStore.length).toBe(0);
  });
});

describe("<Toast>", () => {
  it("should display toast in the ui", async () => {
    render(<Toast />);
    act(() => {
      toast({ subject: "Success" });
    });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("should remove toast from the ui after ttl", async () => {
    render(<Toast />);

    act(() => {
      toast({ subject: "Success", ttl: 1000 });
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  it("should close toast when close button is pushed", async () => {
    render(<Toast />);

    act(() => {
      toast({ subject: "Success", ttl: 1000 });
    });

    await waitFor(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Close this notification" })
      );
    });

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  it("should change role to 'log'", async () => {
    render(<Toast />);

    act(() => {
      toast({ subject: "Success", role: "log", ttl: 1000 });
    });

    await waitFor(() => {
      expect(screen.getByRole("log")).toBeInTheDocument();
    });
  });

  it("should pause ttl when mouse is over", async () => {
    render(<Toast />);

    act(() => {
      toast({ subject: "Success", ttl: 1000 });
    });

    await waitFor(async () => {
      await userEvent.hover(screen.getByRole("alert"));
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    await waitFor(async () => {
      await userEvent.unhover(screen.getByRole("alert"));
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });
});
