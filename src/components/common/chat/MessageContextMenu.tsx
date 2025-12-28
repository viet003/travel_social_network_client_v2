import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

interface MessageContextMenuProps {
  x: number;
  y: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  x,
  y,
  onEdit,
  onDelete,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[140px]"
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
      >
        <Icon icon="lucide:edit-3" className="w-4 h-4 text-gray-600" />
        <span className="text-gray-700">Sửa</span>
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 transition-colors"
      >
        <Icon icon="lucide:trash-2" className="w-4 h-4 text-red-600" />
        <span className="text-red-600">Xóa</span>
      </button>
    </div>
  );
};

export default MessageContextMenu;
