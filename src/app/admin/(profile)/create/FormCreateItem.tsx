"use client";
import { useState, useRef, FormEvent, ChangeEvent, useEffect } from "react";
import { CreateItemDto } from "@/utils/dtos";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { ItemCategories, ItemType } from "@prisma/client";
import { supabase } from "@/lib/supabaseClient";
import { fileTypeFromBuffer } from "file-type";
import { createPendingItems } from "@/apiCalls/adminApiCall";
import UploadFile from "@/components/uploadFile";

const BUCKET_NAME_IMAGES = "images";
const BUCKET_NAME_FILES = "files";

const FormCreateItem = () => {
  const [formData, setFormData] = useState<CreateItemDto>({
    title: "",
    description: "",
    image: "",
    developer: "",
    version: "",
    androidVer: "",
    itemType: ItemType.GAME,
    categories: ItemCategories.ACTION,
    OBB: false,
    Script: false,
    linkAPK: "",
    linkOBB: null,
    linkVideo: null,
    linkScript: null,
    sizeFileAPK: "",
    sizeFileOBB: null,
    sizeFileScript: null,
    appScreens: [],
    keywords: [],
    isMod: false,
    typeMod: null,
    ratedFor: 0,
    installs: "",
    createdById: 0,
    createdAt: new Date(),
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [newAppScreen, setNewAppScreen] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [randomText, setRandomText] = useState<string>("");
  const [randomNum, setRandomNum] = useState<number>(0);
  const generateRandomNumber = () => {
    const number = Math.floor(100000 + Math.random() * 900000);
    setRandomNum(number);
  };

  const generateRandomText = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 6; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomString;
  };
  const handleRandomTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRandomText(e.target.value);
  };
  useEffect(() => {
    generateRandomNumber();
    setRandomText(generateRandomText());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword.trim()],
      });
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(
        (keyword) => keyword !== keywordToRemove
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /*     const captchaValue = recaptchaRef.current?.getValue();
    if (!captchaValue) {
      toast.error("Please complete the ReCAPTCHA", {
        position: "top-right",
        autoClose: 10000,
        theme: "colored",
      });
      return;
    } */

    try {
      const status = await createPendingItems(formData);

      if (status === 201) {
        setFormData({
          title: "",
          description: "",
          image: "",
          developer: "",
          version: "",
          androidVer: "",
          itemType: ItemType.GAME,
          categories: ItemCategories.ACTION,
          OBB: false,
          Script: false,
          linkAPK: "",
          linkOBB: null,
          linkVideo: null,
          linkScript: null,
          sizeFileAPK: "",
          sizeFileOBB: null,
          sizeFileScript: null,
          appScreens: [],
          keywords: [],
          isMod: false,
          typeMod: null,
          ratedFor: 0,
          installs: "",
          createdById: 0,
          createdAt: new Date(),
        });
      }

      toast.success("New items added");
    } catch (error: any) {
      toast.error(error?.response?.data.message);
    }
  };

  /* App Screenshots */
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES_IMAGE = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedSize, setUploadedSize] = useState<number>(0);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [imageSize, setImageSize] = useState<string | null>(null); // width x height
  const [uploadSpeed, setUploadSpeed] = useState<number>(0); // Upload speed in MB/s
  const [remainingTime, setRemainingTime] = useState<string>(""); // الوقت المتبقي

  const addAppScreen = async (newScreenUrl: any) => {
    if (
      newScreenUrl.trim() &&
      !formData.appScreens.includes(newScreenUrl.trim())
    ) {
      setFormData({
        ...formData,
        appScreens: [...formData.appScreens, newScreenUrl.trim()],
      });
      setNewAppScreen("");
    }
  };
  const removeAppScreen = (screenToRemove: string) => {
    setFormData({
      ...formData,
      appScreens: formData.appScreens.filter(
        (screen) => screen !== screenToRemove
      ),
    });
  };

  const uploadFileScreen = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const fileName = `screenshots/${Date.now()}-${file.name}`;
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from(BUCKET_NAME_IMAGES)
          .createSignedUploadUrl(fileName);

      if (signedUrlError) {
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

            toast.error(errorMessage);
            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = () => reject(new Error("Upload error"));

        xhr.send(file);
      });

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME_IMAGES)
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

      // تحديث newAppScreen والانتظار حتى يتم التحديث
      await setNewAppScreen(publicUrlData.publicUrl);

      // استدعاء addAppScreen مع القيمة الجديدة
      await addAppScreen(publicUrlData.publicUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleScreenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      // التحقق من نوع الملف باستخدام file-type بعد تحميله
      const fileBuffer = await selectedFile.arrayBuffer();
      const { mime } = (await fileTypeFromBuffer(fileBuffer)) || {};

      if (!mime || !ALLOWED_TYPES_IMAGE.includes(mime)) {
        toast.error("Only images (PNG, JPG, JPEG, WEBP) are allowed.");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 5MB.");
        return;
      }

      setFile(selectedFile);
      setTotalSize(selectedFile.size);
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

  const handleFormUploadDataAPK = async (data: { publicURL: string }) => {
    const response = await fetch(data.publicURL, { method: "HEAD" });
    const size = response.headers.get("content-length");
    formatSize(Number(size));

    setFormData((prevData) => ({
      ...prevData,
      sizeFileAPK: formatSize(Number(size)),
      linkAPK: data.publicURL,
    }));
  };

  const handleFormUploadDataScreenshots = async (data: {
    publicURL: string;
  }) => {
    const response = await fetch(data.publicURL, { method: "HEAD" });
    const size = response.headers.get("content-length");
    formatSize(Number(size));

    setFormData((prevData) => ({
      ...prevData,
      appScreens: [...prevData.appScreens, data.publicURL],
    }));
  };

  const handleFormUploadDataOBB = async (data: { publicURL: string }) => {
    const response = await fetch(data.publicURL, { method: "HEAD" });
    const size = response.headers.get("content-length");
    formatSize(Number(size));

    setFormData((prevData) => ({
      ...prevData,
      sizeFileOBB: formatSize(Number(size)),
      linkOBB: data.publicURL,
    }));
  };
  
  const handleFormUploadDataScript = async (data: { publicURL: string }) => {
    const response = await fetch(data.publicURL, { method: "HEAD" });
    const size = response.headers.get("content-length");
    formatSize(Number(size));

    setFormData((prevData) => ({
      ...prevData,
      sizeFileScript: formatSize(Number(size)),
      linkScript: data.publicURL,
    }));
  };

  const handleFormUploadDataImage = async (data: { publicURL: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      image: data.publicURL,
    }));
  };

  return (
    <div className="min-h-screen   py-8">
      <div className="max-w-2xl mx-auto  p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create New Pending Item
        </h1>

        <div className="mb-6 ">
          <label className="text-lg font-semibold">Random Text</label>
          <input
            type="text"
            value={randomText}
            onChange={handleRandomTextChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title:
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* image posts Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              image posts :
            </label>
            <UploadFile
              title={formData.title}
              randomText={randomText}
              fileType={"posts"}
              onChangeData={handleFormUploadDataImage}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image URL:
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
              dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* Developer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Developer:
            </label>
            <input
              type="text"
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Version:
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* Android Version */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Android Version:
            </label>
            <input
              type="text"
              name="androidVer"
              value={formData.androidVer}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* Item Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Item Type:
            </label>
            <select
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
      bg-white text-gray-700 cursor-pointer
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
            >
              <option
                value=""
                disabled
                className="text-gray-400 dark:text-gray-400"
              >
                Select Item Type
              </option>
              {Object.values(ItemType).map((type) => (
                <option
                  key={type}
                  value={type}
                  className="text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categories:
            </label>
            <select
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
      bg-white text-gray-700 cursor-pointer
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
            >
              <option
                value=""
                disabled
                className="text-gray-400 dark:text-gray-400"
              >
                Select Category
              </option>
              {Object.values(ItemCategories).map((category) => (
                <option
                  key={category}
                  value={category}
                  className="text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* OBB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              OBB:
            </label>
            <input
              type="checkbox"
              name="OBB"
              checked={formData.OBB}
              onChange={handleCheckboxChange}
              className="mt-1 dark:accent-indigo-500"
            />
          </div>

          {/* Upload OBB File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              OBB :
            </label>
            <UploadFile
              title={formData.title}
              randomText={randomText}
              fileType={"obbs"}
              onChangeData={handleFormUploadDataOBB}
            />
          </div>

          {/* Link OBB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link OBB:
            </label>
            <input
              type="text"
              name="linkOBB"
              value={formData.linkOBB || ""}
              onChange={handleChange}
              disabled={!formData.OBB}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500
      ${
        !formData.OBB ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""
      }`}
            />
          </div>

          {/* Size File OBB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size File OBB:
            </label>
            <input
              type="text"
              name="sizeFileOBB"
              value={formData.sizeFileOBB || ""}
              onChange={handleChange}
              disabled={!formData.OBB}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500
      ${
        !formData.OBB ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""
      }`}
            />
          </div>

          {/* Script */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Script:
            </label>
            <input
              type="checkbox"
              name="Script"
              checked={formData.Script}
              onChange={handleCheckboxChange}
              className="mt-1 dark:accent-indigo-500"
            />
          </div>

          {/* File Script Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Script :
            </label>
            <UploadFile
              title={formData.title}
              randomText={randomText}
              fileType={"scripts"}
              onChangeData={handleFormUploadDataScript}
            />
          </div>

          {/* Link Script */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link Script:
            </label>
            <input
              type="text"
              name="linkScript"
              value={formData.linkScript || ""}
              onChange={handleChange}
              disabled={!formData.Script}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500
      ${
        !formData.Script
          ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
          : ""
      }`}
            />
          </div>

          {/* Size File Script */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size File Script:
            </label>
            <input
              type="text"
              name="sizeFileScript"
              value={formData.sizeFileScript || ""}
              onChange={handleChange}
              disabled={!formData.Script}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500
      ${
        !formData.Script
          ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
          : ""
      }`}
            />
          </div>

          {/* Upload APK File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              APK :
            </label>
            <UploadFile
              title={formData.title}
              randomText={randomText}
              fileType={"apks"}
              onChangeData={handleFormUploadDataAPK}
            />
          </div>

          {/* Link APK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link APK:
            </label>
            <input
              type="text"
              name="linkAPK"
              value={formData.linkAPK}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* Size File APK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size File APK:
            </label>
            <input
              type="text"
              name="sizeFileAPK"
              value={formData.sizeFileAPK}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* Link Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link Video:
            </label>
            <input
              type="text"
              name="linkVideo"
              value={formData.linkVideo || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
            />
          </div>

          {/* App Screenshots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              App Screenshots (URLs):
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.appScreens.map((screen, index) => (
                <div
                  key={index}
                  className="flex gap-4 justify-between items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm
                  dark:bg-blue-900 dark:text-blue-200   w-full break-words overflow-hidden whitespace-nowrap  "
                >
                  <div className="w-32">
                    <img
                      src={screen}
                      alt=""
                      className=" h-14 rounded-lg w-32 object-cover"
                    />
                  </div>

                  <a
                    href={screen}
                    target="_blank"
                    className="flex w-full break-words overflow-hidden whitespace-nowrap"
                  >
                    {screen}
                  </a>

                  <button
                    type="button"
                    onClick={() => removeAppScreen(screen)}
                    className="text-lg text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <UploadFile
              title={formData.title}
              randomText={randomText}
              fileType={"screenshots"}
              onChangeData={handleFormUploadDataScreenshots}
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Keywords:
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm
          dark:bg-indigo-900 dark:text-indigo-200"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 text-indigo-500 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-100"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                placeholder="Add a keyword"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
                dark:focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                dark:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                Add
              </button>
            </div>
          </div>

          {/* Is Mod */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Is Mod:
            </label>
            <input
              type="checkbox"
              name="isMod"
              checked={formData.isMod}
              onChange={handleCheckboxChange}
              className="mt-1 dark:accent-indigo-500"
            />
          </div>

          {/* Type Mod */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type Mod:
            </label>
            <input
              type="text"
              name="typeMod"
              value={formData.typeMod || ""}
              onChange={handleChange}
              disabled={!formData.isMod} // تعطيل الحقل إذا كانت isMod غير مفعلة
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
                dark:focus:border-indigo-500
                ${
                  !formData.isMod
                    ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                    : ""
                }`}
            />
          </div>

          {/* Rated For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rated For:
            </label>
            <input
              type="number"
              name="ratedFor"
              value={formData.ratedFor}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* Installs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Installs:
            </label>
            <input
              type="text"
              name="installs"
              value={formData.installs}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* ReCAPTCHA */}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={"6LfSd9gqAAAAAIJn7lHYKyxRBUznWWARoe8PTyAW"} // استبدل بمفتاحك من Google
          />

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCreateItem;
