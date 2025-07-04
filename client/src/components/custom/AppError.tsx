const AppError = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="text-center">
        <h1 className="theme-text-gradient text-5xl font-bold">Oops</h1>
        <p className="text-slate-600 text-sm font-medium">An error occurred!</p>
      </div>
    </div>
  );
};

export default AppError;
