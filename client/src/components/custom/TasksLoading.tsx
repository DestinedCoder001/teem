import { Skeleton } from "../ui/skeleton";

const TasksLoading = () => {
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Skeleton className="w-[8rem] h-[2.5rem] rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Skeleton className="w-full h-[10rem] rounded-md" key={item} />
        ))}
      </div>
    </div>
  );
};

export default TasksLoading;
