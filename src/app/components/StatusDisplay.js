import { useMeasurement } from "../context/MeasurementContext";

export default function StatusDisplay() {
  const {
    referencePoints,
    scaleFactor,
    calculatedDistance,
    totalDistance,
    measuredDistances,
    setMeasuredDistances,
  } = useMeasurement();

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div>
        <span className="font-medium text-red-600">Reference Points:</span>{" "}
        <span className="font-medium text-black">
          {referencePoints.length}/2
        </span>
      </div>
      <div>
        <span className="font-medium text-blue-600">Scale Factor:</span>{" "}
        <span className="font-medium text-black">
          {scaleFactor ? "Set" : "Not set"}
        </span>
      </div>
      <div>
        <span className="font-medium text-green-600">Last Measurement:</span>{" "}
        <span className="font-medium text-black">
          {calculatedDistance !== null
            ? `${calculatedDistance.toFixed(1)} cm`
            : "None"}
        </span>
      </div>
      {measuredDistances.length > 0 && (
        <div>
          <span className="font-medium text-green-600">Total</span>{" "}
          <span className="font-medium text-black">
            {totalDistance.toFixed(2)} cm
          </span>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 ml-4"
            onClick={() => {
              setMeasuredDistances([0]);
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
