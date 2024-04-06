import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ChatLayout({
  children,
  sidebar,
  currentchat,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  currentchat: React.ReactNode;
}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="border-x">
      <ResizablePanel defaultSize={20} minSize={10} maxSize={20}>
        {sidebar}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} minSize={10}>
        {currentchat}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
