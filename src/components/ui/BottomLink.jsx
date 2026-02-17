import { useNavigate } from "react-router-dom";

function BottomLink({ text, onClick, poser }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="my-[50px] flex items-center">
        <div className="flex-grow border-t border-neutral-300"></div>

        <span className="mx-4 text-sm text-neutral-500 font-medium">OR</span>

        <div className="flex-grow border-t border-neutral-300"></div>
      </div>
      <div className="text-center text-sm text-neutral-600 space-y-2">
        <p>
          {poser}
          <span className="text-primary-600 cursor-pointer" onClick={onClick}>
            {text}
          </span>
        </p>

        <p
          onClick={() => navigate("/")}
          className="cursor-pointer hover:text-primary-600"
        >
          ← Back to Home
        </p>
      </div>
    </>
  );
}

export default BottomLink;
