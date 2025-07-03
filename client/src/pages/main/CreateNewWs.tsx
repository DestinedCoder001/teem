import CreateWorkspaceDialog from "@/components/custom/CreateWorkspaceDialog";
const CreateNewWs = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="text-center space-y-3">
        <p className="text-slate-800 font-[500]">Create a workspace</p>
        <CreateWorkspaceDialog />
      </div>
    </div>
  );
};

export default CreateNewWs;
