import { useCreateChannelDialogOpen } from "@/lib/store/uiStore";
import { Button } from "../ui/button";

const CreateChannelBtn = () => {
  const { setOpen } = useCreateChannelDialogOpen((state) => state);

  return (
    <Button
    variant="ghost"
      className="w-full border border-[#aaa] p-2 rounded-md text-slate-600"
      onClick={() => {
        setOpen(true);
      }}
    >
      Create
    </Button>
  );
};

export default CreateChannelBtn;
