import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScoreCircle from '../components/ScoreCircle';
import GradCAMViewer from '../components/GradCAMViewer';
import { predictionsAPI } from '../services/api';
import {
  Loader2,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';

const Results = () => {
  const { id } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // ============================================================
  // FETCH RESULT
  // ============================================================

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const data = await predictionsAPI.getPrediction(id);

      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to load results'
      );
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // DOWNLOAD PDF REPORT
  // ============================================================

  const downloadReport = () => {

    if (!result) {
      return;
    }

    const doc = new jsPDF();

    // ----------------------------------------------------------
    // Confidence values
    // ----------------------------------------------------------

    const stage1Confidence = (
      result.stage1_confidence * 100
    ).toFixed(1);

    const stage2Confidence =
      result.benign_malignant_executed
        ? (
            result.benign_malignant_confidence * 100
          ).toFixed(1)
        : null;

    const stage3Confidence =
      result.lesion_executed
        ? (
            result.lesion_confidence * 100
          ).toFixed(1)
        : null;


    // ----------------------------------------------------------
    // HEADER
    // ----------------------------------------------------------

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);

    doc.text(
      'AI Skin Lesion Analysis Report',
      20,
      25
    );


    // Date

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      20,
      34
    );


    // Prediction ID

    doc.text(
      `Prediction ID: ${id}`,
      20,
      40
    );


    // Divider

    doc.line(
      20,
      46,
      190,
      46
    );


    // ----------------------------------------------------------
    // STAGE 1
    // ----------------------------------------------------------

    let currentY = 62;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);

    doc.text(
      'Stage 1 - Skin Screening',
      20,
      currentY
    );

    currentY += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    doc.text(
      `Classification: ${result.stage1_class}`,
      25,
      currentY
    );

    currentY += 8;

    doc.text(
      `Confidence: ${stage1Confidence}%`,
      25,
      currentY
    );


    // ----------------------------------------------------------
    // STAGE 2
    // ----------------------------------------------------------

    currentY += 25;

    if (result.benign_malignant_executed) {

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);

      doc.text(
        'Stage 2 - Malignancy Classification',
        20,
        currentY
      );

      currentY += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      doc.text(
        `Classification: ${result.benign_malignant_class}`,
        25,
        currentY
      );

      currentY += 8;

      doc.text(
        `Confidence: ${stage2Confidence}%`,
        25,
        currentY
      );

    } else {

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);

      doc.text(
        'Stage 2 - Malignancy Classification',
        20,
        currentY
      );

      currentY += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      doc.text(
        'Analysis skipped',
        25,
        currentY
      );
    }


    // ----------------------------------------------------------
    // STAGE 3
    // ----------------------------------------------------------

    currentY += 25;

    if (result.lesion_executed) {

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);

      doc.text(
        'Stage 3 - Lesion Classification',
        20,
        currentY
      );

      currentY += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      doc.text(
        `Lesion Type: ${result.lesion_class}`,
        25,
        currentY
      );

      currentY += 8;

      doc.text(
        `Confidence: ${stage3Confidence}%`,
        25,
        currentY
      );

    } else {

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);

      doc.text(
        'Stage 3 - Lesion Classification',
        20,
        currentY
      );

      currentY += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      doc.text(
        'Analysis skipped',
        25,
        currentY
      );
    }


    // ----------------------------------------------------------
    // FINAL RESULT
    // ----------------------------------------------------------

    currentY += 25;

    doc.line(
      20,
      currentY,
      190,
      currentY
    );

    currentY += 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);

    doc.text(
      'Final AI Classification',
      20,
      currentY
    );

    currentY += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    doc.text(
      `Skin Screening: ${result.stage1_class}`,
      25,
      currentY
    );

    currentY += 8;

    if (result.benign_malignant_executed) {

      doc.text(
        `Malignancy: ${result.benign_malignant_class}`,
        25,
        currentY
      );

      currentY += 8;
    }

    if (result.lesion_executed) {

      doc.text(
        `Lesion Type: ${result.lesion_class}`,
        25,
        currentY
      );

      currentY += 8;

      doc.text(
        `Lesion Confidence: ${stage3Confidence}%`,
        25,
        currentY
      );

      currentY += 8;
    }


    // ----------------------------------------------------------
    // DISCLAIMER
    // ----------------------------------------------------------

    currentY += 18;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);

    doc.text(
      'Disclaimer',
      20,
      currentY
    );

    currentY += 8;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);

    const disclaimerText =
      'This is an AI classification result, not a medical diagnosis. ' +
      'Always consult a qualified healthcare professional for medical advice.';

    const disclaimerLines =
      doc.splitTextToSize(
        disclaimerText,
        165
      );

    doc.text(
      disclaimerLines,
      20,
      currentY
    );


    // ----------------------------------------------------------
    // SAVE PDF
    // ----------------------------------------------------------

    doc.save(
      `skin-analysis-report-${id}.pdf`
    );
  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <div className="flex min-h-screen bg-white items-center justify-center">

        <Loader2
          className="w-8 h-8 animate-spin text-primary"
        />

      </div>
    );
  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error || !result) {

    return (
      <div className="flex min-h-screen bg-white items-center justify-center">

        <div className="text-center">

          <AlertCircle
            className="w-12 h-12 text-red-500 mx-auto mb-4"
          />

          <p className="text-gray-700">
            {error || 'Result not found'}
          </p>

          <Link
            to="/dashboard"
            className="text-primary mt-4 inline-block"
          >
            Return to Dashboard
          </Link>

        </div>

      </div>
    );
  }


  // ============================================================
  // MAIN UI
  // ============================================================

  return (

    <div className="flex min-h-screen bg-white">

      {/* ========================================================
          SIDEBAR
      ========================================================= */}

      <Sidebar />


      <div className="flex-1 min-w-0">

        {/* ======================================================
            NAVBAR
        ======================================================= */}

        <Navbar />


        <main className="px-6 py-8 md:px-10">

          <div className="max-w-6xl mx-auto">


            {/* ==================================================
                PAGE TITLE
            =================================================== */}

            <div className="text-center mb-8">

              <h1 className="text-3xl font-bold text-gray-900">
                Analysis Results
              </h1>

              <p className="text-gray-500 mt-2">
                AI-powered skin lesion analysis
              </p>

            </div>


            {/* ==================================================
                UPLOADED IMAGE
            =================================================== */}

            <section
              className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                p-6
                mb-10
              "
            >

              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                  text-center
                  mb-5
                "
              >
                Uploaded Image
              </h2>


              {/* Centered image */}

              <div
                className="
                  flex
                  justify-center
                  items-center
                  w-full
                "
              >

                <img
                  src={`http://localhost:8000${result.image_path}`}
                  alt="Analyzed Image"
                  className="
                    w-full
                    max-w-xl
                    h-auto
                    max-h-[420px]
                    object-contain
                    rounded-xl
                    border
                    border-gray-100
                  "
                />

              </div>

            </section>


            {/* ==================================================
                PREDICTION RESULTS
            =================================================== */}

            <section className="mb-10">


              {/* Heading */}

              <div className="text-center mb-7">

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                  "
                >
                  Prediction Results
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Classification confidence by analysis stage
                </p>

              </div>


              {/* =================================================
                  RESULT CARDS
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-6
                "
              >


                {/* ===============================================
                    STAGE 1
                ================================================ */}

                <div
                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    hover:shadow-md
                    transition-shadow
                    p-6
                    flex
                    flex-col
                    items-center
                    text-center
                  "
                >

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-gray-500
                      uppercase
                      tracking-wider
                      mb-5
                    "
                  >
                    Stage 1
                  </p>


                  {/* Existing ScoreCircle */}

                  <ScoreCircle
                    score={result.stage1_confidence}
                    label={result.stage1_class}
                    color={
                      result.stage1_class === 'SKIN'
                        ? '#10b981'
                        : '#6b7280'
                    }
                  />


                  {/* Confidence */}

                  <div className="mt-5">

                    <p
                      className="
                        text-2xl
                        font-bold
                        text-gray-900
                      "
                    >
                      {(result.stage1_confidence * 100).toFixed(1)}%
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Skin Screening Confidence
                    </p>

                  </div>

                </div>


                {/* ===============================================
                    STAGE 2
                ================================================ */}

                {result.benign_malignant_executed ? (

                  <div
                    className="
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      shadow-sm
                      hover:shadow-md
                      transition-shadow
                      p-6
                      flex
                      flex-col
                      items-center
                      text-center
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                        tracking-wider
                        mb-5
                      "
                    >
                      Stage 2
                    </p>


                    {/* Existing ScoreCircle */}

                    <ScoreCircle
                      score={result.benign_malignant_confidence}
                      label={result.benign_malignant_class}
                      color={
                        result.benign_malignant_class === 'Malignant'
                          ? '#ef4444'
                          : '#10b981'
                      }
                    />


                    {/* Confidence */}

                    <div className="mt-5">

                      <p
                        className="
                          text-2xl
                          font-bold
                          text-gray-900
                        "
                      >
                        {(result.benign_malignant_confidence * 100).toFixed(1)}%
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Malignancy Confidence
                      </p>

                    </div>

                  </div>

                ) : (

                  <div
                    className="
                      bg-gray-50
                      border
                      border-gray-200
                      rounded-2xl
                      p-6
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      min-h-[330px]
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                        tracking-wider
                        mb-4
                      "
                    >
                      Stage 2
                    </p>

                    <p className="text-gray-400 text-sm">
                      Analysis skipped
                    </p>

                  </div>

                )}


                {/* ===============================================
                    STAGE 3
                ================================================ */}

                {result.lesion_executed ? (

                  <div
                    className="
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      shadow-sm
                      hover:shadow-md
                      transition-shadow
                      p-6
                      flex
                      flex-col
                      items-center
                      text-center
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                        tracking-wider
                        mb-5
                      "
                    >
                      Stage 3
                    </p>


                    {/* Existing ScoreCircle */}

                    <ScoreCircle
                      score={result.lesion_confidence}
                      label={result.lesion_class}
                      color="#3b82f6"
                    />


                    {/* Confidence */}

                    <div className="mt-5">

                      <p
                        className="
                          text-2xl
                          font-bold
                          text-gray-900
                        "
                      >
                        {(result.lesion_confidence * 100).toFixed(1)}%
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Lesion Classification Confidence
                      </p>

                    </div>

                  </div>

                ) : (

                  <div
                    className="
                      bg-gray-50
                      border
                      border-gray-200
                      rounded-2xl
                      p-6
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      min-h-[330px]
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                        tracking-wider
                        mb-4
                      "
                    >
                      Stage 3
                    </p>

                    <p className="text-gray-400 text-sm">
                      Analysis skipped
                    </p>

                  </div>

                )}

              </div>

            </section>


            {/* ==================================================
                GRAD-CAM
            =================================================== */}

            {result.gradcam_path && (

              <div
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  p-6
                  shadow-sm
                  mb-8
                "
              >

                <GradCAMViewer
                  originalUrl={result.image_path}
                  heatmapUrl={
                    result.gradcam_path.replace(
                      'overlay',
                      'heatmap'
                    )
                  }
                  overlayUrl={result.gradcam_path}
                />

              </div>

            )}


            {/* ==================================================
                FINAL RESULT
            =================================================== */}

            <div
              className="
                bg-gradient-to-r
                from-primary
                to-primary-dark
                rounded-xl
                p-8
                text-white
                mb-8
              "
            >

              <h2 className="text-2xl font-bold mb-5">
                AI Classification Result
              </h2>


              <div className="space-y-3">


                {/* Stage 1 */}

                <div className="flex justify-between items-center">

                  <span className="opacity-90">
                    Stage 1 (Skin Screening):
                  </span>

                  <span className="font-semibold">
                    {result.stage1_class}
                  </span>

                </div>


                {/* Stage 2 */}

                {result.benign_malignant_executed && (

                  <div className="flex justify-between items-center">

                    <span className="opacity-90">
                      Stage 2 (Malignancy):
                    </span>

                    <span className="font-semibold">
                      {result.benign_malignant_class}
                    </span>

                  </div>

                )}


                {/* Stage 3 */}

                {result.lesion_executed && (

                  <>

                    <div className="flex justify-between items-center">

                      <span className="opacity-90">
                        Stage 3 (Lesion Type):
                      </span>

                      <span className="font-semibold">
                        {result.lesion_class}
                      </span>

                    </div>


                    <div className="flex justify-between items-center">

                      <span className="opacity-90">
                        Confidence:
                      </span>

                      <span className="font-semibold">
                        {(result.lesion_confidence * 100).toFixed(2)}%
                      </span>

                    </div>

                  </>

                )}

              </div>


              {/* =================================================
                  BUTTONS
              ================================================== */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-4
                "
              >


                {/* Analyze another image */}

                <button
                  onClick={() => navigate('/analyze')}
                  className="
                    px-6
                    py-3
                    bg-white
                    text-primary
                    rounded-lg
                    font-medium
                    hover:bg-gray-100
                    transition-colors
                    flex
                    items-center
                    gap-2
                  "
                >

                  <ArrowRight className="w-5 h-5" />

                  Analyze Another Image

                </button>


                {/* =================================================
                    WORKING DOWNLOAD BUTTON
                ================================================== */}

                <button
                  onClick={downloadReport}
                  className="
                    px-6
                    py-3
                    border-2
                    border-white
                    text-white
                    rounded-lg
                    font-medium
                    hover:bg-white
                    hover:text-primary
                    transition-colors
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Download className="w-5 h-5" />

                  Download Report

                </button>

              </div>

            </div>


            {/* ==================================================
                DISCLAIMER
            =================================================== */}

            <div
              className="
                bg-blue-50
                border
                border-blue-200
                rounded-lg
                p-4
                mb-8
              "
            >

              <p className="text-sm text-blue-800">

                <strong>Disclaimer:</strong>{' '}

                This is an AI classification result, not a medical
                diagnosis. Always consult a healthcare professional
                for medical advice.

              </p>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default Results;