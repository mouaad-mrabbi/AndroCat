"use client";
import { useState, useRef, ChangeEvent } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";

export default function UploadFile({
  title="mouad mrabbi",
  randomText="k0j2nc",
  fileType="obbs",
  onChangeData,
}: {
  title: string;
  randomText: string;
  fileType: string;
  onChangeData?: (data: { publicURL: string }) => void;
}) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    abortControllerRef.current = new AbortController();

    try {
      let extension;
      // ✅ تحديد الامتداد بناءً على نوع MIME
      if (file.type === "image/png") {
        extension = "png";
      } else if (file.type === "image/webp") {
        extension = "webp";
      } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
        extension = "jpg";
      } else if (fileType === "apks"||fileType === "original-apks") {
        extension = "apk";
      } else if (fileType === "obbs") {
        extension = "zip";
      }else if (fileType === "scripts") {
        extension = "zip";
      } else {
        // في حالة عدم تطابق أي نوع
        toast.error("Unsupported file type");
        setIsUploading(false);
        return;
      }

      const cleanTitleFile = slugify(title.replace(/[;:\/=[\]{}.]/g, "-"), {
        replacement: "-",
        lower: true,
        strict: true,
        remove: /[^\w\s-]/g,
      });

      const fileName = `${fileType}/${randomText}/${cleanTitleFile}-${randomNumber}.${extension}`;

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileName,
          fileType: file.type,
        }),
      });

      const { signedUrl } = await response.json();

      await uploadFileWithProgress(
        file,
        signedUrl,
        abortControllerRef.current.signal
      );
      onChangeData?.({ publicURL: `https://cdn.androcat.com/${fileName}` });
      console.log(`https://cdn.androcat.com/${fileName}`);
      toast.success("File uploaded successfully!");
      setFile(null);
      /* fetchFiles(); */
    } catch (error) {
      console.error("Detailed error:", error);

      if (error instanceof Error && error.name === "AbortError") {
        console.log("Upload cancelled");
      } else {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  const uploadFileWithProgress = (
    file: File,
    signedUrl: string,
    signal: AbortSignal
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Upload failed"));
      };

      xhr.send(file);

      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new Error("Upload cancelled"));
      });
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div>
      {/* Upload File */}
      <div>
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id="file-upload"
              />
              <div className="cursor-pointer flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
                dark:focus:border-indigo-500 transition duration-300"
               >
                {file ? file.name : "Choose a file"}
              </div>
            </label>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {isUploading && (
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {uploadProgress.toFixed(2)}% uploaded
              </p>
              <button
                onClick={handleCancelUpload}
                className="text-red-500 hover:text-red-600 transition duration-300"
              >
                Cancel Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
