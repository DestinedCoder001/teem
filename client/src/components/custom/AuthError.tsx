import { Button } from "../ui/button";

const AuthError = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-lg font-medium ">
        Something went wrong while restoring your session.
      </p>
      <Button
        className="border border-[#aaa] px-4 py-2 rounded-lg text-lg text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
        onClick={() => window.location.reload()}
      >
        Retry
      </Button>
    </div>
  );
};

export default AuthError;
