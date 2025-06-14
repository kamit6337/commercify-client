import { useRef, useState, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";

type ImageCropProps = {
  image: File;
  width?: number; // default crop width
  height?: number; // default crop height
  borderRadius?: number; // default border radius
  maxZoom?: number; // max zoom limit
  onCrop: (croppedImageFile: File) => void;
  cancelCrop: () => void;
};

const dataURLtoFile = (
  dataURL: string,
  fileName: string,
  lastModified?: number
): File => {
  const arr = dataURL.split(",");
  const match = arr[0].match(/:(.*?);/);
  if (!match) throw new Error("Invalid data URL format.");
  const mime = match[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  const imageType = mime.split("/")[1];
  const modifyFilename = `${fileName}.${imageType}`;

  return new File([u8arr], modifyFilename, {
    type: mime,
    lastModified: lastModified || Date.now(),
  });
};

const ImageCrop = ({
  image,
  width = 400,
  height = 300,
  borderRadius = 5,
  maxZoom = 3,
  onCrop,
  cancelCrop,
}: ImageCropProps) => {
  const editorRef = useRef<AvatarEditor | null>(null);
  const [scale, setScale] = useState<number>(1);

  // Reset scale when new image comes
  useEffect(() => {
    setScale(1);
  }, [image]);

  const handleCrop = () => {
    const canvas = editorRef.current?.getImage();
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/webp", 0.85);
    const filename = "croppedImage";
    const croppedImageFile = dataURLtoFile(dataURL, filename);
    onCrop(croppedImageFile);
  };

  return (
    <div className="w-full h-full fixed top-0 z-50 bg-gray-100 flex flex-col items-center py-4 gap-4 rounded-md">
      <AvatarEditor
        ref={editorRef}
        image={URL.createObjectURL(image)}
        width={width}
        height={height}
        border={50}
        borderRadius={borderRadius}
        scale={scale}
        className="rounded-lg shadow-md"
      />

      {/* Zoom Slider */}
      <div className="w-3/4 flex flex-col items-center gap-2">
        <input
          type="range"
          min={1}
          max={maxZoom}
          step={0.01}
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-6 w-full px-4">
        <button
          onClick={cancelCrop}
          className="flex-1 p-2 border rounded-full hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={handleCrop}
          className="flex-1 p-2 bg-foreground text-background rounded-full hover:bg-slate-900"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ImageCrop;
