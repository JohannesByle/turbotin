import { fromPairs, toPairs } from "lodash";
import { Store } from "./protos/turbotin_pb";

export const NODE_ENV = process.env.NODE_ENV ?? "production";
export const IS_PROD = NODE_ENV === "production";
export const LOGO_URL = "/TurboTinLogo.png";
export const CURRENT_USER_STR = "4e29cdd3-1156-4093-b50c-263a62426f98";
export const FLASHES_STR = "52deada2-598d-496f-a122-899d39d7996e";
export const CLIENT_REQUEST_STR = "dbb85551-a874-48c4-9c05-485bfe3b7160";
export const TAB_OPACITY = 0.6;
export const ERROR_MSG_STR = "e19f4dcc-cdde-4c39-9b15-ca0d6eff4367";
export const DOLLAR_REGEX = /\$([+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?)/;
export const APP_BAR_HEIGHT = "72px";
export const JWT_KEY = "jwt";
export const BLEND = "Blend";
export const INDIVIDUAL_BLENDS = "/individual_blends";

export enum TAuthLevel {
  none,
  user,
  admin,
}

export enum TRoute {
  full_table = "/full_table",
  individual_blends = "/individual_blends",
  individual_blend = "/individual_blends/:tag_id",
  email_updates = "/email_updates",
  my_account = "/my_account",
  reset_password = "/reset_password",
  change_password = "/change_password/:user_id/:code",
  error = "/error",
  verify_email = "/verify_email/:user_id/:code",
  admin = "/admin/",
}

export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60 * MS_PER_SECOND;

export function voidFn(): void {
  return undefined;
}

export const STORE_TO_NAME: Record<Store, string> = {
  [Store.STORE_UNSPECIFIED]: "",
  [Store.STORE_JUST4HIM]: "Just4Him",
  [Store.STORE_4NOGGINS]: "4noggins",
  [Store.STORE_TOPHAT]: "Top Hat",
  [Store.STORE_CUPOJOES]: "Cup O' Joes",
  [Store.STORE_MARSCIGARS]: "mars cigars",
  [Store.STORE_MILAN]: "Milan",
  [Store.STORE_SMOKINGPIPES]: "Smokingpipes",
  [Store.STORE_NICEASHCIGARS]: "Nice Ash Cigars",
  [Store.STORE_IWANRIES]: "Iwan Ries",
  [Store.STORE_MCCRANIES]: "McCranie's",
  [Store.STORE_BOSWELL]: "Boswell",
  [Store.STORE_LILBROWN]: "lilbrown",
  [Store.STORE_WINDYCITYCIGARS]: "Windy City Cigars",
  [Store.STORE_BNB]: "BnB",
  [Store.STORE_THEBRIARY]: "The Briary",
  [Store.STORE_KBVEN]: "Ken Byron Ventures",
  [Store.STORE_TOBACCOPIPES]: "Tobacco Pipes",
  [Store.STORE_KINGSMOKING]: "King Smoking",
  [Store.STORE_COUNTRYSQUIRE]: "Country Squire",
  [Store.STORE_PIPESANDCIGARS]: "Pipes and Cigars",
  [Store.STORE_WATCHCITYCIGAR]: "Watch City Cigar",
  [Store.STORE_THESTORYTELLERS]: "The Story Teller's",
  [Store.STORE_PAYLESS]: "Payless",
  [Store.STORE_HILANDSCIGARS]: "Hiland's Cigars",
  [Store.STORE_PIPEANDLEAF]: "Pipe & Leaf",
  [Store.STORE_CIGARSINTL]: "Cigars International",
  [Store.STORE_EACAREY]: "EA Carey",
  [Store.STORE_PIPENOOK]: "The Pipe Nook",
  [Store.STORE_WILKE]: "wilkepipetobacco",
  [Store.STORE_SMOKERSHAVEN]: "Smokers' Haven",
  [Store.STORE_BLACKCATCIGARS]: "Black Cat Cigar Company",
  [Store.STORE_ANSTEADS]: "Anstead's Tobacco Company",
  [Store.STORE_CDMCIGARS]: "CDM Cigars",
  [Store.STORE_LJPERETTI]: "L.J. Peretti",
  [Store.STORE_OUTWEST]: "Outwest",
};

export const NAME_TO_STORE = fromPairs(
  toPairs(STORE_TO_NAME).map(([k, v]) => [v, Number(k)])
) as Record<string, Store>;

export const EMPTY_ARR = [] as [];

export const CENTER_PAGE_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  mt: "25vh",
} as const;

export { default as KebapMenu } from "@mui/icons-material/MoreVert";
