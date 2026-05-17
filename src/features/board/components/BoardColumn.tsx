import type { ITask } from "../../tasks/types";
import { BoardTaskCard } from "./BoardTaskCard";

interface BoardColumnProps {
  title: string;
  tasks: ITask[];
  bgColor: string;
}

export const BoardColumn = ({ title, tasks, bgColor }: BoardColumnProps) => {
  return (
    <div className="w-1/3 flex flex-col gap-2 p-4">
      <header className="flex flex-row justify-between font-bold ">
        <h1 className="uppercase text-sm text-gray-700">{title}</h1>
        <span className={`text-xs ${bgColor} px-2 py-1 rounded-full text-white`}>{tasks.length}</span>
      </header>
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto hide-scrollbar">
        {tasks.map((task) => (
          <BoardTaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};
