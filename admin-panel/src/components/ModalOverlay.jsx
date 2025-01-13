import React from "react";
import "../styles/ModalOverlay.css"; // Import file CSS

const ModalOverlay = ({ onClose }) => {
  return (
    <div
      className="modal-overlay fixed inset-0 bg-grey bg-opacity-50 backdrop-blur-sm z-40"
      onClick={onClose}
    ></div>
  );
};

export default ModalOverlay;
