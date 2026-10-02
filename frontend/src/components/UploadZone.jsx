import { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

const UploadZone = ({ onFileSelect, selectedFile, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      onFileSelect(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && isValidFile(file)) {
      onFileSelect(file);
    }
  };

  const isValidFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  };

  if (selectedFile) {
    return (
      <div className="relative">
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="w-full h-64 object-contain rounded-lg border border-gray-200"
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging
          ? 'border-primary bg-primary-light'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <UploadCloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <p className="text-lg font-medium text-gray-700 mb-2">
        Drag and drop your image here
      </p>
      <p className="text-gray-500 mb-4">or</p>
      <label className="inline-block px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-dark transition-colors">
        Browse Image
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>
      <p className="text-sm text-gray-500 mt-4">
        Supported: JPG, JPEG, PNG, WEBP
      </p>
    </div>
  );
};

export default UploadZone;
