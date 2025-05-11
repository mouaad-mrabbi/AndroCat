export const ARTICLE_PER_PAGE = 14;
export const user_PER_PAGE = 14;
export const ARTICLE_SEARCH_PER_PAGE = 10;

const PRODUCTION_DOMAIN = "https://androcat.com";
const DEVELOPMENT_DOMAIN = "http://localhost:3000";

export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;

export const DOMAINCDN = "https://cdn.androcat.com";

export const DomainsImages = ["cdn.androcat.com"];
