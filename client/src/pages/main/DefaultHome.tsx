const DefaultHome = () => {
  return (
    <div className="h-full">
      <div className="h-full w-full flex flex-col items-center justify-center text-center cover">
        <div className="text-center space-y-4">
          <h1 className="theme-text-gradient text-4xl lg:text-5xl font-bold">
            Welcome to Teem
          </h1>
          <p className="text-slate-600 text-md font-medium">
            Collaborate with your team in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default DefaultHome;
