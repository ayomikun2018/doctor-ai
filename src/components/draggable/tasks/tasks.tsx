"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import "./tasks.css";

interface TaskProps {
  id: number;
  title: string;
  index: number; // Add index prop
}

export const Task: React.FC<TaskProps> = ({ id, title, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task flex justify-between"
    >
      {index === 0 ? "✅" : "❌"} {title}
    </div>
  );
};
