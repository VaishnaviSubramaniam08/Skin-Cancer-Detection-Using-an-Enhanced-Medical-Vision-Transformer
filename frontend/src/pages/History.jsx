import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { predictionsAPI } from '../services/api';
import { Loader2, Eye, Trash2, Search } from 'lucide-react';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const data = await predictionsAPI.getPredictions();
      setPredictions(data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prediction?')) {
      try {
        await predictionsAPI.deletePrediction(id);
        setPredictions(predictions.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting prediction:', error);
      }
    }
  };

  const filteredPredictions = predictions.filter((p) =>
    p.stage1_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.benign_malignant_class && p.benign_malignant_class.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.lesion_class && p.lesion_class.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Prediction History</h1>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search predictions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Predictions Table */}
            {filteredPredictions.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'No predictions match your search.' : 'No predictions yet.'}
                </p>
                {!searchTerm && (
                  <Link
                    to="/analyze"
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  >
                    Analyze Your First Image
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Image
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Stage 1 Result
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Stage 1 Confidence
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Malignancy
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Lesion Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPredictions.map((prediction) => (
                        <tr key={prediction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {formatDate(prediction.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <img
                              src={`http://localhost:8000${prediction.image_path}`}
                              alt="Thumbnail"
                              className="w-16 h-16 object-cover rounded border border-gray-200"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                prediction.stage1_class === 'SKIN'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {prediction.stage1_class}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {(prediction.stage1_confidence * 100).toFixed(2)}%
                          </td>
                          <td className="px-6 py-4">
                            {prediction.benign_malignant_executed ? (
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  prediction.benign_malignant_class === 'Malignant'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {prediction.benign_malignant_class}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Not Executed</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {prediction.lesion_executed ? (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
                                {prediction.lesion_class}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Not Executed</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Link
                                to={`/results/${prediction.id}`}
                                className="p-2 text-primary hover:bg-primary-light rounded-lg transition-colors"
                                title="View Result"
                              >
                                <Eye className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleDelete(prediction.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default History;
