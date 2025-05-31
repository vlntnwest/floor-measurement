export default function StatusDisplay({
  referencePoints,
  scaleFactor,
  calculatedDistance,
}) {
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
    </div>
  );
}
