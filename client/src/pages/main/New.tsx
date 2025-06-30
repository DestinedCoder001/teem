import { Button } from "@/components/ui/button";

const New = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="text-center space-y-3">
        <p className="text-slate-800 font-[500]">Create a workspace</p>
        <Button className="border border-[#aaa] px-4 py-2 rounded-lg text-md theme-text-gradient">
          Create
        </Button>
      </div>
    </div>
  );
};

export default New;
