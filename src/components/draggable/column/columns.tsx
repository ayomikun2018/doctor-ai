// import React from "react";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

// import "./columns.css";
// import { Task } from "../tasks/tasks"; // Import Task component

// // Define the Task type if not already defined
// interface Task {
//   id: number;
//   name: string;
// }

// // Define the props type for the Column component
// interface ColumnProps {
//   tasks: Task[];
// }

// const Column: React.FC<ColumnProps> = ({ tasks }) => {
//   return (
//     <div className="column">
//       <SortableContext
//         key={tasks.map((task) => task.place_id).join(",")}
//         items={tasks}
//         strategy={verticalListSortingStrategy}
//       >
//         {tasks.map((task, index) => (
//           <Task
//             key={task.place_id}
//             id={task.place_id}
//             title={task.name}
//             title={task.rating}
//             index={index}
//           /> // Pass index prop
//         ))}
//       </SortableContext>
//     </div>
//   );
// };

// export default Column;

import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import "./columns.css";
import { Task } from "../tasks/tasks"; // Import Task component

// Define the Task type
interface TaskType {
  id: number;
  name: string;
  rating?: number; // Added optional rating property
}

// Define the props type for the Column component
interface ColumnProps {
  tasks: TaskType[];
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
          <Task
            key={task.id}
            id={task.id}
            title={task.name}
            rating={task.rating}
            index={index}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default Column;
