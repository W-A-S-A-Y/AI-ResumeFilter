import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BsStars } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

export default function Sidebar() {
  return (
    <aside className="p-3 flex flex-col h-[91vh] justify-between">
      <div>
        <Button size={"sm"} className="w-full flex justify-between mb-5">
          <span className="flex items-center gap-x-2">
            <BsStars />
            New Chat
          </span>
          <FiEdit />
        </Button>
        <ul className="h-[69vh] overflow-y-scroll scrollbar-hide scroll-smooth">
          {Array.from({ length: 16 }).map((item, i) => (
            <li key={i}>
              <Button
                size={"sm"}
                variant={"outline"}
                className="w-full flex justify-between mb-2 text-xs"
              >
                Lorem ipsum ...
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <Button variant={"outline"} size={"sm"} className="flex justify-between">
        Upgrade Plan
        <BsStars />
      </Button>
    </aside>
  );
}
