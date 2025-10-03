import React from "react";

export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  busy = false,
}) {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      if (!busy) onCancel?.();
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] transition-opacity duration-300"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="max-w-md w-[90vw] bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-200 ease-out">
        <div className="py-3 px-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        <div className="p-4">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 justify-end py-3 px-4">
          <button
            className="px-4 py-2 rounded-lg font-semibold cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed bg-gray-100 text-gray-800 hover:bg-gray-200"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelText}
          </button>

          <button
            className="px-4 py-2 rounded-lg font-semibold cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
