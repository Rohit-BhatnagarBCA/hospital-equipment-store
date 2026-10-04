
import { Sparkles } from "lucide-react";

function AiAgent() {
  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <button
        type="button"
        aria-label="Open Medical AI Assistant"
        className="
          group flex h-14 w-14 items-center justify-center
          overflow-hidden rounded-full
          border border-blue-100
          bg-[var(--color-navy)]
          text-white
          shadow-[0_10px_30px_rgba(16,42,86,0.22)]
          transition-all duration-300
          hover:w-[118px]
          hover:shadow-[0_14px_38px_rgba(16,42,86,0.28)]
          active:scale-95
        "
      >
        <span
          className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-full
            bg-[var(--color-blue)]
            transition-transform duration-300
            group-hover:scale-95
          "
        >
          <Sparkles
            size={19}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:rotate-12"
          />
        </span>

        <span
          className="
            ml-2 max-w-0 overflow-hidden whitespace-nowrap
            text-sm font-medium
            opacity-0
            transition-all duration-300
            group-hover:max-w-[55px]
            group-hover:opacity-100
          "
        >
          Ask AI
        </span>
      </button>
    </div>
  );
}

export default AiAgent;