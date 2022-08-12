import clsx from "clsx";
import * as React from "react";
import { Icon } from "@/components/icon";
import { Link } from "@/components/link";
import { tab, TabbedNav } from "@/components/tabbed-nav";
import { styles } from "@/dash.config";
import { routes } from "@/routes.config";
import { useMe } from "@/stores/me";
import { box, grid, vstack } from "@/styles/layout";
import { text } from "@/styles/text";

export function Dashboard({ children }: { children: React.ReactNode }) {
  const [me] = useMe();

  return (
    <div
      className={grid({
        cols: {
          min: ["1fr"],
          sm: [320, "1fr"],
          lg: [224, 320, "1fr"],
        },
        height: styles.tokens.vh,
      })}
    >
      <header
        className={vstack({
          width: "100%",
          pad: 400,
          gap: "em500",
          border: [["none", 50, "none", "none"], "blueGray200"],
        })}
      >
        <Link
          to="home"
          params={{ displayName: me.data?.teams[0].displayName }}
          className={clsx(
            tab("hasIcon"),
            text({ tracking: -200, weight: 500, size: 100, color: "text" })
          )}
        >
          <Icon name="zap" style={{ transform: "rotate(90deg)" }} />
          <span>Theoretic</span>
        </Link>

        <section className={vstack({ gap: 300 })}>
          <h2 className={navHeader()}>Workspaces</h2>

          <TabbedNav>
            <TabbedNav.Tab
              to="workspace"
              params={{
                displayName: "jared",
                workspace: "css",
              }}
              icon="Development/terminal-box-fill"
              isActive={
                new RegExp(
                  "^" +
                    routes.workspace({
                      displayName: "jared",
                      workspace: "css",
                    }) +
                    "(/|$)"
                )
              }
            >
              CSS
            </TabbedNav.Tab>
            <TabbedNav.Tab
              to="workspace"
              params={{
                displayName: "jared",
                workspace: "react",
              }}
              icon="Development/terminal-box-fill"
              isActive={
                new RegExp(
                  "^" +
                    routes.workspace({
                      displayName: "jared",
                      workspace: "react",
                    }) +
                    "(/|$)"
                )
              }
            >
              React
            </TabbedNav.Tab>
            <TabbedNav.Tab
              to="workspace"
              params={{
                displayName: "jared",
                workspace: "management",
              }}
              icon="Development/terminal-box-fill"
              isActive={
                new RegExp(
                  "^" +
                    routes.workspace({
                      displayName: "jared",
                      workspace: "management",
                    }) +
                    "(/|$)"
                )
              }
            >
              Management
            </TabbedNav.Tab>
            <TabbedNav.Tab
              to="workspace"
              params={{
                displayName: "jared",
                workspace: "being-and-nothingness",
              }}
              icon="Development/terminal-box-fill"
              isActive={
                new RegExp(
                  "^" +
                    routes.workspace({
                      displayName: "jared",
                      workspace: "being-and-nothingness",
                    }) +
                    "(/|$)"
                )
              }
            >
              Being and Nothingness
            </TabbedNav.Tab>
          </TabbedNav>
        </section>
      </header>

      {children}
    </div>
  );
}

function navHeader() {
  return clsx(
    box({
      pad: ["em400", "em400"],
    }),
    text({
      size: 50,
      weight: 500,
      color: "text500",
    })
  );
}
