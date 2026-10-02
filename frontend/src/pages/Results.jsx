import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ConfidenceBar from '../components/ConfidenceBar';
import ProbabilityChart from '../components/ProbabilityChart';
import GradCAMViewer from '../components/GradCAMViewer';
import { predictionsAPI } from '../services/api';
import { Loader2, ArrowRight, Download, AlertCircle } from 'lucide-react';

const Results = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const data = await predictionsAPI.getPrediction(id);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-screen bg-white items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700">{error || 'Result not found'}</p>
          <Link to="/dashboard" className="text-primary mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Analysis Results</h1>

            {/* Uploaded Image */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Image</h2>
              <img
                src={`http://localhost:8000${result.image_path}`}
                alt="Analyzed Image"
                className="w-full max-w-md h-auto rounded-lg"
              />
            </div>

            {/* Stage 1 Results */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Stage 1 — Skin Screening
              </h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Prediction</p>
                <p className="text-2xl font-bold text-primary">{result.stage1_class}</p>
              </div>
              <ConfidenceBar
                confidence={result.stage1_confidence}
                label="Confidence"
              />
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Probability Distribution</h3>
                <ProbabilityChart probabilities={result.stage1_probabilities} />
              </div>
            </div>

            {/* Stage 2 Results */}
            {result.stage2_executed ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Stage 2 — Skin Lesion Classification
                </h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Predicted Class</p>
                  <p className="text-2xl font-bold text-primary">{result.stage2_class}</p>
                </div>
                <ConfidenceBar
                  confidence={result.stage2_confidence}
                  label="Confidence"
                />
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Probability Distribution</h3>
                  <ProbabilityChart probabilities={result.stage2_probabilities} />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Stage 2 — Skin Lesion Classification
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <AlertCircle className="w-5 h-5" />
                  <p>
                    The uploaded image was classified as non-skin, so skin lesion 
                    classification was not performed.
                  </p>
                </div>
              </div>
            )}

            {/* Grad-CAM Explanation */}
            {result.gradcam_path && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
                <GradCAMViewer
                  originalUrl={result.image_path}
                  heatmapUrl={result.gradcam_path.replace('overlay', 'heatmap')}
                  overlayUrl={result.gradcam_path}
                />
              </div>
            )}

            {/* Final Result Card */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-8 text-white mb-6">
              <h2 className="text-2xl font-bold mb-4">AI Classification Result</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-90">Stage 1:</span>
                  <span className="font-semibold">{result.stage1_class}</span>
                </div>
                {result.stage2_executed && (
                  <>
                    <div className="flex justify-between">
                      <span className="opacity-90">Stage 2:</span>
                      <span className="font-semibold">{result.stage2_class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Confidence:</span>
                      <span className="font-semibold">
                        {(result.stage2_confidence * 100).toFixed(2)}%
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => navigate('/analyze')}
                  className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Analyze Another Image
                </button>
                <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Disclaimer:</strong> This is an AI classification result, not a medical 
                diagnosis. Always consult a healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Results;
