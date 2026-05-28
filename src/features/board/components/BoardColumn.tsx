import type { ITask } from "../../tasks/types";
import { BoardTaskCard } from "./BoardTaskCard";

interface BoardColumnProps {
  title: string;
  tasks: ITask[];
  bgColor: string;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onDrop: (taskId: string, newStatus: string) => void;
  onDragOver: (status: string) => void;
  status: string;
  isDraggingOver: boolean;
}

export const BoardColumn = ({ title, tasks, bgColor, onDragStart, onDragEnd, onDrop, onDragOver, status, isDraggingOver }: BoardColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onDragOver(status);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onDrop(taskId, status);
    }
  };

  return (
    <div 
      className={`w-1/3 flex flex-col gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-200/50 transition-all duration-200 ${isDraggingOver ? 'border-indigo-400 bg-indigo-50/30' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <header className="flex flex-row justify-between items-center">
        <h1 className="uppercase text-xs font-bold text-gray-600 tracking-wider">{title}</h1>
        <span className={`text-xs font-semibold ${bgColor} px-2.5 py-1 rounded-full text-white shadow-sm`}>{tasks.length}</span>
      </header>
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto hide-scrollbar pr-1">
        {tasks.map((task) => (
          <BoardTaskCard 
            key={task._id} 
            task={task} 
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
};
