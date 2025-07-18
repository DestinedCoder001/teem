const NotFound = ({text}: {text: string}) => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="text-center">
        <h1 className="theme-text-gradient text-5xl font-bold">404</h1>
        <p className="text-slate-600 font-medium">{text}</p>
      </div>
    </div>
  );
};
export default NotFound;
