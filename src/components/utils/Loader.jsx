import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-deepNavy/10 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning loader icon */}
        <AiOutlineLoading3Quarters className="text-6xl text-aqua animate-spin" />

        {/* Optional text */}
        <p className="text-aqua text-lg font-semibold tracking-wide">Loading...</p>
      </div>
    </div>
  );
}

export default Loader;
