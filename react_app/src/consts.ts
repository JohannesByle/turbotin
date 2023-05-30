export const NODE_ENV = process.env.NODE_ENV ?? "production";
export const LOGO_URL = "TurboTinLogo.png";
export const CURRENT_USER_STR = "4e29cdd3-1156-4093-b50c-263a62426f98";
export const FLASHES_STR = "52deada2-598d-496f-a122-899d39d7996e";
export const CLIENT_REQUEST_STR = "dbb85551-a874-48c4-9c05-485bfe3b7160";
export const TAB_OPACITY = 0.6;
export const APP_BAR_ID = "857dc24f-7b2a-42e7-b5f6-5ab295e5c79f";
export const ERROR_MSG_STR = "e19f4dcc-cdde-4c39-9b15-ca0d6eff4367";
export const DOLLAR_REGEX = /\$([+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?)/;
export const APP_BAR_HEIGHT = "72px";

export enum TRoute {
  full_table = "/full_table",
  individual_blends = "/individual_blends",
  email_updates = "/email_updates",
  my_account = "/my_account",
  reset_password = "/reset_password",
  change_password = "change_password",
  error = "error",
}
