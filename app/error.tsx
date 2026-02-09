"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-stone-500 mb-6">
          We couldn&apos;t load this page. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-stone-900 text-white rounded-md font-medium hover:bg-stone-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
