//lib/r2.ts

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CopyObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface FileObject {
  Key?: string;
  LastModified?: Date;
  ETag?: string;
  Size?: number;
  StorageClass?: string;
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET = process.env.R2_BUCKET!;

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function renameFile(oldKey: string, newKey: string) {
  try {
    const headCommand = new HeadObjectCommand({
      Bucket: R2_BUCKET,
      Key: oldKey,
    });
    await S3.send(headCommand);

    const copyCommand = new CopyObjectCommand({
      Bucket: R2_BUCKET,
      CopySource: `/${R2_BUCKET}/${oldKey}`,
      Key: newKey,
    });
    await S3.send(copyCommand);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: oldKey,
    });
    await S3.send(deleteCommand);
  } catch (error) {
    console.error("Error move file:", error);
    throw error;
  }
}

/**
 * نسخة مع إعادة المحاولة (Retry)
 */
export async function renameFileWithRetry(
  oldKey: string,
  newKey: string,
  retries = 3,
  delay = 500
): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await renameFile(oldKey, newKey);
      return true; // success
    } catch (err) {
      console.error(`Rename attempt ${i + 1} failed for ${oldKey} → ${newKey}`, err);
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay * (i + 1))); // exponential backoff
      }
    }
  }
  return false; // failed after retries
}

export async function uploadFile(file: Buffer, key: string) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: file,
  });

  try {
    const response = await S3.send(command);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function getSignedUrlForUpload(
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  try {
    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 * 3 });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}

export async function getSignedUrlForDownload(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}

export async function listFiles(prefix: string = ""): Promise<FileObject[]> {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    Prefix: prefix,
  });

  try {
    const response = await S3.send(command);
    return response.Contents || [];
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  try {
    const response = await S3.send(command);
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
