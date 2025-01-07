import React from "react";

const ModalConfirm = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null; // Không hiển thị nếu show là false

  return (
    <>
      {/* Overlay mờ */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalConfirm;
