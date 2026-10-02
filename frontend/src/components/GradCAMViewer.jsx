const GradCAMViewer = ({ originalUrl, heatmapUrl, overlayUrl }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">AI Explainability</h3>
      <p className="text-gray-600">
        Visualization of image regions contributing to the model prediction.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <img
            src={`http://localhost:8000${originalUrl}`}
            alt="Original"
            className="w-full h-48 object-contain rounded-lg border border-gray-200"
          />
          <p className="mt-2 text-sm font-medium text-gray-700">Original</p>
        </div>
        
        <div className="text-center">
          <img
            src={`http://localhost:8000${heatmapUrl}`}
            alt="AI Attention"
            className="w-full h-48 object-contain rounded-lg border border-gray-200"
          />
          <p className="mt-2 text-sm font-medium text-gray-700">AI Attention</p>
        </div>
        
        <div className="text-center">
          <img
            src={`http://localhost:8000${overlayUrl}`}
            alt="Overlay"
            className="w-full h-48 object-contain rounded-lg border border-gray-200"
          />
          <p className="mt-2 text-sm font-medium text-gray-700">Overlay</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <div className="flex-1 h-2 bg-gradient-to-r from-red-200 to-red-600 rounded-full" />
        <span className="text-sm text-gray-600">Low Attention</span>
        <span className="text-sm text-gray-600">High Attention</span>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800">
          <strong>Interpretation:</strong> The highlighted regions represent areas that 
          contributed to the model's prediction. This visualization is an AI explanation 
          and should not be interpreted as a medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default GradCAMViewer;
