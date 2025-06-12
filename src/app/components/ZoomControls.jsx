import { useMeasurement } from "../context/MeasurementContext";

export default function ZoomControls() {
  const { zoom, zoomIn, zoomOut } = useMeasurement();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Zoom
      </label>
      <div className="flex space-x-2">
        <button
          onClick={zoomOut}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          −
        </button>
        <span className="px-1 py-1 text-sm font-medium text-gray-800 min-w-[60px] text-center">
          {zoom.toFixed(1)}x
        </span>
        <button
          onClick={zoomIn}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>
    </div>
  );
}
