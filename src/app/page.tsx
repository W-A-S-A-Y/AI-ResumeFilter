// export default function Home() {
//   return <div>Home</div>;
// }

"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>();
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");

  // http://docs.google.com/gview?url=http://path.com/to/your/pdf.pdf&embedded=true

  const uploadResumes = async ({ files }: { files: FileList | null }) => {
    if (files) {
      var formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }

      const res = await fetch("/api/upload-resumes?chat-id=123456", {
        method: "POST",
        body: formData,
      });
    }
  };

  const askLLM = async ({ prompt }: { prompt: string }) => {
    setAnswer("");
    const res = await fetch("/api/filter-resumes?chat-id=123456", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    }).then((res) => res.json());

    setAnswer(res.answer);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-2xl font-bold mb-2">Filter Your Resumes</h2>
      <p className="sm:w-[60%] md:w-[40%] lg:w-[30%] mb-7">
        Join thousands of professionals to instantly find the people who are
        right for the job!
      </p>
      <div>
        <input
          className="border-2 border-dashed p-10 hover:scale-[101%] active:scale-100 hover:bg-secondary duration-150 cursor-pointer text-center"
          type="file"
          accept=".pdf"
          multiple
          onChange={async (e) => {
            setSelectedFiles(e.target.files);
            await uploadResumes({ files: e.target.files });
          }}
        />
        <div className="flex mt-4">
          <input
            placeholder="Enter your prompt"
            className="p-2 text-sm flex-1 bg-transparent border outline-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            className="rounded-none h-auto"
            onClick={async () => await askLLM({ prompt })}
          >
            Search
          </Button>
        </div>
        {answer && (
          <textarea
            className="border bg-transparent w-full mt-4 p-2 text-sm scrollbar-hide"
            rows={7}
          >
            {answer}
          </textarea>
        )}
      </div>
    </div>
  );
}
