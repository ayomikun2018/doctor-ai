import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import "./columns.css";
import { Task } from "../tasks/tasks";

interface TaskType {
  id: number;
  name: string;
  rating?: number;
}

export interface CallStatusType {
  isInitiated: boolean;
  ssid: string;
  email: string;
}

interface ColumnProps {
  tasks: TaskType[];
  activeCallIndex: number;
  callStatus: CallStatusType;
}

const Column: React.FC<ColumnProps> = ({
  tasks,
  activeCallIndex,
  callStatus,
}) => {
  return (
    <div className="column">
      <table className="task-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Hospital Name</th>
            <th>Rating</th>
            <th>Call Status</th>
          </tr>
        </thead>
        <tbody>
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                id={task.id.toString()}
                index={index}
                title={task.name}
                rating={task.rating}
                activeCallIndex={activeCallIndex}
                callStatus={callStatus}
              />
            ))}
          </SortableContext>
        </tbody>
      </table>
    </div>
  );
};

export default Column;
