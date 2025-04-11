import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { verifyToken } from "@/utils/verifyToken";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";


export async function POST(request: NextRequest) {
  try {
    console.log("supabaseUrl:", process.env.SUPABASE_URL);
    // 1. التحقق من صلاحيات المستخدم
    const user = verifyToken(request);


    // 2. استخراج الملف من الطلب
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 3. التحقق من نوع الملف
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type" },
        { status: 400 }
      );
    }

    // 4. ضغط الصورة وتحويلها إلى Buffer
    const buffer = await file.arrayBuffer();
    const compressedBuffer = await sharp(Buffer.from(buffer))
      .jpeg({ quality: 80 }) // تحويل إلى JPEG وجودة 80%
      .toBuffer();

    // 5. توليد اسم فريد للصورة
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `posts/${fileName}`;

    // 6. رفع الصورة إلى Supabase
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, compressedBuffer, {
        contentType: file.type,
        upsert: false, // عدم الكتابة فوق الملفات الموجودة بنفس الاسم
      });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // 7. توليد رابط الوصول للصورة
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
