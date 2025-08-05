import { Button } from "../ui/button";

const AuthError = ({error}: {error: string}) => {
  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-lg font-medium ">
        {error || "Something went wrong"}
      </p>
      <Button
        className="border border-[#aaa] px-4 py-2 rounded-lg text-lg theme-text-gradient"
        onClick={() => window.location.reload()}
      >
        Retry
      </Button>
    </div>
  );
};

export default AuthError;
