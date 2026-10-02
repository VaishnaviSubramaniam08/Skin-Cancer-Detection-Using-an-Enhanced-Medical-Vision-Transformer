import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UploadZone from '../components/UploadZone';
import { predictionsAPI } from '../services/api';
import { Loader2, AlertCircle } from 'lucide-react';

const Analyze = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError('');
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const result = await predictionsAPI.predict(selectedFile);
      navigate(`/results/${result.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyze Skin Image</h1>
            <p className="text-gray-600 mb-8">
              Upload an image to begin the two-stage AI classification pipeline.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <UploadZone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onRemove={handleRemove}
              />

              {selectedFile && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Image'
                    )}
                  </button>
                  <button
                    onClick={handleRemove}
                    disabled={analyzing}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Analysis Steps Info */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Analysis Pipeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Image Preprocessing</p>
                    <p className="text-sm text-gray-600">Resize and normalize image</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Skin Detection</p>
                    <p className="text-sm text-gray-600">Stage 1: ViT-B/16 Skin/Non-Skin classification</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Skin Lesion Classification</p>
                    <p className="text-sm text-gray-600">
                      Stage 2: ViT-B/16 ISIC-2019 classification (if skin detected)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">AI Explainability</p>
                    <p className="text-sm text-gray-600">Grad-CAM visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analyze;
