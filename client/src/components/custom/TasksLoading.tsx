import { Skeleton } from "../ui/skeleton";

const TasksLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Skeleton className="w-full h-[16rem] rounded-md" key={item} />
      ))}
    </div>
  );
};

export default TasksLoading;
