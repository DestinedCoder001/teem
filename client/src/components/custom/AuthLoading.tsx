import LoadingSvg from "./LoadingSvg";

const AuthLoading = () => {
  return (
    <div
      id="auth-loading"
      className="h-[100dvh] flex items-center justify-center"
    >
      <div className="loading-svg">
        <LoadingSvg />
      </div>
    </div>
  );
};

export default AuthLoading;
