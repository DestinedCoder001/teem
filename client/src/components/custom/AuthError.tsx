import { Button } from "../ui/button";
import badconnection from "../../assets/network_error.png";
const AuthError = ({ error }: { error: string }) => {
  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center gap-4 text-center">
      <img src={badconnection} className="size-64" />
      <p className="text-slate-600 dark:text-slate-200 font-medium ">
        {error || "Something went wrong"}
      </p>
      <Button
        size="sm"
        variant="outline"
        className="px-4 py-2 rounded-lg text-lg theme-text-gradient"
        onClick={() => window.location.reload()}
      >
        Retry
      </Button>
    </div>
  );
};

export default AuthError;
