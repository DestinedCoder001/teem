import { Switch } from "@/components/ui/switch";
import { useAllowNotifications } from "@/lib/store/uiStore";
import { Bell, BellOff } from "lucide-react";

const NotificationsToggle = () => {
  const { subscribe, toggleSubscribe } = useAllowNotifications(
    (state) => state
  );
  const handleToggle = () => toggleSubscribe(!subscribe);

  return (
    <section className="space-y-4 mt-8">
      <div>
        <h2 className="text-xl font-medium">Notifications</h2>
        <p className="text-slate-600 dark:text-slate-200 my-1 text-sm">
          Manage your notification preferences.
        </p>
      </div>

      <div className="p-4 flex justify-between items-center gap-2 border border-slate-300 dark:border-neutral-700 rounded-lg">
        <div className="flex items-center gap-x-4">
          <div className="shrink-0">

          {subscribe ? (
            <Bell strokeWidth={1.5} className="size-8 text-blue-500" />
          ) : (
            <BellOff strokeWidth={1.5} className="size-8 text-blue-500" />
          )}
          </div>
          <div>
            <p className="font-medium">Toggle notifications</p>
            <p className="text-sm text-slate-500 dark:text-slate-200">
              Notifications will only be displayed if allowed from your browser
              settings.
            </p>
          </div>
        </div>

        <Switch checked={subscribe} onCheckedChange={handleToggle} />
      </div>
    </section>
  );
};

export default NotificationsToggle;
