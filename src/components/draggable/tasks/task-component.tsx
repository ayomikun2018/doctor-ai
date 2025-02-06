import React from "react";
import { Task } from "../tasks/tasks";

interface TaskProps {
  id: number;
  title: string;
}

const TaskComponent: React.FC<TaskProps> = ({ id, title }) => {
  return (
    <div className="task">
      {id}. {title}
    </div>
  );
};

export default TaskComponent;
