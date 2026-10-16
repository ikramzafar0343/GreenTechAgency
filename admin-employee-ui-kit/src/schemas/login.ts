export type LoginFormValues = {
  readonly email: string;
  readonly password: string;
};

export type LoginFieldErrors = {
  readonly email?: string;
  readonly password?: string;
};
