import { useMeasurement } from "../context/MeasurementContext";

export default function UploadSection() {
  const { handleImageUpload } = useMeasurement();

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Floor Plan Image (JPG/PNG)
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
}
