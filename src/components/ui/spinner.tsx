import { cn } from "@/lib/utils";

const Spinner = ({ size }: { size?: "sm" | "md" | "lg" }) => {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full h-6 w-6 border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        size === "sm"
          ? "h-6 w-6"
          : size === "md"
          ? "h-7 w-7"
          : size === "lg"
          ? "h-8 w-8"
          : null
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export { Spinner };
