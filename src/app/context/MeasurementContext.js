"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

const MeasurementContext = createContext();

export function useMeasurement() {
  return useContext(MeasurementContext);
}

export function MeasurementProvider({ children }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mode, setMode] = useState("reference");
  const [referencePoints, setReferencePoints] = useState([]);
  const [referenceDistance, setReferenceDistance] = useState("");
  const [measurePoints, setMeasurePoints] = useState([]);
  const [scaleFactor, setScaleFactor] = useState(null);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [measuredDistances, setMeasuredDistances] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [surfacePoints, setSurfacePoints] = useState([]);
  const [polygonClosed, setPolygonClosed] = useState(false);
  const [polygonArea, setPolygonArea] = useState("");

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
        setMeasuredDistances([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
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

    // Reset canvas
    canvas.width = img.naturalWidth * zoom;
    canvas.height = img.naturalHeight * zoom;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scaling
    ctx.scale(zoom, zoom);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // --- Reference points ---
    if (mode === "reference") {
      referencePoints.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      if (referencePoints.length === 2) {
        ctx.beginPath();
        ctx.moveTo(referencePoints[0].x, referencePoints[0].y);
        ctx.lineTo(referencePoints[1].x, referencePoints[1].y);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // --- Measure points ---
    if (mode === "distance") {
      measurePoints.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      if (measurePoints.length === 2 && calculatedDistance !== null) {
        ctx.beginPath();
        ctx.moveTo(measurePoints[0].x, measurePoints[0].y);
        ctx.lineTo(measurePoints[1].x, measurePoints[1].y);
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 2;
        ctx.stroke();

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

    // --- Surface drawing ---
    if (mode === "surface" && surfacePoints.length > 0) {
      ctx.beginPath();
      ctx.moveTo(surfacePoints[0].x, surfacePoints[0].y);
      for (let i = 1; i < surfacePoints.length; i++) {
        ctx.lineTo(surfacePoints[i].x, surfacePoints[i].y);
      }

      if (polygonClosed) {
        ctx.closePath();
        ctx.fillStyle = "rgba(34,197,94,0.3)";
        ctx.fill();
      }

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();

      surfacePoints.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#10b981";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      if (polygonClosed && scaleFactor) {
        const areaPx = calculatePolygonArea(surfacePoints);
        const areaCm2 = areaPx * scaleFactor * scaleFactor;
        const areaM2 = areaCm2 / 10000;
        setPolygonArea(areaM2.toFixed(2));
        const cx =
          surfacePoints.reduce((sum, p) => sum + p.x, 0) / surfacePoints.length;
        const cy =
          surfacePoints.reduce((sum, p) => sum + p.y, 0) / surfacePoints.length;

        ctx.fillStyle = "#15803d";
        ctx.font = "bold 18px Arial";
        ctx.fillText(`${areaM2.toFixed(2)} m²`, cx, cy);
      }
    }
  }, [
    referencePoints,
    measurePoints,
    surfacePoints,
    calculatedDistance,
    polygonClosed,
    scaleFactor,
    imageLoaded,
    zoom,
    mode,
  ]);

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
        setReferencePoints([...referencePoints, { x, y }]);
      } else {
        setReferencePoints([{ x, y }]);
        setScaleFactor(null);
        setCalculatedDistance(null);
      }
    } else if (mode === "distance") {
      if (measurePoints.length < 2) {
        const newPoints = [...measurePoints, { x, y }];
        setMeasurePoints(newPoints);
        if (newPoints.length === 2 && scaleFactor) {
          const pixelDistance = calculateDistance(newPoints[0], newPoints[1]);
          const realDistance = pixelDistance * scaleFactor;
          setMeasuredDistances((prev) => [...prev, realDistance]);
          setCalculatedDistance(realDistance);
        }
      } else {
        setMeasurePoints([{ x, y }]);
        setCalculatedDistance(null);
      }
    } else if (mode === "surface") {
      if (polygonClosed) {
        setSurfacePoints([{ x, y }]);
        setPolygonClosed(false);
        return;
      }

      if (surfacePoints.length > 2) {
        const first = surfacePoints[0];
        const distanceToFirst = Math.hypot(first.x - x, first.y - y);
        if (distanceToFirst < 10) {
          setPolygonClosed(true);
          return;
        }
      }

      setSurfacePoints([...surfacePoints, { x, y }]);
    }
  };

  const calculatePolygonArea = (points) => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y - points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
  };

  const setReferenceScale = () => {
    if (referencePoints.length === 2 && referenceDistance.trim() !== "") {
      const pixelDistance = calculateDistance(
        referencePoints[0],
        referencePoints[1]
      );
      const refDist = parseFloat(referenceDistance);
      setScaleFactor(refDist / pixelDistance);
    }
  };

  const resetAll = () => {
    setReferencePoints([]);
    setMeasurePoints([]);
    setScaleFactor(null);
    setCalculatedDistance(null);
    setReferenceDistance("");
    setMeasuredDistances([]);
    setSurfacePoints([]);
    setPolygonClosed(false);
    setPolygonArea("");
    setMode("reference");
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.1));

  const totalDistance = measuredDistances.reduce((sum, d) => sum + d, 0);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (imageLoaded) drawCanvas();
  }, [imageLoaded]);

  return (
    <MeasurementContext.Provider
      value={{
        uploadedImage,
        setUploadedImage,
        imageLoaded,
        setImageLoaded,
        mode,
        setMode,
        referencePoints,
        setReferencePoints,
        referenceDistance,
        setReferenceDistance,
        measurePoints,
        setMeasurePoints,
        scaleFactor,
        setScaleFactor,
        calculatedDistance,
        setCalculatedDistance,
        measuredDistances,
        setMeasuredDistances,
        zoom,
        zoomIn,
        zoomOut,
        canvasRef,
        imageRef,
        handleImageUpload,
        handleImageLoad,
        handleCanvasClick,
        setReferenceScale,
        resetAll,
        totalDistance,
        surfacePoints,
        setSurfacePoints,
        polygonClosed,
        setPolygonClosed,
        polygonArea,
      }}
    >
      {children}
    </MeasurementContext.Provider>
  );
}
