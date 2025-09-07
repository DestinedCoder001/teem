import { useMeta } from "@/lib/hooks/useMeta";

const NotFound = ({ text }: { text: string }) => {
  
  useMeta({
    title: "Page not found",
  });

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="text-center">
        <h1 className="theme-text-gradient text-5xl font-bold">404</h1>
        <p className="text-slate-600 dark:text-slate-200 font-medium">{text}</p>
      </div>
    </div>
  );
};
export default NotFound;
