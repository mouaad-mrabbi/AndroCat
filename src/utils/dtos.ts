import { ItemCategories, ItemType } from "@prisma/client";

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

//Item
export interface CreateItemDto {
  title: string;
  description: string;
  image: string;
  developer: string;
  version: string;
  androidVer: string;

  itemType: ItemType;
  categories: ItemCategories;

  OBB: boolean;
  Script: boolean;

  linkAPK: string;
  linkOBB?: string | null;
  linkVideo?: string | null;
  linkScript?: string | null;

  sizeFileAPK: string;
  sizeFileOBB?: string | null;
  sizeFileScript?: string | null;

  appScreens: string[];
  keywords: string[];

  isMod: boolean;
  typeMod?: string| null;

  ratedFor: number;
  installs: string;

  createdById?: string;
  createdAt?: string | Date;
}

export interface UpdateItemDto {
  title?: string;
  description?: string;
  image?: string;
  developer?: string;
  version?: string;
  androidVer?: string;

  itemType?: ItemType;
  categories?: ItemCategories;

  OBB?: boolean;
  Script?: boolean;

  linkAPK?: string;
  linkOBB?: string;
  linkVideo?: string;
  linkScript?: string;

  sizeFileAPK?: string;
  sizeFileOBB?: string;
  sizeFileScript?: string;

  appScreens?: string[];
  keywords?: string[];

  isMod?: boolean;
  typeMod?: string;

  ratedFor?: number;
  installs?: string;

  createdById?: string;
  createdAt?: string | Date;
}
