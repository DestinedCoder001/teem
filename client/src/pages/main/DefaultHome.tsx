import wsHolder from "@/assets/ws-holder.png";
import { Link } from "react-router-dom";

function DefaultHome() {
  return (
    <div className="h-[calc(100vh-50px)]">
      <div className="h-full w-full flex flex-col items-center justify-center text-center">
        <div className="relative w-96 h-96">
          <img src={wsHolder} className="absolute top-0 left-0 h-full w-full grayscale-100 opacity-50" />
          {/* <Button className="absolute bottom-8 left-1/2 -translate-x-1/2 -translate-y-1/2">Create workspace</Button> */}
        </div>

        <Link to="w">Ws</Link>
        <Link to="c">Channel</Link>
      </div>
    </div>
  );
}

export default DefaultHome;
