export const ITEM_PER_PAGE = 14;
export const user_PER_PAGE = 14;
export const ITEM_SEARCH_PER_PAGE = 10;

const PRODUCTION_DOMAIN = "https://androcat.vercel.app";
const DEVELOPMENT_DOMAIN = "http://localhost:3000";

export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;


export const DomainsImages=[ "cacbbglbdrhnfhrmztmz.supabase.co"]