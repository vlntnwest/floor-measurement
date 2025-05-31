export default function Instructions() {
  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
      <strong>Instructions:</strong>
      <ol className="list-decimal list-inside mt-1 space-y-1">
        <li>
          Set Reference Mode and click 2 points on the plan with a known
          distance
        </li>
        <li>Enter the real distance in centimeters and click "Set Scale"</li>
        <li>
          Switch to Measure Mode and click any 2 points to get their distance
        </li>
      </ol>
    </div>
  );
}
