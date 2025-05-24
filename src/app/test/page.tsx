"use client";
import PageMultipartFileUploader, {
  UploadState,
} from "@/components/(MultipartFileUploader)/PageMultipartFileUploader";
export default function TestPage() {
  const handleFormUploadDataImage = async (result: UploadState) => {
    console.log(result);
  };

  return (
    <div>
      <PageMultipartFileUploader
        title="momo"
        randomText="m3c4v5"
        fileType="post"
        onUploadResult={(result) => {
          handleFormUploadDataImage(result);
        }}
      />
    </div>
  );
}
