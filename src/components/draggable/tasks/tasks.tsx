
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskProps {
  id: string;
  title: string;
  rating?: number;
  distance?: string;
  index: number;
  activeCallIndex: number;
  callStatus: {
    isInitiated: boolean;
  };
}
export const Task: React.FC<TaskProps> = ({
  id,
  title,
  rating,
  index,
  activeCallIndex,
  distance,
  callStatus,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td>{index + 1}</td>
      <td>{title}</td>
      <td>{rating !== undefined ? `:star: ${rating}` : `:star: -`}</td>
      <td>
        {callStatus.isInitiated === false
          ? "..."
          : activeCallIndex === index
          ? ":telephone_receiver: Calling..."
          : ":x:"}
      </td>
      <td>{distance}</td>
    </tr>
  );
};