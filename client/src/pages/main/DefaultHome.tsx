import cover from "../../assets/ws-bg.png"
const DefaultHome = () => {
  return (
    <div className="h-full transition-[width] duration-300">
      <div className="h-full w-full flex flex-col items-center justify-center text-center">
        <img src={cover} className="size-80" />
        <p className="text-sm font-medium text-slate-600">Collaborate with your team in real-time</p>
      </div>
    </div>
  );
};

export default DefaultHome;
