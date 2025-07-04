import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  CheckCircle,
  PlayCircle,
  Trash2,
  Flag,
} from "lucide-react";

const TaskCard = () => {
  const [projectProgress] = useState(32);

  const handleMarkComplete = () => {
    console.log("Task marked complete");
  };

  const handleMarkInProgress = () => {
    console.log("Task marked in progress");
  };

  const handleDeleteTask = () => {
    console.log("Task deleted");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-300 px-6 py-4 max-w-md mx-auto cursor-pointer">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Konsep design homepage
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMarkComplete}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Complete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMarkInProgress}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Mark In Progress
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteTask}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center text-sm text-slate-500 mb-2 font-[500]">
        <Flag className="h-4 w-4 mr-2" />
        <span>Due Nov 24</span>
      </div>

      <p className="text-gray-700 text-xs mb-6 font-[500] tracking-wide">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam
      </p>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-gray-800 font-medium">Project Progress</span>
          <span className="text-gray-800 font-medium">{projectProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-primary/60 to-secondary/60 h-2.5 rounded-full"
            style={{ width: `${projectProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <div className="flex -space-x-2 overflow-hidden">
          <div className="relative h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center"></div>
          <div className="relative h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center"></div>
          <div className="relative h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center"></div>
        </div>
        <span className="text-sm text-gray-600 ml-2">+ 15 people</span>
      </div>
    </div>
  );
};

export default TaskCard;
