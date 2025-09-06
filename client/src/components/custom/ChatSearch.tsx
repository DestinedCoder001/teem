import type { MessageProps } from "@/lib/types";
import { Input } from "../ui/input";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type Props = {
  usage?: "chat" | "channel";
  isSearching: boolean;
  messagesList: MessageProps[];
  setSearchList: Dispatch<SetStateAction<MessageProps[]>>;
};

const ChatSearch = ({ isSearching, messagesList, setSearchList, usage }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchList(messagesList);
    } else {
      const value = searchTerm.trim().toLowerCase();
      setSearchList(
        messagesList.filter((message) =>
          message.content.toLowerCase().includes(value)
        )
      );
    }
  }, [searchTerm, messagesList, setSearchList]);

  useEffect(() => {
    if (!isSearching) {
      setSearchTerm("");
      setSearchList(messagesList);
    }
  }, [isSearching, messagesList, setSearchList]);

  useEffect(() => {
    if (isSearching) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isSearching]);

  if (!isSearching) return null;

  return (
    <div className={`absolute top-full w-56 rounded-b-lg border border-slate-300 bg-slate-50 p-2 dark:border-neutral-700 dark:bg-neutral-800 ${usage === "chat" ? "right-4" : "left-4"}`}>
      <Input
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
};

export default ChatSearch;
