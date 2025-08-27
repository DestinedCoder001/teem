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
    <div className="size-52 rounded-lg overflow-hidden border flex flex-col gap-2 justify-center items-center bg-white dark:bg-neutral-800">
      <div
        onClick={handleOpen}
        className="border-2 border-slate-300 dark:border-slate-500 hover:border-primary dark:hover:border-primary border-dotted p-2 rounded-md bg-slate-100 dark:bg-neutral-800 hover:bg-primary/30 group cursor-pointer"
      >
        <Download
          strokeWidth={1.5}
          className="text-slate-400 group-hover:text-primary"
          size={30}
        />
      </div>
      <div className="text-slate-600 dark:text-slate-100 font-medium uppercase text-center">
        {type}
      </div>
      <p className="text-slate-600 dark:text-slate-200 text-sm">{fileName}</p>
    </div>
  );
};

export default Attachment;
