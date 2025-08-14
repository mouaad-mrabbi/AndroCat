"use client";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { CreateArticleDto } from "@/utils/dtos";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import {
  ArticleType,
  GameCategories,
  PendingArticleAPKS,
  PendingArticleParagraph,
  PendingArticleXAPKS,
  ProgramCategories,
  ScreenType,
} from "@prisma/client";
import { createPendingArticles } from "@/apiCalls/adminApiCall";
import { ModalForm } from "@/components/modalForm";
import PageMultipartFileUploader, {
  UploadState,
} from "@/components/(MultipartFileUploader)/PageMultipartFileUploader";
import { DOMAINCDN } from "@/utils/constants";
import TextareaAutosize from "react-textarea-autosize";
import APKSection from "@/components/admin/APKSection";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import SortableList from "@/components/admin/SortableList";

type FileItemType = "apks" | "xapks";
type FileItem = PendingArticleAPKS | PendingArticleXAPKS;

const FormCreatePArticle = () => {
  const [formData, setFormData] = useState<CreateArticleDto>({
    title: "",
    secondTitle: null,
    description: "",
    descriptionMeta: "",
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
    linkOBB: null,
    linkVideo: null,
    linkScript: null,
    linkOriginalAPK: null,
    sizeFileOBB: null,
    sizeFileScript: null,
    sizeFileOriginalAPK: null,
    screenType: ScreenType.SIXTEEN_BY_NINE,
    appScreens: [],
    keywords: [],
    isMod: false,
    typeMod: null,
    ratedFor: 0,
    installs: "",
    createdById: 0,
    paragraphs: [],
    apks: [],
    xapks: [],
  });
  const [newKeyword, setNewKeyword] = useState("");
  const [newAppScreen, setNewAppScreen] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [randomText, setRandomText] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUrlModal, setSelectedUrlModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [collapsedParagraphs, setCollapsedParagraphs] = useState<boolean[]>([]);
  const [collapsed, setCollapsed] = useState<Record<FileItemType, boolean[]>>({
    apks: [],
    xapks: [],
  });

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
    setIsLoading(true);
    try {
      const status = await createPendingArticles(formData);

      if (status === 201) {
        setFormData({
          title: "",
          secondTitle: null,
          description: "",
          descriptionMeta: "",
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
          linkOBB: null,
          linkVideo: null,
          linkScript: null,
          linkOriginalAPK: null,
          sizeFileOBB: null,
          sizeFileScript: null,
          sizeFileOriginalAPK: null,
          screenType: ScreenType.SIXTEEN_BY_NINE,
          appScreens: [],
          keywords: [],
          isMod: false,
          typeMod: null,
          ratedFor: 0,
          installs: "",
          createdById: 0,
          paragraphs: [],
          apks: [],
          xapks: [],
        });
      }

      toast.success("New Articles added");
    } catch (error: any) {
      toast.error(error?.response?.data.message);
    } finally {
      setIsLoading(false);
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

  const formatSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  const handleUploadImage = async (result: UploadState) => {
    const file = result.successful?.[0];
    const key = file?.s3Multipart?.key;

    if (!key) return;

    setFormData((prevData) => ({
      ...prevData,
      image: key,
    }));
  };

  const handleUploadOBB = async (result: UploadState) => {
    const file = result.successful?.[0];
    const key = file?.s3Multipart?.key;
    const size = file?.size;

    if (!key || !size) return;

    setFormData((prevData) => ({
      ...prevData,
      sizeFileOBB: formatSize(size),
      linkOBB: key,
    }));
  };

  const handleUploadScript = async (result: UploadState) => {
    const file = result.successful?.[0];
    const key = file?.s3Multipart?.key;
    const size = file?.size;

    if (!key || !size) return;

    setFormData((prevData) => ({
      ...prevData,
      sizeFileScript: formatSize(Number(size)),
      linkScript: key,
    }));
  };

  const handleUploadOriginalAPK = async (result: UploadState) => {
    const file = result.successful?.[0];
    const key = file?.s3Multipart?.key;
    const size = file?.size;

    if (!key || !size) return;

    setFormData((prevData) => ({
      ...prevData,
      sizeFileOriginalAPK: formatSize(Number(size)),
      linkOriginalAPK: key,
    }));
  };

  const handleUploadScreenshots = async (result: UploadState) => {
    const file = result.successful?.[0];
    const key = file?.s3Multipart?.key;

    if (!key) return;

    const newKey = key;

    setFormData((prevData) => {
      // تأكد أن الرابط غير موجود مسبقًا
      if (prevData.appScreens.includes(newKey)) {
        return prevData;
      }

      return {
        ...prevData,
        appScreens: [...prevData.appScreens, newKey],
      };
    });
  };

  //Paragraph
  const handleParagraphChange = (
    index: number,
    field: keyof PendingArticleParagraph,
    value: string | number
  ) => {
    const newParagraphs = [...(formData.paragraphs ?? [])];
    newParagraphs[index] = {
      ...newParagraphs[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, paragraphs: newParagraphs }));
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: [...(prev.paragraphs ?? []), { title: "", content: "" }],
    }));
    setCollapsedParagraphs((prev) => [...prev, false]); // الافتراضي: غير مصغّر
  };

  const removeParagraph = (index: number) => {
    const newParagraphs = [...(formData.paragraphs ?? [])];
    newParagraphs.splice(index, 1);

    const newCollapsed = [...collapsedParagraphs];
    newCollapsed.splice(index, 1);

    setFormData((prev) => ({ ...prev, paragraphs: newParagraphs }));
    setCollapsedParagraphs(newCollapsed);
  };

  // APKs and XAPKs logic
  const handleChangeAPK_XAPK = (
    type: FileItemType,
    index: number,
    field: keyof FileItem,
    value: any
  ) => {
    const newList = [...(formData[type] ?? [])];
    newList[index] = { ...newList[index], [field]: value };
    setFormData((prev) => ({ ...prev, [type]: newList }));
  };

  const addAPK_XAPK = (type: FileItemType) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [
        { version: "", link: "", size: "", isMod: false ,  order: Math.floor(Math.random() * 10_000)},
        ...(prev[type] ?? []),
      ],
    }));
    setCollapsed((prev) => ({
      ...prev,
      [type]: [ false, ...(prev[type] ?? [])],
    }));
  };

  const removeAPK_XAPK = async (
    type: FileItemType,
    path: string,
    index: number
  ) => {
    const deleteFromCloud = async () => {
      try {
        const res = await fetch("/api/files", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: path }),
        });
        if (!res.ok) throw new Error("Failed to delete file.");
        return true;
      } catch (err) {
        console.error("Error deleting file:", err);
        toast.error("Error deleting the file from Cloudflare.");
        return false;
      }
    };

    if (path) {
      const success = await deleteFromCloud();
      if (!success) return;
    }

    const newItems = [...(formData[type] ?? [])];
    newItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, [type]: newItems }));

    const newCollapsed = [...collapsed[type]];
    newCollapsed.splice(index, 1);
    setCollapsed((prev) => ({ ...prev, [type]: newCollapsed }));

    toast.success(`${type.toUpperCase()} item deleted`);
  };

  const handleUploadAPK_XAPK = (
    type: FileItemType,
    result: any,
    index: number
  ) => {
    const file = result.successful?.[0];
    const key = file?.s3Multipart?.key;
    const size = file?.size;
    if (!key || !size) return;

    const updated = [...formData[type]];
    updated[index] = {
      ...updated[index],
      link: key,
      size: formatSize(Number(size)),
    };
    setFormData((prev) => ({ ...prev, [type]: updated }));
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

          {/* second Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              second Title:
            </label>
            <input
              type="text"
              name="secondTitle"
              value={formData.secondTitle || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description:
            </label>
            <TextareaAutosize
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

          {/* descriptionMeta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              descriptionMeta:
            </label>
            <TextareaAutosize
              name="descriptionMeta"
              value={formData.descriptionMeta}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
              /* required */
            />
          </div>

          {/* Paragraphs */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Paragraphs:
            </label>

            {formData.paragraphs?.map((paragraph, index) => (
              <div
                key={index}
                className="border p-4 rounded-md space-y-2 bg-gray-100 dark:bg-gray-800"
              >
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">
                    {paragraph.title || `Paragraph ${index + 1}`}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsedParagraphs((prev) => {
                        const newState = [...prev];
                        newState[index] = !newState[index];
                        return newState;
                      })
                    }
                    className="text-blue-600 text-xs hover:underline"
                  >
                    {collapsedParagraphs[index]
                      ? "Show Details"
                      : "Hide Details"}
                  </button>
                </div>

                {!collapsedParagraphs[index] && (
                  <>
                    <div>
                      <label className="text-sm">Title (optional):</label>
                      <input
                        type="text"
                        value={paragraph.title || ""}
                        onChange={(e) =>
                          handleParagraphChange(index, "title", e.target.value)
                        }
                        className="w-full mt-1 px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Content:</label>
                      <TextareaAutosize
                        required
                        value={paragraph.content}
                        onChange={(e) =>
                          handleParagraphChange(
                            index,
                            "content",
                            e.target.value
                          )
                        }
                        className="w-full mt-1 px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addParagraph}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
            >
              + Add Paragraph
            </button>
          </div>

          {/* image posts Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              image posts :
            </label>
            <PageMultipartFileUploader
              title={formData.title}
              randomText={randomText}
              fileType="posts"
              onUploadResult={(result) => {
                handleUploadImage(result);
              }}
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
                    setSelectedUrlModal(formData.image);
                    setShowModal(true);
                  }}
                  className="flex  gap-4 justify-between items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm
                     dark:bg-blue-900 dark:text-blue-200 w-full break-words overflow-hidden whitespace-nowrap"
                >
                  <div className="w-32">
                    <img
                      src={`${DOMAINCDN}/${formData.image}`}
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
              Android Version Supported:
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

          {/* APKs */}
          <APKSection
            type="apks"
            items={formData.apks}
            collapsed={collapsed.apks}
            onToggleCollapse={(index) =>
              setCollapsed((prev) => {
                const newState = [...prev.apks];
                newState[index] = !newState[index];
                return { ...prev, apks: newState };
              })
            }
            onChange={(index, field, value) =>
              handleChangeAPK_XAPK("apks", index, field, value)
            }
            onRemove={(link, index) => removeAPK_XAPK("apks", link, index)}
            onUpload={(result, index) =>
              handleUploadAPK_XAPK("apks", result, index)
            }
            onAdd={() => addAPK_XAPK("apks")}
            onReorder={(newItems) => {
              setFormData((prev) => ({ ...prev, apks: newItems }));
            }}
            title={formData.title}
            randomText={randomText}
          />

          {/* XAPKs */}
          <APKSection
            type="xapks"
            items={formData.xapks}
            collapsed={collapsed.xapks}
            onToggleCollapse={(index) =>
              setCollapsed((prev) => {
                const newState = [...prev.xapks];
                newState[index] = !newState[index];
                return { ...prev, xapks: newState };
              })
            }
            onChange={(index, field, value) =>
              handleChangeAPK_XAPK("xapks", index, field, value)
            }
            onRemove={(link, index) => removeAPK_XAPK("xapks", link, index)}
            onUpload={(result, index) =>
              handleUploadAPK_XAPK("xapks", result, index)
            }
            onAdd={() => addAPK_XAPK("xapks")}
            onReorder={(newItems) => {
              setFormData((prev) => ({ ...prev, xapks: newItems }));
            }}
            title={formData.title}
            randomText={randomText}
          />

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
          {/* Show Details if OBB true.*/}
          {formData.OBB && (
            <>
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

                <PageMultipartFileUploader
                  title={formData.title}
                  randomText={randomText}
                  fileType="obbs"
                  onUploadResult={(result) => {
                    handleUploadOBB(result);
                  }}
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
            </>
          )}

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
          {/* Show Details if Script true.*/}
          {formData.Script && (
            <>
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
                <PageMultipartFileUploader
                  title={formData.title}
                  randomText={randomText}
                  fileType="scripts"
                  onUploadResult={(result) => {
                    handleUploadScript(result);
                  }}
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
            </>
          )}

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
          {/* Show Details if OriginalAPK true.*/}
          {formData.OriginalAPK && (
            <>
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
                <PageMultipartFileUploader
                  title={formData.title}
                  randomText={randomText}
                  fileType="original-apks"
                  version={formData.versionOriginal || ""}
                  onUploadResult={(result) => {
                    handleUploadOriginalAPK(result);
                  }}
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
                  value={formData.versionOriginal || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 
      dark:focus:border-indigo-500"
                  /* required */
                />
              </div>
            </>
          )}

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

          {/* screen Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Screen Type:
            </label>
            <select
              name="screenType"
              value={formData.screenType}
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
                Select Screen Type
              </option>
              {Object.values(ScreenType).map((type) => (
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
          {/* App Screenshots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              App Screenshots (URLs):
            </label>

            <SortableList
              items={formData.appScreens}
              onChange={(newList) =>
                setFormData((prev) => ({ ...prev, appScreens: newList }))
              }
              renderItem={({ id, isDragging }) => (
                <button
                  type="button"
                  className={`flex gap-4 justify-between items-center px-2 py-1 rounded-lg text-sm w-full break-words 
                    overflow-hidden whitespace-nowrap cursor-move
                  ${
                    isDragging
                      ? "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                  onClick={() => {
                    setSelectedUrlModal(id);
                    setShowModal(true);
                  }}
                >
                  <div className="w-32">
                    <img
                      src={id}
                      alt=""
                      className="h-14 rounded-lg w-32 object-cover"
                    />
                  </div>
                  <p className="flex flex-grow w-full break-words overflow-hidden whitespace-nowrap">
                    {id}
                  </p>
                </button>
              )}
            />

            <PageMultipartFileUploader
              title={formData.title}
              randomText={randomText}
              fileType="screenshots"
              onUploadResult={(result) => {
                handleUploadScreenshots(result);
              }}
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Keywords:
            </label>
            <SortableList
              items={formData.keywords}
              onChange={(newList) =>
                setFormData((prev) => ({ ...prev, keywords: newList }))
              }
              strategy={rectSortingStrategy}
              wrapperClassName="flex flex-wrap gap-2 mt-1"
              renderItem={({ id, isDragging }) => (
                <div
                  className={`flex items-center px-2 py-1 rounded-full text-sm cursor-move
                  ${
                    isDragging
                      ? "bg-indigo-200 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100"
                      : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                  }`}
                >
                  {id}
                  <button
                    type="button"
                    onClick={() => removeKeyword(id)}
                    className="ml-1 text-indigo-500 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-100"
                  >
                    &times;
                  </button>
                </div>
              )}
            />
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
              Rated For age number:
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

          {/* Submit Button */}
          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-700"
            >
              Create Item
            </button>
          </div>
        </form>
      </div>

      <ModalForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        path={selectedUrlModal}
        onDelete={(deletedPath) => {
          setFormData((prev) => {
            const newData = { ...prev };

            // ✅ حذف من appScreens إذا وُجد
            if (newData.appScreens.includes(deletedPath)) {
              newData.appScreens = newData.appScreens.filter(
                (path) => path !== deletedPath
              );
            }

            // ✅ حذف من image
            if (newData.image === deletedPath) newData.image = "";

            // ✅ حذف من روابط ثابتة
            if (newData.linkOBB === deletedPath) {
              newData.linkOBB = null;
              newData.sizeFileOBB = null;
            }
            if (newData.linkScript === deletedPath) {
              newData.linkScript = null;
              newData.sizeFileScript = null;
            }
            if (newData.linkOriginalAPK === deletedPath) {
              newData.linkOriginalAPK = null;
              newData.sizeFileOriginalAPK = null;
            }

            // apks
            newData.apks = newData.apks.map((apk) =>
              apk.link === deletedPath ? { ...apk, link: "", size: "" } : apk
            );
            // xapks
            newData.xapks = newData.xapks.map((xapk) =>
              xapk.link === deletedPath ? { ...xapk, link: "", size: "" } : xapk
            );

            return newData;
          });

          setShowModal(false);
        }}
      />
    </div>
  );
};

export default FormCreatePArticle;
