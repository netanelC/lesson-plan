import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "אישור",
  cancelText = "ביטול",
  isDestructive = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/40 backdrop-blur-sm transition-opacity">
      <div
        className="relative mx-auto w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-2xl transition-all duration-300 scale-100 opacity-100"
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full p-2"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 text-lg">{message}</p>
        </div>

        <div className="flex flex-row-reverse gap-3 mt-6">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2.5 rounded-xl text-white font-medium shadow-sm transition-all duration-200 active:scale-95 ${
              isDestructive
                ? "bg-rose-500 hover:bg-rose-600 hover:shadow-rose-500/25"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/25"
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-all duration-200 active:scale-95"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
