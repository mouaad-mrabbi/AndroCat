// src/app/api/multipart-upload/[endpoint]/route.ts
import {
  UploadPartCommand,
  S3Client,
  ListPartsCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

type Part = {
  number: number;
};

type PartData = {
  parts: Part[];
  key: string;
  uploadId: string;
};

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } =
  process.env;

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const resolvedParams = await params;
  const endpoint = resolvedParams.endpoint;
  const body = await request.json();

  switch (endpoint) {
    case "create-multipart-upload":
      return createMultipartUpload(body);
    case "prepare-upload-parts":
      return prepareUploadParts(body);
    case "complete-multipart-upload":
      return completeMultipartUpload(body);
    case "list-parts":
      return listParts(body);
    case "abort-multipart-upload":
      return abortMultipartUpload(body);
    case "sign-part":
      return signPart(body);
    default:
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 404 });
  }
}

async function createMultipartUpload(body: any) {
  const { filename, type } = body;

  if (!filename || !type) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const command = new CreateMultipartUploadCommand({
    Bucket: R2_BUCKET,
    Key: `${filename}`,
    ContentType: type,
  });

  const result = await R2.send(command);

  return NextResponse.json({
    uploadId: result.UploadId,
    key: result.Key,
  });
}

async function prepareUploadParts(body: PartData) {
  const parts = body.parts;

  const presignedUrls: Record<number, string> = {};

  for (const part of parts) {
    const params = {
      Bucket: R2_BUCKET,
      Key: body.key,
      PartNumber: part.number,
      UploadId: body.uploadId,
    };
    const command = new UploadPartCommand(params);
    const url = await getSignedUrl(R2, command, { expiresIn: 3600 });

    presignedUrls[part.number] = url;
  }

  return NextResponse.json({ presignedUrls });
}

async function completeMultipartUpload(body: any) {
  const { key, uploadId, parts } = body;

  try {
    const command = new CompleteMultipartUploadCommand({
      Bucket: R2_BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });

    const response = await R2.send(command);
    return NextResponse.json(response);
  } catch (err) {
    console.error("Error completing upload:", err);
    return NextResponse.json(
      { error: "Error completing upload" },
      { status: 500 }
    );
  }
}

async function listParts(body: any) {
  const { key, uploadId } = body;

  try {
    const command = new ListPartsCommand({
      Bucket: R2_BUCKET,
      Key: key,
      UploadId: uploadId,
    });
    const response = await R2.send(command);

    // تأكد من تحويل النتيجة إلى مصفوفة بشكل مناسب
    const formattedParts = (response.Parts || []).map((part) => ({
      PartNumber: part.PartNumber!,
      ETag: part.ETag!,
    }));

    return NextResponse.json(formattedParts);
  } catch (err) {
    console.error("Error listing parts:", err);
    return NextResponse.json({ error: "Error listing parts" }, { status: 500 });
  }
}

async function abortMultipartUpload(body: any) {
  const { key, uploadId } = body;

  if (!key || !uploadId) {
    return NextResponse.json(
      { error: "Missing key or uploadId" },
      { status: 400 }
    );
  }

  try {
    const command = new AbortMultipartUploadCommand({
      Bucket: R2_BUCKET,
      Key: key,
      UploadId: uploadId,
    });

    const response = await R2.send(command);
    return NextResponse.json(response);
  } catch (err) {
    console.error("Error aborting upload:", err);
    return NextResponse.json(
      { error: "Error aborting upload" },
      { status: 500 }
    );
  }
}

async function signPart(body: any) {
  const { key, uploadId, partNumber } = body;

  if (!key || !uploadId || !partNumber) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const command = new UploadPartCommand({
    Bucket: R2_BUCKET,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  const url = await getSignedUrl(R2, command, { expiresIn: 3600 });

  return NextResponse.json({ url });
}
