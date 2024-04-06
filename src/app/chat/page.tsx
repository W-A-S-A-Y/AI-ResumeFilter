"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function ChatPdfs() {
  const [resumes, setResumes] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const getResumes = async () => {
    const res = await fetch(`/api/chat/get-resumes?chat-id=123456`).then(
      (res) => res.json()
    );
    setResumes(res.resumeLinks);
    return res.resumeLinks;
  };

  React.useEffect(() => {
    setLoading(true);
    getResumes();
    setLoading(false);
  }, []);

  console.log(resumes);

  return (
    <main className="p-5 h-[91vh] overflow-y-scroll scroll-smooth scrollbar-hide">
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <ul className="flex gap-2 flex-wrap">
          {resumes.map((link, i) => (
            <li key={i}>
              <iframe
                src={link}
                height={200}
                width={150}
                className="scroll-smooth rounded-md"
              ></iframe>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

const LoadingSkeleton = () => {
  return (
    <ul className="flex gap-2 flex-wrap">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i}>
          <Skeleton className="scroll-smooth rounded-md h-[200px] w-[150px]" />
        </li>
      ))}
    </ul>
  );
};

// "use client";
// import React from "react";

// export default function ChatPage() {
//   const [resumes, setResumes] = React.useState<string[]>([]);
//   const [loading, setLoading] = React.useState<boolean>(true);
//   const getResumes = async () => {
//     setLoading(true);
//     const res = await fetch("http://localhost:3000/api/chat/get-resumes").then(
//       (res) => res.json()
//     );
//     setResumes(res.resumeLinks);
//     setLoading(false);
//   };

//   React.useEffect(() => {
//     getResumes();
//   }, []);

//   if (loading) return <p>Loading ...</p>;

//   return (
//     <main className="p-5 h-[91vh] overflow-y-scroll scroll-smooth scrollbar-hide">
//       <ul className="flex gap-2 flex-wrap">
//         {resumes.map((link, i) => (
//           <li key={i}>
//             <iframe
//               src={link}
//               height={200}
//               width={150}
//               className="overflow-hidden scroll-smooth rounded-md"
//             ></iframe>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }
// // `https://docs.google.com/gview?url=${link}&embedded=true`
