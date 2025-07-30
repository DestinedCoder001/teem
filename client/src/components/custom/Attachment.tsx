import { Download } from "lucide-react";

type Props = {
  fileName: string;
  url: string;
  type: string;
};
const Attachment = ({ fileName, url, type }: Props) => {
  const handleOpen = () => {
    window.open(url, "_blank");
  };
  return (
    <div className="size-52 rounded-lg overflow-hidden border flex flex-col gap-2 justify-center items-center">
      <div
        onClick={handleOpen}
        className="border-2 border-slate-300 hover:border-primary border-dotted p-2 rounded-md bg-slate-100 hover:bg-primary/30 group cursor-pointer"
      >
        <Download
          className="text-slate-400 group-hover:text-primary"
          size={30}
        />
      </div>
      <div className="text-slate-600 font-medium uppercase text-center">
        {type}
      </div>
      <p className="text-slate-600 text-sm">{fileName}</p>
    </div>
  );
};

export default Attachment;
