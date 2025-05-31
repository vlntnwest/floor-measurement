"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import ControlsPanel from "./components/ControlsPanel";
import Instructions from "./components/Instructions";
import CanvasDisplay from "./components/CanvasDisplay";
import "./globals.css";

export default function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mode, setMode] = useState("reference");
  const [referencePoints, setReferencePoints] = useState([]);
  const [referenceDistance, setReferenceDistance] = useState("");
  const [measurePoints, setMeasurePoints] = useState([]);
  const [scaleFactor, setScaleFactor] = useState(null);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setImageLoaded(false);
        setReferencePoints([]);
        setMeasurePoints([]);
        setScaleFactor(null);
        setCalculatedDistance(null);
        setReferenceDistance("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    drawCanvas();
  };

  const calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = img.naturalWidth * zoom;
    canvas.height = img.naturalHeight * zoom;
    ctx.scale(zoom, zoom);

    if (referencePoints.length > 0) {
      referencePoints.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.fillText(`R${index + 1}`, point.x + 12, point.y - 8);
      });
      if (referencePoints.length === 2) {
        ctx.beginPath();
        ctx.moveTo(referencePoints[0].x, referencePoints[0].y);
        ctx.lineTo(referencePoints[1].x, referencePoints[1].y);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }

    if (measurePoints.length > 0) {
      measurePoints.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.fillText(`M${index + 1}`, point.x + 12, point.y - 8);
      });
      if (measurePoints.length === 2) {
        ctx.beginPath();
        ctx.moveTo(measurePoints[0].x, measurePoints[0].y);
        ctx.lineTo(measurePoints[1].x, measurePoints[1].y);
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3;
        ctx.stroke();
        if (calculatedDistance !== null) {
          const midX = (measurePoints[0].x + measurePoints[1].x) / 2;
          const midY = (measurePoints[0].y + measurePoints[1].y) / 2;
          ctx.fillStyle = "#22c55e";
          ctx.font = "bold 18px Arial";
          ctx.fillText(
            `${calculatedDistance.toFixed(1)} cm`,
            midX + 10,
            midY - 10
          );
        }
      }
    }
  }, [referencePoints, measurePoints, calculatedDistance, imageLoaded, zoom]);

  const handleCanvasClick = (event) => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = ((event.clientX - rect.left) * scaleX) / zoom;
    const y = ((event.clientY - rect.top) * scaleY) / zoom;

    if (mode === "reference") {
      if (referencePoints.length < 2) {
        const newPoints = [...referencePoints, { x, y }];
        setReferencePoints(newPoints);
      } else {
        setReferencePoints([{ x, y }]);
        setScaleFactor(null);
        setCalculatedDistance(null);
      }
    } else if (mode === "measure") {
      if (measurePoints.length < 2) {
        const newPoints = [...measurePoints, { x, y }];
        setMeasurePoints(newPoints);
        if (newPoints.length === 2 && scaleFactor) {
          const pixelDistance = calculateDistance(newPoints[0], newPoints[1]);
          const realDistance = pixelDistance * scaleFactor;
          setCalculatedDistance(realDistance);
        }
      } else {
        setMeasurePoints([{ x, y }]);
        setCalculatedDistance(null);
      }
    }
  };

  const setReferenceScale = () => {
    if (
      referencePoints.length === 2 &&
      referenceDistance &&
      referenceDistance.trim() !== ""
    ) {
      const pixelDistance = calculateDistance(
        referencePoints[0],
        referencePoints[1]
      );
      const referenceDistanceNum = parseFloat(referenceDistance);
      const scale = referenceDistanceNum / pixelDistance;
      setScaleFactor(scale);
    }
  };

  const resetAll = () => {
    setReferencePoints([]);
    setMeasurePoints([]);
    setScaleFactor(null);
    setCalculatedDistance(null);
    setReferenceDistance("");
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.1));

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    console.log("scaleFactor state changed to:", scaleFactor);
  }, [scaleFactor]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Header />
          <UploadSection handleImageUpload={handleImageUpload} />
          {uploadedImage && (
            <>
              <ControlsPanel
                mode={mode}
                setMode={setMode}
                referenceDistance={referenceDistance}
                setReferenceDistance={setReferenceDistance}
                setReferenceScale={setReferenceScale}
                referencePoints={referencePoints}
                resetAll={resetAll}
                scaleFactor={scaleFactor}
                calculatedDistance={calculatedDistance}
                zoom={zoom}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
              />
              <Instructions />
              <CanvasDisplay
                uploadedImage={uploadedImage}
                imageRef={imageRef}
                canvasRef={canvasRef}
                imageLoaded={imageLoaded}
                handleCanvasClick={handleCanvasClick}
                handleImageLoad={handleImageLoad}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
