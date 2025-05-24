// utils/slugifyTitle.ts
import slugify from "slugify";

export function slugifyTitle(title: string) {
  return slugify(
    title.replace(/[;:\/=[\]{}.]/g, "-"),
    {
      replacement: "-",
      lower: true,
      strict: true,
      remove: /[^\w\s-]/g,
    }
  );
}

//const cleanTitle = slugifyTitle("My Awesome Game: Episode 2");