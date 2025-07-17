import { Button } from "@/components/ui/button";
import { useTaskSheetOpen } from "@/lib/store/uiStore";

const DMs = () => {
  const { setOpen } = useTaskSheetOpen((state) => state);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>open</Button>
    </div>
  );
};
export default DMs;
