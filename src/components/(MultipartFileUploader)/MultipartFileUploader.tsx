import { useEffect, useMemo } from "react";
import Uppy, {
  UppyFile,
  type UploadResult,
  type Meta,
  type Body,
} from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import { toast } from "react-toastify";
import slugify from "slugify";

import "uppy/dist/uppy.min.css";

const fetchUploadApiEndpoint = async (endpoint: string, data: any) => {
  const res = await fetch(`/api/upload/multipart-upload/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

type CustomKeyType = {
  title: string;
  randomText: string;
  fileType: string;
  version?: string;
  isMod?: boolean;
};

export function MultipartFileUploader({
  onUploadSuccess,
  customKey,
}: {
  onUploadSuccess: (result: UploadResult<Meta, Body>) => void;
  customKey: CustomKeyType;
}) {
  const uppy = useMemo(() => {
    const uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        maxFileSize: 8 * 1024 * 1024 * 1024, // 8GB
      },
    }).use(AwsS3, {
      shouldUseMultipart: true,
      getChunkSize: () => 50 * 1024 * 1024, // 50MB per part

      // map to your Next.js API
      createMultipartUpload: async (file: UppyFile<Meta, Body>) => {
        const result = await fetchUploadApiEndpoint("create-multipart-upload", {
          filename: file.meta.key || file.name,
          type: file.type,
        });
        file.meta.key = result.key;
        return result;
      },
      listParts: (file: UppyFile<Meta, Body>, props: Record<string, any>) =>
        fetchUploadApiEndpoint("list-parts", { file, ...props }),
      signPart: (file: UppyFile<Meta, Body>, props: Record<string, any>) =>
        fetchUploadApiEndpoint("sign-part", { file, ...props }),
      abortMultipartUpload: (
        file: UppyFile<Meta, Body>,
        props: Record<string, any>
      ) => fetchUploadApiEndpoint("abort-multipart-upload", { file, ...props }),
      completeMultipartUpload: (
        file: UppyFile<Meta, Body>,
        props: Record<string, any>
      ) =>
        fetchUploadApiEndpoint("complete-multipart-upload", {
          file,
          ...props,
        }),
    });

    return uppy;
  }, []);

  // handle file key naming
  useEffect(() => {
    const onFileAdded = (file: UppyFile<Meta, Body>) => {
      if (!customKey || !customKey.fileType || !customKey.title) {
        toast.error("Missing upload configuration");
        uppy.removeFile(file.id);
        return;
      }

      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      let extension: string | undefined;

      switch (file.type) {
        case "image/png":
          extension = "png";
          break;
        case "image/webp":
          extension = "webp";
          break;
        case "image/jpeg":
        case "image/jpg":
          extension = "jpg";
          break;
        default:
          if (["apks", "original-apks"].includes(customKey.fileType)) {
            extension = "apk";
          } else if (["xapks"].includes(customKey.fileType)) {
            extension = "xapk";
          } else if (["obbs", "scripts"].includes(customKey.fileType)) {
            extension = "zip";
          } else {
            toast.error("Unsupported file type");
            uppy.removeFile(file.id);
            return;
          }
      }

      const cleanTitleFile = slugify(
        customKey.title.replace(/[;:\/=[\]{}.]/g, "-"),
        {
          replacement: "-",
          lower: true,
          strict: true,
          remove: /[^\w\s-]/g,
        }
      );

      const fileName = `${customKey.fileType}/${
        customKey.randomText
      }/${cleanTitleFile}${
        customKey.fileType === "apks"
          ? `${customKey.isMod ? "-mod" : ""}_${customKey.version}-AndroCat.com`
          : customKey.fileType === "xapks"
          ? `${customKey.isMod ? "-mod" : ""}_${customKey.version}-AndroCat.com`
          : customKey.fileType === "original-apks"
          ? `-original_${customKey.version}-AndroCat.com`
          : `-${randomNumber}`
      }.${extension}`;

      uppy.setFileMeta(file.id, { key: fileName });
    };

    uppy.on("file-added", onFileAdded);

    return () => {
      uppy.off("file-added", onFileAdded);
    };
  }, [uppy, customKey]);

  // handle complete
  useEffect(() => {
    uppy.on("complete", onUploadSuccess);

    uppy.on("upload-success", (file, response) => {
      if (!file) return;
      uppy.setFileState(file.id, {
        progress: uppy.getState().files[file.id].progress,
        uploadURL: response.body?.Location,
        response: response,
        isPaused: false,
      });
    });

    return () => {
      if ((uppy as any).close) {
        (uppy as any).close();
      }
    };
  }, [uppy, onUploadSuccess]);

  return (
    <>
      <Dashboard
        theme="dark"
        uppy={uppy}
        showLinkToFileUploadResult
        proudlyDisplayPoweredByUppy={false}
        /*         showProgressDetails */
        height={250}
        metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
        locale={{
          strings: {
            dropPasteFiles: "%{browseFiles}",
            browseFiles: "upload",
          } as any,
        }}
      />
      <style>
        {`
        .uppy-Container {
          max-width: 100% !important;
          overflow-y: auto;
        }
        .uppy-DashboardContent-bar{
          height: 20px ;
        }
        .uppy-DashboardContent-title {
          display: none;
        }
        `}
      </style>
    </>
  );
}