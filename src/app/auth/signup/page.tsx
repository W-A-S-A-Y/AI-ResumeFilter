import SignupForm from "./signup-form";

export default function Signup() {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="w-[80%] sm:w-[40%] lg:w-[25%] border p-10 border-dashed rounded-md shadow-lg">
        <SignupForm />
      </div>
    </div>
  );
}
