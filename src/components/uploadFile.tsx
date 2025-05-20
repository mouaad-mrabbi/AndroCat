"use client";
import { DOMAINCDN } from "@/utils/constants";
import { useState, useRef, ChangeEvent } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";

export default function UploadFile({
  title = "",
  randomText = "xxxxxx",
  fileType = "obbs",
  version,
  isMod,
  onChangeData,
}: {
  title: string;
  randomText: string;
  fileType: string;
  version?: string;
  isMod?: boolean;
  onChangeData?: (data: { publicURL: string }) => void;
}) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const [uploadedSize, setUploadedSize] = useState<number>(0);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [speedPerSecond, setSpeedPerSecond] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedSize(0);
    setTotalSize(0);
    setSpeedPerSecond(0);
    setTimeRemaining(0);

    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    abortControllerRef.current = new AbortController();

    try {
      let extension;
      if (file.type === "image/png") {
        extension = "png";
      } else if (file.type === "image/webp") {
        extension = "webp";
      } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
        extension = "jpg";
      } else if (fileType === "apks" || fileType === "original-apks") {
        extension = "apk";
      } else if (fileType === "obbs" || fileType === "scripts") {
        extension = "zip";
      } else {
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

      const fileName = `${fileType}/${randomText}/${cleanTitleFile}${
        fileType === "apks"
          ? `${isMod ? "-mod" : ""}_${version}-AndroCat.com`
          : fileType === "original-apks"
          ? `-original_${version}-AndroCat.com`
          : `-${randomNumber}`
      }.${extension}`;

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
      onChangeData?.({ publicURL: `${DOMAINCDN}/${fileName}` });
      toast.success("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Detailed error:", error);

      if (error instanceof Error && error.name === "AbortError") {
        console.log("Upload cancelled");
      } else {
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
      const startTime = Date.now();

      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
          setUploadedSize(event.loaded);
          setTotalSize(event.total);

          const timeElapsed = (Date.now() - startTime) / 1000;
          const speed = event.loaded / timeElapsed; // bytes/sec
          setSpeedPerSecond(speed);

          const remainingBytes = event.total - event.loaded;
          const estimatedTime = speed > 0 ? remainingBytes / speed : 0;
          setTimeRemaining(estimatedTime);
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
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const formatBytes = (bytes: number) => {
    const units = ["Bytes", "KB", "MB", "GB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div>
      {/* Upload File UI */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <label className="flex-1">
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
            <div
              className="cursor-pointer flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
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
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>Progress: {uploadProgress.toFixed(2)}%</p>
            <p>
              Uploaded: {formatBytes(uploadedSize)} / {formatBytes(totalSize)}
            </p>
            <p>Remaining: {formatBytes(totalSize - uploadedSize)}</p>
            <p>
              Speed:{" "}
              {speedPerSecond >= 1024 * 1024
                ? `${(speedPerSecond / (1024 * 1024)).toFixed(2)} MB/s`
                : `${(speedPerSecond / 1024).toFixed(2)} KB/s`}
            </p>
            <p>Estimated Time Left: {formatTime(timeRemaining)}</p>
          </div>
          <button
            onClick={handleCancelUpload}
            className="text-red-500 hover:text-red-600 text-sm mt-3"
          >
            Cancel Upload
          </button>
        </div>
      )}
    </div>
  );
}

