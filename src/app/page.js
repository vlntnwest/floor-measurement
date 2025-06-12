"use client";
import { useMeasurement } from "./context/MeasurementContext";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import ControlsPanel from "./components/ControlsPanel";
import Instructions from "./components/Instructions";
import CanvasDisplay from "./components/CanvasDisplay";
import "./globals.css";

export default function App() {
  const { uploadedImage } = useMeasurement();
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Header />
          <UploadSection />
          {uploadedImage && (
            <>
              <ControlsPanel />
              <Instructions />
              <CanvasDisplay />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
