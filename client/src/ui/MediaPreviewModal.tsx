type MediaPreviewModalProps = {
  previewUrl: string;
};

export default function MediaPreviewModal({
  previewUrl,
}: MediaPreviewModalProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <img
        src={previewUrl}
        alt="Preview"
        className="max-w-full max-h-[80vh] sm:max-h-[70vh]
          xs:max-h-[50vh] px-2 rounded-xl object-contain"
      />
    </div>
  );
}
