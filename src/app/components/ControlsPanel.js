import StatusDisplay from "./StatusDisplay";

export default function ControlsPanel({
  mode,
  setMode,
  referenceDistance,
  setReferenceDistance,
  setReferenceScale,
  referencePoints,
  resetAll,
  scaleFactor,
  calculatedDistance,
}) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Mode
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setMode("reference")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                mode === "reference"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Set Reference
            </button>
            <button
              onClick={() => setMode("measure")}
              disabled={!scaleFactor}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                mode === "measure" && scaleFactor
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Measure
            </button>
          </div>
        </div>

        {/* Reference Distance Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference Distance (cm)
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={referenceDistance}
              onChange={(e) => setReferenceDistance(e.target.value)}
              placeholder="Enter distance in cm"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-black"
              disabled={referencePoints.length !== 2}
            />
            <button
              type="button"
              onClick={setReferenceScale}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
            >
              Set Scale
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actions
          </label>
          <button
            onClick={resetAll}
            className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600"
          >
            Reset All
          </button>
        </div>
      </div>

      <StatusDisplay
        referencePoints={referencePoints}
        scaleFactor={scaleFactor}
        calculatedDistance={calculatedDistance}
      />
    </div>
  );
}
