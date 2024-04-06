"use client";

import { Button } from "@/components/ui/button";
import { AiOutlineSend } from "react-icons/ai";

export default function CurrentChat() {
  const getFiles = async () => {
    await fetch("/api/chat/get-resumes?chat-id=123456", {
      method: "GET",
      // body: JSON.stringify({}),
    });
  };
  return (
    <div className="p-3 flex flex-col justify-between h-[91vh]">
      <div>
        <h3 className="mb-5">Chat</h3>
        <ul className="h-[68vh] overflow-y-auto scrollbar-hide scroll-smooth">
          <li>
            <p className="text-xs border rounded-sm p-2 mb-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
              optio culpa hic similique cumque obcaecati. Libero expedita cum
              perferendis, consequatur sapiente maiores rem consequuntur veniam.
            </p>
          </li>
          <li>
            <p className="text-xs border rounded-sm p-2 ml-10 bg-secondary text-secondary-foreground mb-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur,
              inventore?
            </p>
          </li>
          <li>
            <p className="text-xs border rounded-sm p-2 mb-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
              optio culpa hic similique cumque obcaecati. Libero expedita cum
              perferendis, consequatur sapiente maiores rem consequuntur veniam.
            </p>
          </li>
          <li>
            <p className="text-xs border rounded-sm p-2 ml-10 bg-secondary text-secondary-foreground mb-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur,
              inventore?
            </p>
          </li>
        </ul>
      </div>
      <div className="flex z-20">
        <input
          className="flex-1 bg-transparent border rounded-l-md p-2 text-xs outline-none"
          placeholder="Ask any question..."
        />
        <Button
          size={"icon"}
          className="rounded-l-none h-auto"
          onClick={getFiles}
        >
          <AiOutlineSend />
        </Button>
      </div>
    </div>
  );
}
