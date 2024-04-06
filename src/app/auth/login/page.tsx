import LoginForm from "./login-form";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="w-[80%] sm:w-[40%] lg:w-[25%] border p-10 border-dashed rounded-md shadow-lg">
        <LoginForm />
      </div>
    </div>
  );
}
