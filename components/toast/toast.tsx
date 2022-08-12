import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { proxy, ref, useSnapshot } from "valtio";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/icon-button";
import { styles } from "@/dash.config";
import { overlay, vstack } from "@/styles/layout";
import { text } from "@/styles/text";

/**
 * This component displays toast notifications in the UI.
 */
export function Toast() {
  const state = useSnapshot(toastsStore);

  if (typeof document === "undefined") {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={overlay({
        offset: styles.tokens.pad[400],
        placement: "top",
        z: "max",
        width: 460,
        maxWidth: "90vw",
        position: "fixed",
      })}
      style={{
        pointerEvents: "none",
      }}
    >
      <div className={vstack({ gap: 300 })}>
        <AnimatePresence>
          {state.map((item: ToastsStoreState) => (
            <motion.div
              key={item.id}
              role={item.role}
              layoutId={item.id}
              drag="y"
              dragConstraints={{
                top: 0,
                bottom: 0,
              }}
              onDragEnd={(e, i) => {
                if (i.velocity.y < -100) {
                  toastsActions.remove(item.id);
                }
              }}
              initial={{
                opacity: 0,
                y: -56,
                scale: 0.9,
                transformOrigin: "top",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transformOrigin: "top",
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: -12,
                transformOrigin: "top",
                transition: { duration: 0.2 },
              }}
              transition={{ type: "spring", bounce: 0 }}
              onMouseEnter={() => toastsActions.pauseTimeout(item.id)}
              onMouseLeave={() => toastsActions.resumeTimeout(item.id)}
              className={toastStyles()}
            >
              <div className="icon">
                <Icon size="1.25em" name={variantIcon[item.variant]} />
              </div>

              <div>
                {item.subject && (
                  <h3
                    className={text({
                      weight: 500,
                      size: 200,
                      leading: 300,
                    })}
                  >
                    {item.subject}
                  </h3>
                )}
                <p
                  className={text({
                    leading: 200,
                    color: "blueGray400",
                    size: 100,
                  })}
                >
                  {item.message}
                </p>
              </div>

              <IconButton
                onClick={() => toastsActions.remove(item.id)}
                size="xs"
                color="secondary"
                icon="System/close-line"
                aria-label="Close this notification"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>,
    document.body
  );
}

let ID = 0;

/**
 * A function that adds toast messages to the store. It returns a callback
 * that can be used to remove the toast message.
 *
 * @param root0
 * @param root0.ttl
 * @param root0.variant
 * @param root0.role
 */
export function toast({
  ttl = 6500,
  variant = "info",
  role = "alert",
  ...toast
}: ToastNotification) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const id = "toast-" + ID++;
  const timeout = window.setTimeout(() => toastsActions.remove(id), ttl);

  toastsActions.add({
    id,
    variant,
    timeout,
    role,
    startedAt: Date.now(),
    ttl,
    ...toast,
  });

  return () => {
    clearTimeout(timeout);
    toastsActions.remove(id);
  };
}

export const toastsStore = proxy<
  (ToastsStoreState & {
    $$valtioRef: true;
  })[]
>([]);
export const toastsActions = {
  add(toast: ToastsStoreState) {
    toastsStore.push(ref(toast));
  },

  pauseTimeout(id: string) {
    const toast = toastsStore.find((toast) => toast.id === id);
    if (!toast) return;
    window.clearTimeout(toast.timeout);
    toast.ttl = toast.ttl - (Date.now() - toast.startedAt);
  },

  resumeTimeout(id: string) {
    const toast = toastsStore.find((toast) => toast.id === id);
    if (!toast) return;
    toast.timeout = window.setTimeout(() => {
      toastsActions.remove(id);
    }, toast.ttl);
    toast.startedAt = Date.now();
  },

  remove(id: string) {
    const index = toastsStore.findIndex((toast) => toast.id === id);
    if (index === -1) return;
    const toast = toastsStore[index];
    toastsStore.splice(index, 1);
    window.clearTimeout(toast.timeout);
  },

  clear() {
    toastsStore.length = 0;
  },
};

type ToastsStoreState = {
  id: string;
  timeout: number;
  startedAt: number;
  ttl: number;
  variant: Exclude<ToastNotification["variant"], undefined>;
  role?: "alert" | "log";
} & (
  | {
      /**
       * The subject of the toast notification
       */
      subject: React.ReactNode;
      /**
       * The main content of the toast notification
       */
      message?: React.ReactNode;
    }
  | {
      /**
       * The subject of the toast notification
       */
      subject?: React.ReactNode;
      /**
       * The main content of the toast notification
       */
      message: React.ReactNode;
    }
);

const variantIcon = {
  success: "System/checkbox-circle-fill",
  info: "System/information-fill",
  danger: "System/error-warning-fill",
  warn: "System/error-warning-fill",
} as const;

const toastStyles = styles.one((t) => ({
  display: "grid",
  alignItems: "start",
  gap: t.gap[400],
  gridTemplateColumns: "min-content minmax(0, 1fr) min-content",
  borderRadius: t.radius.primary,
  padding: t.pad[400],
  backgroundColor: t.toast.color.bg,
  boxShadow: t.shadow[600],
  color: t.toast.color.text,
  width: "100%",
  maxHeight: t.vh,
  pointerEvents: "auto",

  ".icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 3,
    color: t.toast.color.icon,
    width: "1.25em",
    height: "1.25em",
    borderRadius: t.radius.max,
    backgroundColor: "transparent",
    boxShadow: t.shadow[200],
  },

  a: {
    color: t.color.text,

    ":hover": {
      color: t.color.text,
      textDecoration: "underline",
    },
  },
}));

type ToastNotification = {
  /**
   * The type of toast notification on display
   *
   * @default "info"
   */
  variant?: "success" | "danger" | "warn" | "info";
  /**
   * Sets the aria "role" of the toast notification.
   * - `alert`: interrupts any ongoing messages being read by the screen reader
   * - `log`: will wait for messages being read by the screen reader to finish before
   *   reading the toast notification
   *
   * @default "alert"
   */
  role?: "alert" | "log";
  /**
   * The amount of time in milliseconds the toast notification will be displayed
   * in the UI
   */
  ttl?: number;
} & (
  | {
      /**
       * The subject of the toast notification
       */
      subject: React.ReactNode;
      /**
       * The main content of the toast notification
       */
      message?: React.ReactNode;
    }
  | {
      /**
       * The subject of the toast notification
       */
      subject?: React.ReactNode;
      /**
       * The main content of the toast notification
       */
      message: React.ReactNode;
    }
);
