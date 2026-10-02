import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { userAPI } from '../services/api';
import {
  LayoutGrid,
  Upload,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Activity,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_predictions: 0,
    skin_predictions: 0,
    non_skin_predictions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await userAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 min-w-0">

        {/* Navbar */}
        <Navbar />

        <main className="px-5 py-6 md:px-8 lg:px-10">
          <div className="max-w-7xl mx-auto">

            {/* =========================
                HEADER
            ========================== */}
            <div className="mb-8">

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                      <Activity className="w-3.5 h-3.5" />
                      AI HEALTH ANALYSIS
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Welcome back,{' '}
                    <span className="text-primary">
                      {user.name || 'User'}
                    </span>
                  </h1>

                  <p className="mt-2 text-gray-500 max-w-2xl">
                    Analyze skin images using our two-stage AI classification
                    pipeline and keep track of your analysis activity.
                  </p>
                </div>

                {/* Quick Analyze */}
                <Link
                  to="/analyze"
                  className="inline-flex items-center justify-center gap-2
                  px-5 py-3 bg-primary text-white rounded-xl
                  font-semibold shadow-sm hover:shadow-md
                  hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Upload className="w-4 h-4" />
                  New Analysis
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>
            </div>


            {loading ? (

              /* =========================
                  LOADING
              ========================== */
              <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
                <div className="inline-flex items-center justify-center
                  w-12 h-12 rounded-full bg-red-50 mb-4">
                  <div className="animate-spin rounded-full h-6 w-6
                    border-2 border-gray-200 border-t-primary">
                  </div>
                </div>

                <p className="text-gray-500 text-sm">
                  Loading your analysis statistics...
                </p>
              </div>

            ) : (

              <>

                {/* =========================
                    STATISTICS
                ========================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">

                  {/* Total */}
                  <div className="group bg-white border border-gray-100
                    rounded-2xl p-6 shadow-sm
                    hover:shadow-md hover:-translate-y-1
                    transition-all duration-200">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Total Analyses
                        </p>

                        <h3 className="text-3xl font-bold text-gray-900">
                          {stats.total_predictions}
                        </h3>

                        <p className="text-xs text-gray-400 mt-2">
                          Images analyzed
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-xl
                        bg-red-50 flex items-center justify-center
                        group-hover:bg-red-100 transition-colors">

                        <LayoutGrid className="w-6 h-6 text-primary" />

                      </div>
                    </div>

                    <div className="mt-5 h-1 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full w-full bg-primary rounded-full" />
                    </div>

                  </div>


                  {/* Skin Images */}
                  <div className="group bg-white border border-gray-100
                    rounded-2xl p-6 shadow-sm
                    hover:shadow-md hover:-translate-y-1
                    transition-all duration-200">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Skin Images
                        </p>

                        <h3 className="text-3xl font-bold text-gray-900">
                          {stats.skin_predictions}
                        </h3>

                        <p className="text-xs text-gray-400 mt-2">
                          Identified as skin
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-xl
                        bg-emerald-50 flex items-center justify-center
                        group-hover:bg-emerald-100 transition-colors">

                        <TrendingUp className="w-6 h-6 text-emerald-600" />

                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-gray-500">
                        Suitable for further analysis
                      </span>
                    </div>

                  </div>


                  {/* Non Skin */}
                  <div className="group bg-white border border-gray-100
                    rounded-2xl p-6 shadow-sm
                    hover:shadow-md hover:-translate-y-1
                    transition-all duration-200">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Non-Skin Images
                        </p>

                        <h3 className="text-3xl font-bold text-gray-900">
                          {stats.non_skin_predictions}
                        </h3>

                        <p className="text-xs text-gray-400 mt-2">
                          Images rejected by screening
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-xl
                        bg-amber-50 flex items-center justify-center
                        group-hover:bg-amber-100 transition-colors">

                        <AlertCircle className="w-6 h-6 text-amber-600" />

                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-gray-500">
                        Requires a suitable skin image
                      </span>
                    </div>

                  </div>

                </div>


                {/* =========================
                    MAIN ANALYSIS CARD
                ========================== */}
                <div className="relative overflow-hidden rounded-3xl
                  bg-gradient-to-br from-primary via-primary to-red-700
                  p-7 md:p-10 text-white shadow-lg mb-8">

                  {/* Decorative circles */}
                  <div className="absolute -right-20 -top-20
                    w-72 h-72 rounded-full
                    bg-white/10 blur-2xl" />

                  <div className="absolute -left-20 -bottom-28
                    w-64 h-64 rounded-full
                    bg-white/10 blur-2xl" />

                  <div className="relative z-10">

                    <div className="flex flex-col lg:flex-row
                      lg:items-center lg:justify-between gap-8">

                      <div className="max-w-2xl">

                        <div className="inline-flex items-center gap-2
                          px-3 py-1.5 rounded-full
                          bg-white/15 border border-white/20
                          text-xs font-medium mb-5">

                          <Sparkles className="w-3.5 h-3.5" />
                          AI-Powered Analysis

                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                          Start a New Skin Analysis
                        </h2>

                        <p className="text-white/80 leading-relaxed">
                          Upload a clear skin image and let the AI pipeline
                          first verify whether it is a skin image, then
                          classify the detected lesion.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-6">

                          <div className="flex items-center gap-2
                            px-3 py-2 rounded-lg bg-white/10
                            border border-white/10 text-sm">

                            <span className="w-2 h-2 rounded-full bg-white" />
                            Image Screening

                          </div>

                          <div className="flex items-center gap-2
                            px-3 py-2 rounded-lg bg-white/10
                            border border-white/10 text-sm">

                            <span className="w-2 h-2 rounded-full bg-white" />
                            AI Classification

                          </div>

                        </div>

                      </div>


                      {/* Upload Illustration */}
                      <div className="flex flex-col items-center
                        justify-center min-w-[220px]">

                        <div className="w-28 h-28 rounded-3xl
                          bg-white/10 border border-white/20
                          flex items-center justify-center mb-5">

                          <Upload className="w-12 h-12 text-white" />

                        </div>

                        <Link
                          to="/analyze"
                          className="inline-flex items-center gap-2
                          px-6 py-3.5 bg-white text-primary
                          rounded-xl font-semibold
                          shadow-md hover:bg-gray-50
                          hover:shadow-lg transition-all duration-200"
                        >
                          Analyze Image
                          <ArrowRight className="w-5 h-5" />
                        </Link>

                      </div>

                    </div>

                  </div>
                </div>


                {/* =========================
                    HOW IT WORKS
                ========================== */}
                <div className="bg-white border border-gray-100
                  rounded-2xl p-6 md:p-8 shadow-sm">

                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      How the Analysis Works
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      A simple two-stage AI workflow
                    </p>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Step 1 */}
                    <div className="flex gap-4 p-5 rounded-xl
                      bg-gray-50 border border-gray-100">

                      <div className="flex-shrink-0 w-10 h-10
                        rounded-xl bg-red-100 text-primary
                        flex items-center justify-center
                        font-bold">
                        01
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Skin Image Screening
                        </h3>

                        <p className="text-sm text-gray-500 leading-relaxed">
                          The first AI stage checks whether the uploaded
                          image contains a suitable skin lesion.
                        </p>
                      </div>

                    </div>


                    {/* Step 2 */}
                    <div className="flex gap-4 p-5 rounded-xl
                      bg-gray-50 border border-gray-100">

                      <div className="flex-shrink-0 w-10 h-10
                        rounded-xl bg-red-100 text-primary
                        flex items-center justify-center
                        font-bold">
                        02
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Lesion Classification
                        </h3>

                        <p className="text-sm text-gray-500 leading-relaxed">
                          Suitable skin images are passed to the second
                          stage for AI-based lesion classification.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Disclaimer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                  This AI analysis is intended for informational purposes
                  and should not replace professional medical advice.
                </p>

              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;