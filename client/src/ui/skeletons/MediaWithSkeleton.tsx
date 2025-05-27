import { useState } from "react";
import MediaPreviewModal from "../MediaPreviewModal";
import Modal from "../Modal";

export function MediaWithSkeleton({ src }: { src: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-xs">
      {!isLoaded && (
        <div className="aspect-video h-40 w-40 bg-gray-300 animate-pulse rounded-lg" />
      )}
      <Modal>
        <Modal.Open opens="preview">
          <img
            src={src}
            alt="Chat media"
            onLoad={() => setIsLoaded(true)}
            className={`rounded-lg w-full h-auto object-cover border border-gray-300 transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </Modal.Open>
        <Modal.Window name="preview" className="bg-transparent shadow-none">
          <MediaPreviewModal previewUrl={src} />
        </Modal.Window>
      </Modal>
    </div>
  );
}
