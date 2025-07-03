import wsHolder from "@/assets/ws-holder.png";

function DefaultHome() {
  return (
    <div className="h-full">
      <div className="h-full w-full flex flex-col items-center justify-center text-center">
        <div className="relative w-96 h-96">
          <img
            src={wsHolder}
            className="absolute top-0 left-0 h-full w-full grayscale-100 opacity-50"
          />
        </div>
      </div>
    </div>
  );
}

export default DefaultHome;
