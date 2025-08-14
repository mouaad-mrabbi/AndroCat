import {
  ArticleType,
  GameCategories,
  ProgramCategories,
  ScreenType,
} from "@prisma/client";
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

// Create pending article Schema
export const createArticleSchema = z
  .object({
    title: z.string().min(2).max(50),
    secondTitle: z.string().min(2).max(50).nullable().optional(),
    description: z.string().min(10).max(1500),
    descriptionMeta: z.string().min(10).max(500),
    image: z.string().max(500),
    developer: z.string().min(2).max(50),
    version: z.string().min(1).max(50),
    versionOriginal: z.string().min(1).max(50).nullable().optional(),
    androidVer: z.string().min(1).max(20),

    articleType: z.nativeEnum(ArticleType),
    gameCategory: z
      .nativeEnum(GameCategories, { message: "Game Categories" })
      .nullable()
      .optional(),

    programCategory: z
      .nativeEnum(ProgramCategories, { message: "Program Categories" })
      .nullable()
      .optional(),

    OBB: z.boolean().default(false),
    Script: z.boolean().default(false),
    OriginalAPK: z.boolean().default(false),

    linkAPK: z.string().max(500),
    linkOBB: z.string().max(500).nullable().optional(),
    linkVideo: z.string().max(500).nullable().optional(),
    linkScript: z.string().max(500).nullable().optional(),
    linkOriginalAPK: z.string().max(500).nullable().optional(),

    sizeFileAPK: z.string().min(1).max(20),
    sizeFileOBB: z.string().min(1).max(20).nullable().optional(),
    sizeFileScript: z.string().min(1).max(20).nullable().optional(),
    sizeFileOriginalAPK: z.string().min(1).max(20).nullable().optional(),

    screenType: z.nativeEnum(ScreenType),
    appScreens: z.array(z.string().max(500)).nonempty().min(1),
    keywords: z.array(z.string().min(1).max(50)).nonempty().min(1),

    isMod: z.boolean().default(false),
    typeMod: z.string().min(2).max(50).nullable().optional(),

    ratedFor: z.number().min(1).max(20),
    installs: z.string().min(1).max(20),

    paragraphs: z
      .array(
        z.object({
          title: z.string().optional(),
          content: z.string().min(5),
        })
      )
      .optional(),

    apks: z
      .array(
        z.object({
          version: z.string().min(1),
          link: z.string().min(5),
          size: z.string().min(3),
          isMod: z.boolean(),
        })
      )
      .nonempty()
      .optional(),
    xapks: z
      .array(
        z.object({
          version: z.string().min(1),
          link: z.string().min(5),
          size: z.string().min(3),
          isMod: z.boolean(),
        })
      )
      .nonempty()
      .optional(),
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

    // Original
    if (data.OriginalAPK) {
      if (!data.linkOriginalAPK) {
        ctx.addIssue({
          code: "custom",
          message: "linkOriginalAPK is required when OriginalAPK is true",
          path: ["linkOriginalAPK"],
        });
      }
      if (!data.sizeFileOriginalAPK) {
        ctx.addIssue({
          code: "custom",
          message: "sizeFileOriginalAPK is required when OriginalAPK is true",
          path: ["sizeFileOriginalAPK"],
        });
      }
      if (!data.versionOriginal) {
        ctx.addIssue({
          code: "custom",
          message: "versionOriginal is required when OriginalAPK is true",
          path: ["versionOriginal"],
        });
      }
    } else {
      if (data.linkOriginalAPK) {
        ctx.addIssue({
          code: "custom",
          message:
            "linkOriginalAPK should not be provided when OriginalAPK is false",
          path: ["linkOriginalAPK"],
        });
      }
      if (data.sizeFileOriginalAPK) {
        ctx.addIssue({
          code: "custom",
          message:
            "sizeFileOriginalAPK should not be provided when OriginalAPK is false",
          path: ["sizeFileOriginalAPK"],
        });
      }
      if (data.versionOriginal) {
        ctx.addIssue({
          code: "custom",
          message:
            "versionOriginal should not be provided when OriginalAPK is false",
          path: ["versionOriginal"],
        });
      }
    }

    //isMod
    if (data.isMod) {
      if (!data.typeMod) {
        ctx.addIssue({
          code: "custom",
          message: "type Mod is required when isMod is true",
          path: ["typeMod"],
        });
      }
    } else {
      if (data.typeMod) {
        ctx.addIssue({
          code: "custom",
          message: "type Mod should not be provided when isMod is false",
          path: ["typeMod"],
        });
      }
    }

    // category validation based on articleType
    if (data.articleType === "GAME") {
      if (!data.gameCategory) {
        ctx.addIssue({
          code: "custom",
          message: "gameCategory is required when articleType is GAME",
          path: ["gameCategory"],
        });
      }
      if (data.programCategory) {
        ctx.addIssue({
          code: "custom",
          message:
            "programCategory must not be provided when articleType is GAME",
          path: ["programCategory"],
        });
      }
    }

    if (data.articleType === "PROGRAM") {
      if (!data.programCategory) {
        ctx.addIssue({
          code: "custom",
          message: "programCategory is required when articleType is PROGRAM",
          path: ["programCategory"],
        });
      }
      if (data.gameCategory) {
        ctx.addIssue({
          code: "custom",
          message:
            "gameCategory must not be provided when articleType is PROGRAM",
          path: ["gameCategory"],
        });
      }
    }

    //apk xapk
    const apksEmpty = !data.apks?.length;
    const xapksEmpty = !data.xapks?.length;

    if (apksEmpty && xapksEmpty) {
      const message = "APKs or XAPKs must contain at least one element";
      ctx.addIssue({ path: ["apks"], code: z.ZodIssueCode.custom, message });
      ctx.addIssue({ path: ["xapks"], code: z.ZodIssueCode.custom, message });
    }
  });

export const updateArticleSchema = z
  .object({
    title: z.string().min(2).max(50).optional(),
    secondTitle: z.string().min(2).max(50).nullable().optional(),
    description: z.string().min(10).max(1500).optional(),
    descriptionMeta: z.string().min(10).max(500).optional(),
    image: z.string().max(500).optional(),
    developer: z.string().min(2).max(50).optional(),
    version: z.string().min(1).max(50).optional(),
    versionOriginal: z.string().min(1).max(50).nullable().optional(),
    androidVer: z.string().min(1).max(20).optional(),

    articleType: z.nativeEnum(ArticleType).optional(),
    gameCategory: z
      .nativeEnum(GameCategories, { message: "Game Categories" })
      .nullable()
      .optional(),
    programCategory: z
      .nativeEnum(ProgramCategories, { message: "Program Categories" })
      .nullable()
      .optional(),

    OBB: z.boolean().optional(),
    Script: z.boolean().optional(),
    OriginalAPK: z.boolean().optional(),

    linkAPK: z.string().max(500).optional(),
    linkOBB: z.string().max(500).nullable().optional(),
    linkVideo: z.string().max(500).nullable().optional(),
    linkScript: z.string().max(500).nullable().optional(),
    linkOriginalAPK: z.string().max(500).nullable().optional(),

    sizeFileAPK: z.string().min(1).max(20).optional(),
    sizeFileOBB: z.string().min(1).max(20).nullable().optional(),
    sizeFileScript: z.string().min(1).max(20).nullable().optional(),
    sizeFileOriginalAPK: z.string().min(1).max(20).nullable().optional(),

    screenType: z.nativeEnum(ScreenType).optional(),
    appScreens: z.array(z.string().max(500)).min(1).optional(),
    keywords: z.array(z.string().min(1).max(50)).min(1).optional(),

    isMod: z.boolean().optional(),
    typeMod: z.string().min(2).max(50).nullable().optional(),

    ratedFor: z.number().min(1).max(20).optional(),
    installs: z.string().min(1).max(20).optional(),

    paragraphs: z
      .array(
        z.object({
          title: z.string().optional(),
          content: z.string().min(5),
        })
      )
      .optional(),

    apks: z
      .array(
        z.object({
          version: z.string().min(1),
          link: z.string().min(5),
          size: z.string().min(3),
          isMod: z.boolean(),
        })
      )
      .nonempty()
      .optional(),
    xapks: z
      .array(
        z.object({
          version: z.string().min(1),
          link: z.string().min(5),
          size: z.string().min(3),
          isMod: z.boolean(),
        })
      )
      .nonempty()
      .optional(),
  })
  .superRefine((data, ctx) => {
    // OBB
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

    // Original
    if (data.OriginalAPK) {
      if (!data.linkOriginalAPK) {
        ctx.addIssue({
          code: "custom",
          message: "linkOriginalAPK is required when OriginalAPK is true",
          path: ["linkOriginalAPK"],
        });
      }
      if (!data.sizeFileOriginalAPK) {
        ctx.addIssue({
          code: "custom",
          message: "sizeFileOriginalAPK is required when OriginalAPK is true",
          path: ["sizeFileOriginalAPK"],
        });
      }
      if (!data.versionOriginal) {
        ctx.addIssue({
          code: "custom",
          message: "versionOriginal is required when OriginalAPK is true",
          path: ["versionOriginal"],
        });
      }
    } else if (data.OriginalAPK === false) {
      if (data.linkOriginalAPK) {
        ctx.addIssue({
          code: "custom",
          message:
            "linkOriginalAPK should not be provided when OriginalAPK is false",
          path: ["linkOriginalAPK"],
        });
      }
      if (data.sizeFileOriginalAPK) {
        ctx.addIssue({
          code: "custom",
          message:
            "sizeFileOriginalAPK should not be provided when OriginalAPK is false",
          path: ["sizeFileOriginalAPK"],
        });
      }
      if (data.versionOriginal) {
        ctx.addIssue({
          code: "custom",
          message:
            "versionOriginal should not be provided when OriginalAPK is false",
          path: ["versionOriginal"],
        });
      }
    }

    // isMod
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

    // category validation based on articleType
    if (data.articleType === "GAME") {
      if (!data.gameCategory) {
        ctx.addIssue({
          code: "custom",
          message: "gameCategory is required when articleType is GAME",
          path: ["gameCategory"],
        });
      }
      if (data.programCategory) {
        ctx.addIssue({
          code: "custom",
          message:
            "programCategory must not be provided when articleType is GAME",
          path: ["programCategory"],
        });
      }
    }

    if (data.articleType === "PROGRAM") {
      if (!data.programCategory) {
        ctx.addIssue({
          code: "custom",
          message: "programCategory is required when articleType is PROGRAM",
          path: ["programCategory"],
        });
      }
      if (data.gameCategory) {
        ctx.addIssue({
          code: "custom",
          message:
            "gameCategory must not be provided when articleType is PROGRAM",
          path: ["gameCategory"],
        });
      }
    }

    //apk xapk
    const apksEmpty = !data.apks?.length;
    const xapksEmpty = !data.xapks?.length;

    if (apksEmpty && xapksEmpty) {
      const message = "APKs or XAPKs must contain at least one element";
      ctx.addIssue({ path: ["apks"], code: z.ZodIssueCode.custom, message });
      ctx.addIssue({ path: ["xapks"], code: z.ZodIssueCode.custom, message });
    }
  });
