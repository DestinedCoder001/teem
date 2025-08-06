import { File, X } from "lucide-react";

type Props = {
  handleRemoveAttachment: () => void;
  attachment: { type: string; url: string; fileName: string };
};

const AttachmentPreview = ({ handleRemoveAttachment, attachment }: Props) => {
  const imageTypes = ["jpeg", "png", "jpg"];
  const isImage = imageTypes
    .map((type) => attachment.type === type)
    .some(Boolean);
  return (
    <div
      className={`absolute bottom-full bg-white left-4 rounded-md ${
        isImage && "size-28"
      }`}
    >
      <div
        className="absolute -top-2 -right-2 cursor-pointer bg-white rounded-full border p-1"
        onClick={handleRemoveAttachment}
      >
        <X size={12} className="text-slate-800" />
      </div>
      {attachment &&
        (isImage ? (
          <img
            src={attachment.url}
            className="w-full h-full object-cover object-center rounded-md"
          />
        ) : (
          <div className="p-2 border flex flex-col items-center gap-y-2 rounded-md">
            <div className="flex items-center gap-x-2">
              <File size={20} className="text-primary" />
              <div className="text-slate-700 font-medium text-sm">
                {attachment.type?.toUpperCase()}
              </div>
            </div>
            <p className="text-slate-600 text-xs">
              {attachment.fileName?.length > 15
                ? attachment.fileName.slice(0, 15) + "..."
                : attachment.fileName}
            </p>
          </div>
        ))}
    </div>
  );
};

export default AttachmentPreview;
