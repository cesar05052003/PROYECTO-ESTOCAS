import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, isOpen, onClose, title, children, size = "md", footer }) {
  const visible = open || isOpen;

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      console.log("Modal abierto:", title);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible, title]);

  if (!visible) return null;

  const widths = { sm: 420, md: 600, lg: 800, xl: 1000 };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl flex flex-col max-h-[90vh] w-full"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxWidth: widths[size] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
