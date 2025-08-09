import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";

type Props = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

const DateTimePicker = ({ date, setDate }: Props) => {
  const [open, setOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  const now = new Date();
  const getTimeString = (d: Date) =>
    `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  const updateDateWithTime = (baseDate: Date, time: string) => {
    const [h, m] = time.split(":").map(Number);
    const updated = new Date(baseDate);
    updated.setHours(h || 0, m || 0, 0, 0);
    return updated;
  };

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
    const timeToUse = timeStr || getTimeString(now);
    const updated = updateDateWithTime(selected, timeToUse);
    setDate(updated);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeStr(newTime);
    const base = date || now;
    const updated = updateDateWithTime(base, newTime);
    setDate(updated);
  };

  useEffect(() => {
    if (date) setTimeStr(getTimeString(date));
    else {
      const initial = updateDateWithTime(now, getTimeString(now));
      setTimeStr(getTimeString(now));
      setDate(initial);
    }
  }, []);

  const formatDMY = (d: Date) =>
    `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        <Label className="dark:text-slate-100">Due Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-32 justify-between font-normal dark:text-slate-100"
            >
              {date ? formatDMY(date) : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="dark:text-slate-100">Due Time</Label>
        <Input
          type="time"
          value={timeStr}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
