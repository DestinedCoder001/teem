import { useCreateWsDialogOpen } from "@/lib/store/uiStore";
import { Button } from "../ui/button";

const CreateWsBtn = () => {
  const { setOpen } = useCreateWsDialogOpen((state) => state);

  return (
    <Button
      className="border border-[#aaa] px-4 py-2 rounded-lg text-md theme-text-gradient"
      onClick={() => {
        setOpen(true);
      }}
    >
      Create
    </Button>
  );
};

export default CreateWsBtn;
