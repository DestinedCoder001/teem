import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

type Props = {
  filters: string[];
  setFilters: Dispatch<SetStateAction<string[]>>;
};

const TaskStatusFilter = ({ filters, setFilters }: Props) => {
  const handleChange = (status: string) => {
    if (status === "all" && filters.length === 3) return;
    if (status === "all" && filters.length < 3) {
      return setFilters(["pending", "completed", "due"]);
    }
    if (filters.includes(status)) {
      if (filters.length === 1) return;
      setFilters((prev) => prev.filter((item) => item !== status));
    } else {
      setFilters((prev) => [...prev, status]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-slate-600 dark:text-slate-100 font-normal flex">
          <span>Filter by status</span> <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuCheckboxItem
          checked={filters.length === 3}
          onCheckedChange={() => handleChange("all")}
        >
          All
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.includes("pending")}
          onCheckedChange={() => handleChange("pending")}
        >
          In progress
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.includes("completed")}
          onCheckedChange={() => handleChange("completed")}
        >
          Completed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.includes("due")}
          onCheckedChange={() => handleChange("due")}
        >
          Due
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskStatusFilter;
