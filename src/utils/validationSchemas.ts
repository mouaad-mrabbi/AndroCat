import { ItemCategories, ItemType } from "@prisma/client";
import { z } from "zod";

// Register Schema
export const registerSchema = z.object({
  username: z.string().min(2).max(30), //.optional(),
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6),
});

//update User Schema
export const updateUserSchema = z.object({
  username: z.string().min(2).max(30).optional(),
  email: z.string().min(3).max(200).email().optional(),
  password: z.string().min(6).optional(),
});

// Create pending Item Schema
export const createItemSchema = z
  .object({
    title: z.string().min(2).max(50),
    description: z.string().min(10).max(500),
    image: z.string().url().max(500),
    developer: z.string().min(2).max(50),
    version: z.string().min(1).max(50),
    androidVer: z.string().min(1).max(20),

    itemType: z.nativeEnum(ItemType),
    categories: z.nativeEnum(ItemCategories, { message: "category" }),

    OBB: z.boolean().default(false),
    Script: z.boolean().default(false),

    linkAPK: z.string().url().max(500),
    linkOBB: z.string().url().max(500).nullable().optional(),
    linkVideo: z.string().url().max(500).nullable().optional(),
    linkScript: z.string().url().max(500).nullable().optional(),

    sizeFileAPK: z.string().min(1).max(20),
    sizeFileOBB: z.string().min(1).max(20).nullable().optional(),
    sizeFileScript: z.string().min(1).max(20).nullable().optional(),

    appScreens: z.array(z.string().url().max(500)).nonempty().min(1),
    keywords: z.array(z.string().min(1).max(50)).nonempty().min(1),

    isMod: z.boolean().default(false),
    typeMod: z.string().min(2).max(50).nullable().optional(),

    ratedFor: z.number().min(1).max(20),
    installs: z.string().min(1).max(20),
  })
  .superRefine((data, ctx) => {
    //obb
    if (data.OBB) {
      if (!data.linkOBB) {
        ctx.addIssue({
          code: "custom",
          message: "link OBB is required when OBB is true",
          path: ["linkOBB"],
        });
      }
      if (!data.sizeFileOBB) {
        ctx.addIssue({
          code: "custom",
          message: "size File OBB is required when OBB is true",
          path: ["sizeFileOBB"],
        });
      }
    } else {
      if (data.linkOBB) {
        ctx.addIssue({
          code: "custom",
          message: "link OBB should not be provided when OBB is false",
          path: ["linkOBB"],
        });
      }
      if (data.sizeFileOBB) {
        ctx.addIssue({
          code: "custom",
          message: "size File OBB should not be provided when OBB is false",
          path: ["sizeFileOBB"],
        });
      }
    }

    // Script
    if (data.Script) {
      if (!data.linkScript) {
        ctx.addIssue({
          code: "custom",
          message: "linkScript is required when Script is true",
          path: ["linkScript"],
        });
      }
      if (!data.sizeFileScript) {
        ctx.addIssue({
          code: "custom",
          message: "sizeFileScript is required when Script is true",
          path: ["sizeFileScript"],
        });
      }
    } else {
      if (data.linkScript) {
        ctx.addIssue({
          code: "custom",
          message: "linkScript should not be provided when Script is false",
          path: ["linkScript"],
        });
      }
      if (data.sizeFileScript) {
        ctx.addIssue({
          code: "custom",
          message: "sizeFileScript should not be provided when Script is false",
          path: ["sizeFileScript"],
        });
      }
    }

    if (data.isMod && !data.typeMod) {
      ctx.addIssue({
        code: "custom",
        message: "type Mod is required when isMod is true",
        path: ["typeMod"],
      });
    }

    if (!data.isMod && data.typeMod) {
      ctx.addIssue({
        code: "custom",
        message: "type Mod should not be provided when isMod is false",
        path: ["typeMod"],
      });
    }
  });

export const updateItemSchema = z
  .object({
    title: z.string().min(2).max(50).optional(),
    description: z.string().min(10).max(500).optional(),
    image: z.string().url().max(500).optional(),
    developer: z.string().min(2).max(50).optional(),
    version: z.string().min(1).max(50).optional(),
    androidVer: z.string().min(1).max(20).optional(),

    itemType: z.nativeEnum(ItemType).optional(),
    categories: z
      .nativeEnum(ItemCategories, { message: "Invalid category" })
      .optional(),

    OBB: z.boolean().optional(),
    Script: z.boolean().optional(),

    linkAPK: z.string().url().max(500).optional(),
    linkOBB: z.string().url().max(500).nullable().optional(),
    linkVideo: z.string().url().max(500).optional(),
    linkScript: z.string().url().max(500).nullable().optional(),

    sizeFileAPK: z.string().min(1).max(20).optional(),
    sizeFileOBB: z.string().min(1).max(20).nullable().optional(),
    sizeFileScript: z.string().min(1).max(20).nullable().optional(),

    appScreens: z.array(z.string().url().max(500)).min(1).optional(),
    keywords: z.array(z.string().min(1).max(50)).min(1).optional(),

    isMod: z.boolean().optional(),
    typeMod: z.string().min(2).max(50).nullable().optional(),

    ratedFor: z.number().min(1).max(20).optional(),
    installs: z.string().min(1).max(20).optional(),
  })
  .superRefine((data, ctx) => {
    // تحقق من OBB
    if (data.OBB) {
      if (!data.linkOBB) {
        ctx.addIssue({
          code: "custom",
          message: "linkOBB is required when OBB is true",
          path: ["linkOBB"],
        });
      }
      if (!data.sizeFileOBB) {
        ctx.addIssue({
          code: "custom",
          message: "sizeFileOBB is required when OBB is true",
          path: ["sizeFileOBB"],
        });
      }
    } else if (data.OBB === false) {
      if (data.linkOBB) {
        ctx.addIssue({
          code: "custom",
          message: "linkOBB should not be provided when OBB is false",
          path: ["linkOBB"],
        });
      }
      if (data.sizeFileOBB) {
        ctx.addIssue({
          code: "custom",
          message: "sizeFileOBB should not be provided when OBB is false",
          path: ["sizeFileOBB"],
        });
      }
    }

    // تحقق من Script
    if (data.Script) {
      if (!data.linkScript) {
        ctx.addIssue({
          code: "custom",
          message: "linkScript is required when Script is true",
          path: ["linkScript"],
        });
      }
      if (!data.sizeFileScript) {
        ctx.addIssue({
          code: "custom",
          message: "sizeFileScript is required when Script is true",
          path: ["sizeFileScript"],
        });
      }
    } else if (data.Script === false) {
      if (data.linkScript) {
        ctx.addIssue({
          code: "custom",
          message: "linkScript should not be provided when Script is false",
          path: ["linkScript"],
        });
      }
      if (data.sizeFileScript) {
        ctx.addIssue({
          code: "custom",
          message: "sizeFileScript should not be provided when Script is false",
          path: ["sizeFileScript"],
        });
      }
    }

    // تحقق من isMod
    if (data.isMod && !data.typeMod) {
      ctx.addIssue({
        code: "custom",
        message: "typeMod is required when isMod is true",
        path: ["typeMod"],
      });
    }

    if (!data.isMod && data.typeMod) {
      ctx.addIssue({
        code: "custom",
        message: "typeMod should not be provided when isMod is false",
        path: ["typeMod"],
      });
    }
  });
