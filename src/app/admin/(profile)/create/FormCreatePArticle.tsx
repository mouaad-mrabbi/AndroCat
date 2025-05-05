"use client";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { CreateArticleDto } from "@/utils/dtos";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { ArticleType, GameCategories, ProgramCategories } from "@prisma/client";
import { createPendingArticles } from "@/apiCalls/adminApiCall";
import UploadFile from "@/components/uploadFile";
import { ModalForm } from "@/components/modalForm";

const FormCreatePArticle = () => {
  const [formData, setFormData] = useState<CreateArticleDto>({
    title: "",
    description: "",
    image: "",
    developer: "",
    version: "",
    versionOriginal: null,
    androidVer: "",
    articleType: ArticleType.GAME,
    gameCategory: null,
    programCategory: null,
    OBB: false,
    Script: false,
    OriginalAPK: false,
    linkAPK: "",
    linkOBB: null,
    linkVideo: null,
    linkScript: null,
    linkOriginalAPK: null,
    sizeFileAPK: "",
    sizeFileOBB: null,
    sizeFileScript: null,
    sizeFileOriginalAPK: null,
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

  const [showModal, setShowModal] = useState(false);
  const [selectedUrlModal, setSelectedUrlModal] = useState<string | null>(null);

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
    setRandomText(generateRandomText());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;


      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
      }));
  };

  const handleChangeArticleType = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      articleType: value as ArticleType,
      gameCategory:
        value === ArticleType.PROGRAM ? undefined : prev.gameCategory,
      programCategory:
        value === ArticleType.GAME ? undefined : prev.programCategory,
    }));
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
      const status = await createPendingArticles(formData);

      if (status === 201) {
        setFormData({
          title: "",
          description: "",
          image: "",
          developer: "",
          version: "",
          versionOriginal: "",
          androidVer: "",
          articleType: ArticleType.GAME,
          gameCategory: undefined,
          programCategory: undefined,
          OBB: false,
          Script: false,
          OriginalAPK: false,
          linkAPK: "",
          linkOBB: null,
          linkVideo: null,
          linkScript: null,
          linkOriginalAPK: null,
          sizeFileAPK: "",
          sizeFileOBB: null,
          sizeFileScript: null,
          sizeFileOriginalAPK: null,
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

      toast.success("New Articles added");
    } catch (error: any) {
      toast.error(error?.response?.data.message);
    }
  };

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

  const handleFormUploadOriginalAPK = async (data: { publicURL: string }) => {
    const response = await fetch(data.publicURL, { method: "HEAD" });
    const size = response.headers.get("content-length");
    formatSize(Number(size));

    setFormData((prevData) => ({
      ...prevData,
      sizeFileOriginalAPK: formatSize(Number(size)),
      linkOriginalAPK: data.publicURL,
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
          Create New Pending Article
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
            {formData.image && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUrlModal(formData.image); // هنا نقوم بتحديث `selectedScreen`
                    setShowModal(true);
                  }}
                  className="flex  gap-4 justify-between items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm
                     dark:bg-blue-900 dark:text-blue-200 w-full break-words overflow-hidden whitespace-nowrap"
                >
                  <div className="w-32">
                    <img
                      src={formData.image}
                      alt=""
                      className=" h-14 rounded-lg w-32 object-cover"
                    />
                  </div>
                  <p className="flex flex-grow  w-full break-words overflow-hidden whitespace-nowrap">
                    {formData.image}
                  </p>
                </button>
              </div>
            )}
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

          {/* Article Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Article Type:
            </label>
            <select
              name="articleType"
              value={formData.articleType}
              onChange={handleChangeArticleType}
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
                Select Article Type
              </option>
              {Object.values(ArticleType).map((type) => (
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
              name={
                formData.articleType === ArticleType.GAME
                  ? "gameCategory"
                  : "programCategory"
              }
              value={
                formData.articleType === ArticleType.GAME
                  ? formData.gameCategory ?? "ACTION"
                  : formData.programCategory ?? "BUSINESS_FINANCE"
              }
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
              {(formData.articleType === ArticleType.GAME
                ? Object.values(GameCategories)
                : Object.values(ProgramCategories)
              ).map((category) => (
                <option key={category} value={category}>
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
            {formData.linkOBB && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUrlModal(formData.linkOBB ?? null); // <-- التعديل هنا
                    setShowModal(true);
                  }}
                  className="flex gap-4 justify-between items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm dark:bg-blue-900 dark:text-blue-200 w-full break-words overflow-hidden whitespace-nowrap"
                >
                  <p className="flex flex-grow w-full break-words overflow-hidden whitespace-nowrap">
                    {formData.linkOBB}
                  </p>
                </button>
              </div>
            )}
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
            {formData.linkScript && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUrlModal(formData.linkScript ?? null); // <-- التعديل هنا
                    setShowModal(true);
                  }}
                  className="flex gap-4 justify-between items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm dark:bg-blue-900 dark:text-blue-200 w-full break-words overflow-hidden whitespace-nowrap"
                >
                  <p className="flex flex-grow w-full break-words overflow-hidden whitespace-nowrap">
                    {formData.linkScript}
                  </p>
                </button>
              </div>
            )}
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

          {/* OriginalAPK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              OriginalAPK:
            </label>
            <input
              type="checkbox"
              name="OriginalAPK"
              checked={formData.OriginalAPK}
              onChange={handleCheckboxChange}
              className="mt-1 dark:accent-indigo-500"
            />
          </div>

          {/* Upload OriginalAPK File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              OriginalAPK :
            </label>
            {formData.linkOriginalAPK && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUrlModal(formData.linkOriginalAPK ?? null);
                    setShowModal(true);
                  }}
                  className="flex gap-4 justify-between items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm dark:bg-blue-900 dark:text-blue-200 w-full break-words overflow-hidden whitespace-nowrap"
                >
                  <p className="flex flex-grow w-full break-words overflow-hidden whitespace-nowrap">
                    {formData.linkOriginalAPK}
                  </p>
                </button>
              </div>
            )}
            <UploadFile
              title={formData.title}
              randomText={randomText}
              fileType={"original-apks"}
              onChangeData={handleFormUploadOriginalAPK}
            />
          </div>

          {/* Link OriginalAPK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link OriginalAPK:
            </label>
            <input
              type="text"
              name="linkOriginalAPK"
              value={formData.linkOriginalAPK || ""}
              onChange={handleChange}
              disabled={!formData.OriginalAPK}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500
      ${
        !formData.OriginalAPK
          ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
          : ""
      }`}
            />
          </div>

          {/* Size File OriginalAPK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size File OriginalAPK:
            </label>
            <input
              type="text"
              name="sizeFileOriginalAPK"
              value={formData.sizeFileOriginalAPK || ""}
              onChange={handleChange}
              disabled={!formData.OriginalAPK}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500
      ${
        !formData.OriginalAPK
          ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
          : ""
      }`}
            />
          </div>

          {/* versionOriginal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              versionOriginal:
            </label>
            <input
              type="text"
              name="versionOriginal"
              value={formData.versionOriginal||""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
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
            {formData.linkAPK && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUrlModal(formData.linkAPK);
                    setShowModal(true);
                  }}
                  className="flex  gap-4 justify-between items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm
                     dark:bg-blue-900 dark:text-blue-200 w-full break-words overflow-hidden whitespace-nowrap"
                >
                  <p className="flex flex-grow  w-full break-words overflow-hidden whitespace-nowrap">
                    {formData.linkAPK}
                  </p>
                </button>
              </div>
            )}

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
            <div className="flex flex-col gap-2 my-2 ">
              {formData.appScreens.map((screen, index) => (
                <div key={index}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUrlModal(screen); // هنا نقوم بتحديث `selectedScreen`
                      setShowModal(true);
                    }}
                    className="flex  gap-4 justify-between items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm
                     dark:bg-blue-900 dark:text-blue-200 w-full break-words overflow-hidden whitespace-nowrap"
                  >
                    <div className="w-32">
                      <img
                        src={screen}
                        alt=""
                        className=" h-14 rounded-lg w-32 object-cover"
                      />
                    </div>

                    <p className="flex flex-grow  w-full break-words overflow-hidden whitespace-nowrap">
                      {screen}
                    </p>
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

      <ModalForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        url={selectedUrlModal}
        onDelete={(deletedUrl) => {
          setFormData((prev) => {
            const newData = { ...prev };

            if (newData.appScreens.includes(deletedUrl)) {
              newData.appScreens = newData.appScreens.filter(
                (url) => url !== deletedUrl
              );
            }

            if (newData.image === deletedUrl) newData.image = "";

            // مقارنة وإزالة من الروابط الأخرى
            if (newData.linkAPK === deletedUrl) {
              newData.linkAPK = "";
              newData.sizeFileAPK = "";
            }
            if (newData.linkOBB === deletedUrl) {
              newData.linkOBB = null;
              newData.sizeFileOBB = null;
            }
            if (newData.linkScript === deletedUrl) {
              newData.linkScript = null;
              newData.sizeFileScript = null;
            }
            if (newData.linkOriginalAPK === deletedUrl) {
              newData.linkOriginalAPK = null;
              newData.sizeFileOriginalAPK = null;
            }

            return newData;
          });

          setShowModal(false);
        }}
      />
    </div>
  );
};

export default FormCreatePArticle;
