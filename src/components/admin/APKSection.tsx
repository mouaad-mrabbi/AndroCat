import React, { useEffect, useState } from "react";
import PageMultipartFileUploader from "../(MultipartFileUploader)/PageMultipartFileUploader";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type FileItemType = "apks" | "xapks";

interface FileItem {
  version: string;
  link: string;
  size: string;
  isMod: boolean;
  order?: number | undefined;
}

interface InternalFileItem extends FileItem {
  id: string;
}

interface Props {
  type: FileItemType;
  items: FileItem[];
  collapsed: boolean[];
  onToggleCollapse: (index: number) => void;
  onChange: (index: number, field: keyof FileItem, value: any) => void;
  onRemove: (link: string, index: number) => void;
  onUpload: (result: any, index: number) => void;
  onAdd: () => void;
  onReorder: (newItems: FileItem[]) => void;
  title: string;
  randomText: string;
}

const SortableItem: React.FC<{
  id: string;
  item: InternalFileItem;
  index: number;
  collapsed: boolean;
  onToggleCollapse: (index: number) => void;
  onChange: (index: number, field: keyof FileItem, value: any) => void;
  onRemove: (link: string, index: number) => void;
  onUpload: (result: any, index: number) => void;
  type: FileItemType;
  title: string;
  randomText: string;
}> = ({
  id,
  item,
  index,
  collapsed,
  onToggleCollapse,
  onChange,
  onRemove,
  onUpload,
  type,
  title,
  randomText,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "default",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border p-4 rounded-md space-y-2 bg-gray-50 dark:bg-gray-800 mb-2"
    >
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-800 dark:text-white">
          {item.version ? item.version : `${type.toUpperCase()} #${index + 1}`}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleCollapse(index)}
            className="text-blue-600 text-xs hover:underline"
          >
            {collapsed ? "Show Details" : "Hide Details"}
          </button>
          {/* drag handle */}
          <button
            {...listeners}
            {...attributes}
            type="button"
            className="ml-2 p-1 cursor-grab text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            aria-label="Drag Handle"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            ☰
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm">Version:</label>
            <input
              type="text"
              value={item.version}
              onChange={(e) => onChange(index, "version", e.target.value)}
              className="w-full mt-1 px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm">Link:</label>
            <input
              type="text"
              value={item.link}
              onChange={(e) => onChange(index, "link", e.target.value)}
              className="w-full mt-1 px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm">Size:</label>
            <input
              type="text"
              value={item.size}
              onChange={(e) => onChange(index, "size", e.target.value)}
              className="w-full mt-1 px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={item.isMod}
              onChange={(e) => onChange(index, "isMod", e.target.checked)}
            />
            <label className="text-sm">Is Mod?</label>
          </div>
        </div>
      )}
      {/* نخلي uploader موجود دايمًا لكن مخفي لو collapsed */}
      <div style={{ display: collapsed ? "none" : "block" }}>
        <PageMultipartFileUploader
          title={title}
          randomText={randomText}
          fileType={type}
          version={item.version}
          isMod={item.isMod}
          onUploadResult={(result) => onUpload(result, index)}
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.link, index)}
        className="text-red-600 text-sm hover:underline mt-2"
      >
        Remove {type.toUpperCase()}
      </button>
    </div>
  );
};

const APKSection: React.FC<Props> = ({
  type,
  items,
  collapsed,
  onToggleCollapse,
  onChange,
  onRemove,
  onUpload,
  onAdd,
  onReorder,
  title,
  randomText,
}) => {
  const [internalItems, setInternalItems] = useState<InternalFileItem[]>([]);

  useEffect(() => {
    setInternalItems(
      items.map((item) => ({
        id: String(item.order ?? Math.random()),
        ...item,
      }))
    );
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 500, // تأخير 500ms قبل بدء السحب
        tolerance: 5, // حركة صغيرة قبل التفعيل
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = internalItems.findIndex((item) => item.id === active.id);
      const newIndex = internalItems.findIndex((item) => item.id === over.id);

      const newInternalItems = arrayMove(internalItems, oldIndex, newIndex);
      setInternalItems(newInternalItems);

      const newItemsForParent = newInternalItems.map(({ id, ...rest }) => rest);
      onReorder(newItemsForParent);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {type.toUpperCase()}:
      </label>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={internalItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {internalItems.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              item={item}
              index={index}
              collapsed={collapsed[index]}
              onToggleCollapse={onToggleCollapse}
              onChange={onChange}
              onRemove={onRemove}
              onUpload={onUpload}
              type={type}
              title={title}
              randomText={randomText}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={onAdd}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
      >
        + Add {type.toUpperCase()}
      </button>
    </div>
  );
};

export default APKSection;
