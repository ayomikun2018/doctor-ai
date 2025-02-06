import React from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import "./columns.css";
import { Task } from "../tasks/tasks"; // Import Task component

// Define the Task type if not already defined
interface Task {
  id: number;
  name: string;
}

// Define the props type for the Column component
interface ColumnProps {
  tasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ tasks }) => {
  return (
    <div className="column">
      <SortableContext
        key={tasks.map((task) => task.id).join(",")}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task, index) => (
          <Task key={task.id} id={task.id} title={task.name} index={index} /> // Pass index prop
        ))}
      </SortableContext>
    </div>
  );
};

export default Column;