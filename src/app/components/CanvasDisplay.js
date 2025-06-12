"use client";
import { useMeasurement } from "../context/MeasurementContext";

export default function CanvasDisplay() {
  const {
    uploadedImage,
    imageRef,
    canvasRef,
    imageLoaded,
    handleCanvasClick,
    handleImageLoad,
  } = useMeasurement();

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      <img
        ref={imageRef}
        src={uploadedImage}
        alt="Floor Plan"
        onLoad={handleImageLoad}
        className="max-w-full h-auto block"
        style={{ display: "none" }}
      />

      {imageLoaded && (
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="max-w-full h-auto cursor-crosshair block"
          style={{
            background: `url(${uploadedImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      )}
    </div>
  );
}
