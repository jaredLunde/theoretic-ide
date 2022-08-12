export const routes = {
  /**
   * Route to the home page
   *
   * @param config
   */
  home(config?: Profile) {
    return config?.displayName
      ? (`/@${config.displayName}` as const)
      : ("/" as const);
  },

  /**
   * Route to the sign up page
   */
  signUp() {
    return "/sign-up" as const;
  },

  /**
   * Route to the log in page
   */
  logIn() {
    return "/log-in" as const;
  },

  /**
   * Route to the forgot password page
   */
  forgotPassword() {
    return "/forgot-password" as const;
  },

  /**
   * Route to a user's profile.
   *
   * @param root0
   * @param root0.displayName
   */
  profile({ displayName }: Profile) {
    return `/@${displayName}` as const;
  },

  /**
   * Route to a workspace.
   *
   * @param root0
   * @param root0.displayName
   * @param root0.workspace
   */
  workspace({ displayName, workspace }: Workspace) {
    return `/@${displayName}/${workspace}` as const;
  },

  /**
   * Route to a notebook.
   *
   * @param root0
   * @param root0.displayName
   * @param root0.workspace
   * @param root0.notebook
   */
  notebook({ displayName, workspace, notebook }: Notebook) {
    return `/@${displayName}/${workspace}/${notebook}` as const;
  },

  /**
   * Route to account settings
   *
   * @param root0
   * @param root0.displayName
   * @param root0.tab
   */
  account({ displayName, tab = "profile" }: Account) {
    return `/@${displayName}/account/${tab}` as const;
  },
};

export type Profile = {
  /**
   * The user's display name
   */
  displayName?: string;
};

export type Workspace = Profile & {
  /**
   * The workspace's slug
   */
  workspace: string;
  /**
   * The workspace's subpages
   */
  tab?: "settings";
};

export type Notebook = Workspace & {
  /**
   * The notebook's slug
   */
  notebook: string;
  /**
   * The notebook's subpages
   */
  tab?: "settings";
};

export type Account = Profile & {
  /**
   * The account page tab
   */
  tab?: "preferences" | "auth" | "profile";
};
