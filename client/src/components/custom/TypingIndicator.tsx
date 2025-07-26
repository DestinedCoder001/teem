const TypingIndicator = ({ images }: { images: string[] }) => {
  let mapImages = [];
  if (images.length > 4) {
    mapImages = images.slice(-4);
  } else {
    mapImages = images;
  }
  if (!images.length) return null;
  return (
    <div className="flex">
      <div className="flex items-end gap-x-1">
        {images.length > 4 && (
          <div className="h-7 w-7 lg:h-6 lg:w-6 rounded-full bg-slate-400 text-white font-bold text-xs flex justify-center items-center">
            {images.length - 4}
          </div>
        )}
        <div className="flex -space-x-2 items-center opacity-50">
          {mapImages.map((image, index) => (
            <div
              key={index}
              className="h-7 w-7 lg:h-6 lg:w-6 rounded-full border border-slate-200 overflow-hidden"
            >
              <img className="w-full h-full object-cover" src={image} />
            </div>
          ))}
        </div>
        <div className="flex gap-x-1 px-4 py-2 rounded-t-lg rounded-br-lg border border-slate-300 opacity-50">
          <span className="block size-3 rounded-full bg-slate-500 animate-pulse" />
          <span className="block size-3 rounded-full bg-slate-500 animate-pulse" />
          <span className="block size-3 rounded-full bg-slate-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
