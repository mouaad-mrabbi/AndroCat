import { ArticleType, GameCategories, ProgramCategories } from "@prisma/client";

//User
export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
}

//Article
export interface CreateArticleDto {
  title: string;
  secondTitle?: string | null;
  description: string;
  descriptionMeta: string;
  image: string;
  developer: string;
  version: string;
  versionOriginal?: string | null;
  androidVer: string;

  articleType: ArticleType;
  gameCategory?: GameCategories | null;
  programCategory?: ProgramCategories | null;

  OBB: boolean;
  Script: boolean;
  OriginalAPK: boolean;

  linkAPK: string;
  linkOBB?: string | null;
  linkVideo?: string | null;
  linkScript?: string | null;
  linkOriginalAPK?: string | null;

  sizeFileAPK: string;
  sizeFileOBB?: string | null;
  sizeFileScript?: string | null;
  sizeFileOriginalAPK?: string | null;

  appScreens: string[];
  keywords: string[];

  isMod: boolean;
  typeMod?: string | null;

  ratedFor: number;
  installs: string;

  createdById: number;
  createdAt?: string | Date;

  paragraphs?: {
    title?: string;
    content: string;
  }[];
}

export interface UpdateArticleDto {
  title?: string;
  secondTitle?: string;
  description?: string;
  descriptionMeta?: string;
  image?: string;
  developer?: string;
  version?: string;
  versionOriginal?: string;
  androidVer?: string;

  articleType?: ArticleType;
  gameCategory?: GameCategories;
  programCategory?: ProgramCategories;

  OBB?: boolean;
  Script?: boolean;
  OriginalAPK?: boolean;

  linkAPK?: string;
  linkOBB?: string;
  linkVideo?: string;
  linkScript?: string;
  linkOriginalAPK?: string;

  sizeFileAPK?: string;
  sizeFileOBB?: string;
  sizeFileScript?: string;
  sizeFileOriginalAPK?: string;

  appScreens?: string[];
  keywords?: string[];

  isMod?: boolean;
  typeMod?: string;

  ratedFor?: number;
  installs?: string;

  createdById?: number;
  createdAt?: string | Date;

  paragraphs?: {
    title?: string;
    content: string;
  }[];
}
