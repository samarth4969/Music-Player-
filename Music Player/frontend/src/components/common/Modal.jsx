import React from "react";
import "../../css/common/Modal.css";

const Modal = ({ children, onClose }) => {
  return (
    <div
      className="modal-backdrop"   // ✅ FIXED NAME
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative" }}
      >
        <button
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          Cancel
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
