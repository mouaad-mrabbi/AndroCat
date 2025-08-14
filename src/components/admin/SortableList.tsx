// components/SortableList.tsx
import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

interface SortableListProps {
  items: string[];
  onChange: (newItems: string[]) => void;
  renderItem: (props: { id: string; isDragging: boolean }) => React.ReactNode;
  strategy?: typeof verticalListSortingStrategy | typeof rectSortingStrategy;
  wrapperClassName?: string;
}

export default function SortableList({
  items,
  onChange,
  renderItem,
  strategy = verticalListSortingStrategy,
  wrapperClassName = "flex flex-col gap-2",
}: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200, // ضغط مطوّل قبل بدء السحب (200 مللي ثانية)
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  // عنصر قابل للسحب
  const SortableItem = ({ id }: { id: string }) => {
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
      touchAction: "none",
      zIndex: isDragging ? 999 : undefined,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {renderItem({ id, isDragging })}
      </div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToParentElement]} // فقط هذا يمنع الخروج من الحاوية
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={strategy}>
        <div className={wrapperClassName}>
          {items.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
