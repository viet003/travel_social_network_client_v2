import { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { TravelButton } from '../../ui/customize';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, type: string) => Promise<void>;
  type?: "avatar" | "cover";
  title?: string;
  currentImage?: string | null;
  isUploading?: boolean;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type = "avatar",
  title = "Tải ảnh lên",
  currentImage = null,
  isUploading = false 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Tệp quá lớn! Vui lòng chọn tệp nhỏ hơn 10MB.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn tệp hình ảnh!');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Vui lòng chọn ảnh!');
      return;
    }

    try {
      await onSubmit(selectedFile, type);
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ease-in-out bg-black/50"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-white shadow-lg transition-all duration-300 ease-in-out rounded-xl overflow-hidden max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col items-start">
            <span className="flex items-center mb-2 text-xl font-bold text-blue-600">
              <Icon icon="mdi:compass" className="text-blue-600 w-7 h-7" />
              TravelNest
            </span>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">
              {type === "avatar" ? "Cập nhật ảnh đại diện của bạn" : "Cập nhật ảnh bìa của bạn"}
            </p>
          </div>
          <button
            className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-6 top-6 hover:bg-gray-300 cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Image Display */}
          {currentImage && !preview && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Ảnh hiện tại</label>
              <div className="relative overflow-hidden border border-gray-200 rounded-lg">
                <img
                  src={currentImage}
                  alt="Current"
                  className={`object-cover w-full ${
                    type === "avatar" ? "h-40" : "h-48"
                  } ${type === "avatar" ? "rounded-full mx-auto w-40" : ""}`}
                />
              </div>
            </div>
          )}

          {/* Image Upload Area */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Chọn ảnh mới <span className="text-red-500">*</span>
            </label>
            
            {preview ? (
              <div className="relative overflow-hidden border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="absolute z-10 p-1 text-white transition-colors bg-red-500 rounded-full top-2 right-2 hover:bg-red-600 cursor-pointer"
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                </button>
                <img
                  src={preview}
                  alt="Preview"
                  className={`object-cover w-full ${
                    type === "avatar" ? "h-40 rounded-full mx-auto w-40" : "h-48"
                  }`}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                  <div className="flex flex-col items-center py-8">
                    {type === "avatar" ? (
                      <Icon icon="lucide:camera" className="w-12 h-12 mb-4 text-gray-400" />
                    ) : (
                      <Icon icon="lucide:upload" className="w-12 h-12 mb-4 text-gray-400" />
                    )}
                    <span className="mb-2 text-sm font-medium text-gray-600">
                      {type === "avatar" ? "Tải lên ảnh đại diện" : "Tải lên ảnh bìa"}
                    </span>
                    <span className="text-xs text-center text-gray-500">
                      Nhấn để duyệt hoặc kéo thả<br />
                      {type === "avatar" ? "Khuyến nghị tỷ lệ vuông" : "Khuyến nghị tỷ lệ 16:9"} • Tối đa 10MB
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Image Requirements */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="mb-2 text-sm font-medium text-blue-800">Yêu cầu về ảnh:</h4>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• Định dạng hỗ trợ: JPG, PNG, GIF</li>
              <li>• Kích thước tối đa: 10MB</li>
              <li>• {type === "avatar" ? "Ảnh vuông hiệu quả nhất (tỷ lệ 1:1)" : "Ảnh ngang hiệu quả nhất (tỷ lệ 16:9)"}</li>
              <li>• Độ phân giải cao được khuyến nghị</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <TravelButton
                type="default"
                htmlType="button"
                onClick={handleClose}
                disabled={isUploading}
                className="px-6"
              >
                Hủy
              </TravelButton>
              <TravelButton
                type="default"
                htmlType="submit"
                disabled={isUploading || !selectedFile}
                loading={isUploading}
                className="px-6"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:check" className="w-4 h-4" />
                  Tải ảnh lên
                </div>
              </TravelButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadModal;
