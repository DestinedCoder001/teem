import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/custom/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <section className="space-y-4 mt-8">
      <div>
        <h2 className="text-xl font-medium">Appearance</h2>
        <p className="text-slate-600 dark:text-slate-200 my-1 text-sm">
          Manage your theme settings.
        </p>
      </div>

      <div className="p-4 flex justify-between items-center gap-2 border border-slate-300 dark:border-neutral-700 rounded-lg">
        <div className="flex items-center gap-x-4">
          {theme === "light" && <Sun strokeWidth={1.5} className="size-8 text-yellow-500" />}
          {theme === "dark" && <Moon strokeWidth={1.5} className="size-8 text-indigo-400" />}
          {theme === "system" && <Monitor strokeWidth={1.5} className="size-8 text-gray-500" />}
          <p className="capitalize">{theme || "system"}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Change Theme
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={theme || "system"}
              onValueChange={(value) =>
                setTheme(value as "light" | "dark" | "system")
              }
            >
              {themes.map((t) => (
                <DropdownMenuRadioItem
                  key={t.value}
                  value={t.value}
                  className="flex items-center gap-x-8 cursor-pointer"
                >
                  <span className="font-medium">{t.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
};

export default ThemeToggle;
