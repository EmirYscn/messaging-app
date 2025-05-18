export const useDownloadFile = () => {
  const downloadFromPublicUrl = async (publicUrl: string) => {
    try {
      const response = await fetch(publicUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const filename = publicUrl.split("/").pop()?.split("?")[0] || "download";

      const a = document.createElement("a");
      a.href = url;
      a.download = filename; // Suggests filename to browser
      document.body.appendChild(a);
      a.click();

      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return { downloadFromPublicUrl };
};
