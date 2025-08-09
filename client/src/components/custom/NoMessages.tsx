import noMessages from "@/assets/no-messages.svg";
const NoMessages = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-600">
      <div className="w-72 h-auto">
        <img src={noMessages} alt="No messages" />
      </div>
      <p className="dark:text-slate-200">No messages yet</p>
    </div>
  );
};

export default NoMessages;
