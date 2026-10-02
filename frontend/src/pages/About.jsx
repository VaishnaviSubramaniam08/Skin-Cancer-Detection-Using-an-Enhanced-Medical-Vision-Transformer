import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Brain, Eye, BarChart3, AlertCircle, ArrowDown } from 'lucide-react';

const About = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              About the AI Skin Classification System
            </h1>

            {/* Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
              <p className="text-gray-600 mb-4">
                This system uses a two-stage deep learning architecture for skin image screening 
                and lesion classification. The pipeline combines Vision Transformer (ViT) models 
                with explainable AI techniques to provide transparent predictions.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> This is an academic/research AI classification system. 
                    The results should not be interpreted as confirmed medical diagnoses. Always consult 
                    a healthcare professional for medical advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Stage 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Stage 1: Skin Detection</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Model: ViT-B/16</p>
                    <p className="text-gray-600 text-sm">
                      Vision Transformer Base architecture with 16x16 patch size
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Task: Skin vs Non-Skin Classification</p>
                    <p className="text-gray-600 text-sm">
                      Determines if the uploaded image contains skin tissue
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Classes: NON_SKIN, SKIN</p>
                    <p className="text-gray-600 text-sm">
                      Binary classification with confidence scores
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Stage 2: Skin Lesion Classification</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Model: ViT-B/16</p>
                    <p className="text-gray-600 text-sm">
                      Vision Transformer Base architecture with 16x16 patch size
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Task: ISIC-2019 Classification</p>
                    <p className="text-gray-600 text-sm">
                      Multi-class classification of skin lesion types
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Classes: MEL, NV, BCC, AK, BKL, DF, VASC, SCC
                    </p>
                    <p className="text-gray-600 text-sm">
                      8-class classification based on ISIC-2019 dataset
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Two Stages */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Why Two Stages?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-gray-800">Stage 1 Filtering</p>
                    <p className="text-gray-600 text-sm">
                      Prevents non-skin images from being passed directly into the skin lesion 
                      classifier, improving accuracy and reducing false positives.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-gray-800">Specialized Models</p>
                    <p className="text-gray-600 text-sm">
                      Each stage is optimized for its specific task, allowing for better performance 
                      than a single multi-task model.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-gray-800">Efficient Resource Usage</p>
                    <p className="text-gray-600 text-sm">
                      Stage 2 is only executed when necessary, saving computational resources for 
                      non-skin images.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Diagram */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Complete Pipeline
              </h2>
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 w-64 text-center">
                  <p className="font-medium text-gray-800">Input Image</p>
                </div>
                <ArrowDown className="w-6 h-6 text-primary" />
                <div className="bg-primary-light border border-primary rounded-lg p-4 w-64 text-center">
                  <p className="font-medium text-gray-800">Stage 1: ViT-B/16</p>
                  <p className="text-sm text-gray-600">Skin / Non-Skin</p>
                </div>
                <ArrowDown className="w-6 h-6 text-primary" />
                <div className="bg-white border border-gray-200 rounded-lg p-4 w-64 text-center">
                  <p className="font-medium text-gray-800">If Skin → Continue</p>
                  <p className="text-sm text-gray-600">If Non-Skin → Stop</p>
                </div>
                <ArrowDown className="w-6 h-6 text-primary" />
                <div className="bg-primary-light border border-primary rounded-lg p-4 w-64 text-center">
                  <p className="font-medium text-gray-800">Stage 2: ViT-B/16</p>
                  <p className="text-sm text-gray-600">ISIC-2019 Classification</p>
                </div>
                <ArrowDown className="w-6 h-6 text-primary" />
                <div className="bg-primary-light border border-primary rounded-lg p-4 w-64 text-center">
                  <p className="font-medium text-gray-800">AI Explainability</p>
                  <p className="text-sm text-gray-600">Grad-CAM Visualization</p>
                </div>
                <ArrowDown className="w-6 h-6 text-primary" />
                <div className="bg-white border border-gray-200 rounded-lg p-4 w-64 text-center">
                  <p className="font-medium text-gray-800">Final Result</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
