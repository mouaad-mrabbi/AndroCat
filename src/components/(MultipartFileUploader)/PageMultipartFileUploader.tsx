"use client";
import { useState } from "react";
import { MultipartFileUploader } from "./MultipartFileUploader";
import type { UploadResult, Meta, Body, UppyFile } from "@uppy/core";


// 👇 نوع مخصص يحتوي على s3Multipart
export interface UppyFileWithS3 extends UppyFile<Meta, Body> {
  s3Multipart?: {
    key: string;
    uploadId?: string;
  };
}

// 👇 نعرّف UploadState ليحتوي على ملفات من نوع UppyFileWithS3
export interface UploadState {
  successful?: UppyFileWithS3[];
  failed?: UppyFileWithS3[];
  uploadID?: string;
}

type PageMultipartFileUploaderProps = {
  title: string;
  randomText: string;
  fileType: string;
  version?: string;
  isMod?: boolean;
  onUploadResult?: (result: UploadState) => void; // 👈 أضف هذا
};

export default function PageMultipartFileUploader({
  title,
  randomText,
  fileType,
  version,
  isMod,
    onUploadResult,
}: PageMultipartFileUploaderProps) {
  const [uploadResult, setUploadResult] = useState<UploadState>();
   return (
    <div className="w-full flex flex-col items-center gap-4">
      <MultipartFileUploader
        customKey={{ title, randomText, fileType, version, isMod }}
        onUploadSuccess={(result) => {
          setUploadResult(result);
          onUploadResult?.(result);
        }}
      />
    </div>
  );
}