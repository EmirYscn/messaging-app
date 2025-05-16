import { useState } from "react";

export function MediaWithSkeleton({ src }: { src: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-xs">
      {!isLoaded && (
        <div className="aspect-video h-40 w-40 bg-gray-300 animate-pulse rounded-lg" />
      )}
      <img
        src={src}
        alt="Chat media"
        onLoad={() => setIsLoaded(true)}
        className={`rounded-lg w-full h-auto object-cover border border-gray-300 transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
