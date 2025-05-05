"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { fileTypeFromBuffer } from "file-type";

interface typeStore {
  imageUrl: string;
  fileSize: string;
  fileName: string;
}
interface typeImageSizeBfUp {
  width: number;
  height: number;
}

const BUCKET_NAME = "uploads";

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedSize, setUploadedSize] = useState<number>(0);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [imageSize, setImageSize] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); //before upload
  const [fileSizeBfUp, setFileSizeBfUp] = useState<string | null>(null); //before upload
  const [imageSizeBfUp, setImageSizeBfUp] = useState<typeImageSizeBfUp | null>(
    null
  ); //before upload
  const [store, setStore] = useState<typeStore[] | null>([]);
  const [uploadSpeed, setUploadSpeed] = useState<number>(0); // سرعة التحميل بالبايت/الثانية
  const [remainingTime, setRemainingTime] = useState<string>(""); // الوقت المتبقي

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      // التحقق من نوع الملف باستخدام file-type بعد تحميله
      const fileBuffer = await selectedFile.arrayBuffer();
      const { mime } = (await fileTypeFromBuffer(fileBuffer)) || {};

      if (!mime || !ALLOWED_TYPES.includes(mime)) {
        toast.error("Only images (PNG, JPG, JPEG, WEBP) are allowed.");
        return;
      }

      // حساب حجم الملف
      const sizeInKB = selectedFile.size / 1024;
      setFileSizeBfUp(
        sizeInKB > 1024
          ? (sizeInKB / 1024).toFixed(2) + " MB"
          : sizeInKB.toFixed(2) + " KB"
      );

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);

        // استرجاع أبعاد الصورة
        const img = new Image();
        img.src = result;
        img.onload = () => {
          setImageSizeBfUp({ width: img.width, height: img.height });
        };
      };
      reader.readAsDataURL(selectedFile);

      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 5MB.");
        return;
      }

      setFile(selectedFile);
      setTotalSize(selectedFile.size);
      setFileSize(formatSize(selectedFile.size));
    }
  };

  const formatSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const copyToClipboard = (Url: string) => {
    navigator.clipboard
      .writeText(Url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy URL.");
      });
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const response = await fetch("/api/verify-token", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        toast.error(data.message);
        throw new Error("Token verification failed");
      }

      const fileName = `screenshots/${Date.now()}-${file.name}`;
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUploadUrl(fileName);

      if (signedUrlError) {
        console.error("Supabase Error:", signedUrlError);
        toast.error(signedUrlError.message || "Error generating signed URL");
        throw new Error(signedUrlError.message || "Unknown Supabase error");
      }

      const { signedUrl } = signedUrlData;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        let lastUploadedSize = 0;
        let lastTime = Date.now();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
            setUploadedSize(event.loaded);

            {
              /* Download speed calculator */
            }
            const currentTime = Date.now();
            const timeDiff = (currentTime - lastTime) / 1000; // الفرق بالثواني
            const uploadedDiff = event.loaded - lastUploadedSize; // الفرق بالبايت
            const speed = uploadedDiff / timeDiff; // السرعة بالبايت/الثانية
            setUploadSpeed(speed);

            // حساب الوقت المتبقي
            const remainingSize = totalSize - event.loaded;
            const remainingTimeInSeconds = remainingSize / speed;
            setRemainingTime(formatTime(remainingTimeInSeconds));

            lastUploadedSize = event.loaded;
            lastTime = currentTime;
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            resolve();
          } else {
            // ✅ حاول تحويل الرد إلى JSON واستخراج `message`
            const errorResponse = JSON.parse(xhr.responseText);
            const errorMessage = errorResponse.message || "Upload failed";

            console.error("Upload Error:", errorMessage);
            toast.error(errorMessage);
            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = () => reject(new Error("Upload error"));

        xhr.send(file);
      });

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      setImageUrl(publicUrlData.publicUrl);

      await new Promise<void>((resolve) => {
        const img = new Image();
        img.src = publicUrlData.publicUrl;
        img.onload = () => {
          setImageSize(`${img.width}x${img.height}`);
          resolve();
        };
      });

      // Update the store upon successful upload
      setStore((prevStore) => [
        ...(prevStore || []),
        {
          imageUrl: publicUrlData.publicUrl,
          fileSize: fileSize || "Unknown",
          fileName: file.name,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      setImagePreview(null);
      setFileSizeBfUp(null);
      setImageSizeBfUp(null);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    } else {
      return `${Math.round(seconds / 3600)}h ${Math.round(
        (seconds % 3600) / 60
      )}m`;
    }
  };

  return (
    <div className="min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Image</h1>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          aria-label="Choose file to upload"
        />
        {imagePreview && (
          <div className="mt-4">
            <p className="text-white mb-2">Image Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="my-4 mx-auto rounded-lg shadow-lg max-w-full h-auto"
            />
            {fileSizeBfUp && (
              <p className="text-gray-300">File Size: {fileSizeBfUp}</p>
            )}
            {imageSizeBfUp && (
              <p className="text-gray-300">
                Dimensions: {imageSizeBfUp.width} x {imageSizeBfUp.height} px
              </p>
            )}
          </div>
        )}
        <button
          onClick={uploadFile}
          disabled={uploading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          aria-label="Upload file"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {uploading && (
          <div className="mt-6 space-y-3">
            <div className="w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-200">
              {uploadProgress}% Complete ({formatSize(uploadedSize)} /{" "}
              {formatSize(totalSize)})
            </p>
            <p className="text-sm text-gray-200">
              Remaining: {formatSize(totalSize - uploadedSize)}
            </p>
            <p className="text-sm text-gray-200">
              Estimated time remaining: {remainingTime}
            </p>
          </div>
        )}

        {imageUrl && (
          <div className="mt-6">
            <div className="flex flex-col items-center justify-center">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 block text-center mt-2 w-full break-words overflow-hidden whitespace-nowrap "
              >
                {imageUrl}
              </a>
              <button
                onClick={() => copyToClipboard(imageUrl)}
                className="w-full p-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 mt-2"
                aria-label="Copy URL to clipboard"
              >
                Copy URL
              </button>
            </div>
            <img
              src={imageUrl}
              alt="Uploaded"
              className="mt-4 mx-auto rounded-lg shadow-lg max-w-full h-auto"
            />
            {imageSize && (
              <p className="mt-4 text-center text-gray-300">
                Image dimensions: {imageSize}
              </p>
            )}
            {fileSize && (
              <p className="mt-2 text-center text-gray-300">
                File size: {fileSize}
              </p>
            )}
          </div>
        )}
      </div>

      {/* store */}
      {store?.length !== 0 && (
        <div className="pt-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Upload store</h1>
          <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mt-8  flex flex-col gap-6">
            {store?.map((article, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex">
                  <Link
                    href={article.imageUrl}
                    className="w-24 h-16 object-cover rounded-lg"
                    target="_blank"
                  >
                    <img
                      src={article.imageUrl}
                      alt="Image"
                      className="w-full h-full object-cover rounded-lg "
                    />
                  </Link>
                </div>

                <div className=" flex-1 overflow-hidden">
                  <p className="w-full break-words overflow-hidden whitespace-nowrap text-sm text-gray-300">
                    {article.fileName}
                  </p>
                  <p className="text-gray-300 text-sm">
                    File Size: {article.fileSize}
                  </p>
                  <button onClick={() => copyToClipboard(article.imageUrl)}>
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
