import { currentWs, useUserWorkspaces } from "@/lib/store/userStore";
import CreateNewWs from "./CreateNewWs";
import { Button } from "@/components/ui/button";
import { useTaskSheetOpen } from "@/lib/store/uiStore";

const DMs = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { wsId } = currentWs((state) => state);
  const { setOpen } = useTaskSheetOpen((state) => state);

  if (!workspaces.length || !wsId) {
    return <CreateNewWs />;
  }
  return (
    <div>
      <Button onClick={() => setOpen(true)}>open</Button>
    </div>
  );
};
export default DMs;
