import React from "react";

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ loading, onCancel }) => {
  return (
    <div className="flex justify-end space-x-3 mt-6">
      <button
        type="button"
        onClick={onCancel}
        className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
      >
        Avbryt
      </button>
      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Lagrer..." : "Lagre"}
      </button>
    </div>
  );
};

export default FormActions;
