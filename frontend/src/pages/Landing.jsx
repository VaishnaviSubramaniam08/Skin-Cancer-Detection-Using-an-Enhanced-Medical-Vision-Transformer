import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Eye,
  BarChart3,
  Clock,
  ShieldCheck,
  Sparkles,
  Upload,
  ScanLine,
  Activity,
  CheckCircle2,
  Stethoscope,
  Phone,
  Mail,
  Search,
  ChevronRight,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">

     

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <nav className="relative z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center
                justify-center shadow-md shadow-red-100">
                <Brain className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  Skin<span className="text-red-600">AI</span>
                </h1>
                <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase">
                  Intelligent Skin Screening
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home"
                className="text-sm font-medium text-red-600 hover:text-red-700">
                Home
              </a>
              <a href="#technology"
                className="text-sm font-medium text-gray-600 hover:text-red-600">
                Technology
              </a>
              <a href="#features"
                className="text-sm font-medium text-gray-600 hover:text-red-600">
                Features
              </a>
              <Link to="/about"
                className="text-sm font-medium text-gray-600 hover:text-red-600">
                About
              </Link>
            </div>

            {/* Right buttons */}
            <div className="flex items-center gap-3">
              <button className="hidden lg:flex w-9 h-9 rounded-full border
                border-gray-200 items-center justify-center hover:border-red-300">
                <Search className="w-4 h-4 text-gray-600" />
              </button>

              <Link to="/login"
                className="hidden sm:block text-sm font-semibold text-gray-700
                hover:text-red-600">
                Login
              </Link>

              <Link to="/signup"
                className="px-5 py-2.5 rounded-full bg-red-600 text-white
                text-sm font-semibold hover:bg-red-700 transition shadow-md
                shadow-red-100">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section id="home" className="relative overflow-hidden bg-[#fff8f8]">

        {/* Soft background shapes */}
        <div className="absolute -right-40 -top-40 w-[520px] h-[520px]
          rounded-full bg-red-100/60 blur-3xl" />
        <div className="absolute -left-40 bottom-0 w-[420px] h-[420px]
          rounded-full bg-red-50 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 xl:gap-16
            items-center">

            {/* LEFT */}
            <div className="order-2 lg:order-1">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-white border border-red-100 shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span className="text-xs font-bold tracking-wide text-red-600">
                  YOUR SKIN, OUR PRIORITY
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-[68px] font-bold
                leading-[1.03] tracking-[-0.045em] text-gray-950">
                Intelligent
                <br />
                Skin{" "}
                <span className="text-red-600">Screening</span>
                <br />
                With AI
              </h1>

              <p className="mt-6 max-w-xl text-base md:text-lg text-gray-600
                leading-7">
                A two-stage Vision Transformer pipeline for skin image
                screening, lesion classification, confidence analysis and
                explainable AI visualization.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/signup"
                  className="group inline-flex items-center gap-3 px-7 py-3.5
                  rounded-full bg-red-600 text-white font-semibold
                  hover:bg-red-700 transition shadow-lg shadow-red-200">
                  Start Analysis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1
                    transition" />
                </Link>

                <Link to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5
                  rounded-full bg-white border border-gray-200 text-gray-800
                  font-semibold hover:border-red-300 hover:text-red-600
                  transition">
                  Learn More
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap gap-6 mt-9 pt-7
                border-t border-red-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-600">Research Focused</span>
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-600">Explainable AI</span>
                </div>

                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-600">Vision Transformer</span>
                </div>
              </div>
            </div>

            {/* RIGHT - IMAGE + ANALYSIS CARD */}
            <div className="order-1 lg:order-2 relative">

              <div className="relative rounded-[35px] overflow-hidden
                bg-white shadow-2xl border border-white">

                <div className="h-[300px] md:h-[400px] relative">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=90"
                    alt="Medical professional"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* White/red image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r
                    from-white/80 via-white/15 to-transparent" />

                  {/* AI scan box */}
                  <div className="absolute left-[12%] top-[20%] w-[48%] h-[48%]
                    border-2 border-red-500 rounded-2xl">
                    <span className="absolute -top-3 -left-3 w-7 h-7
                      border-l-4 border-t-4 border-red-600 rounded-tl-lg" />
                    <span className="absolute -top-3 -right-3 w-7 h-7
                      border-r-4 border-t-4 border-red-600 rounded-tr-lg" />
                    <span className="absolute -bottom-3 -left-3 w-7 h-7
                      border-l-4 border-b-4 border-red-600 rounded-bl-lg" />
                    <span className="absolute -bottom-3 -right-3 w-7 h-7
                      border-r-4 border-b-4 border-red-600 rounded-br-lg" />

                    <div className="absolute -top-9 left-0 px-3 py-1 rounded-full
                      bg-red-600 text-white text-[10px] font-bold">
                      AI FOCUS
                    </div>
                  </div>

                  {/* Scan line */}
                  <div className="absolute left-[12%] top-[44%] w-[48%]
                    h-[2px] bg-red-500 shadow-lg shadow-red-400" />

                  {/* Image label */}
                  <div className="absolute left-5 bottom-5 bg-white/95
                    rounded-xl px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <ScanLine className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          AI Image Analysis
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Vision Transformer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom information cards */}
                <div className="p-4 md:p-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                    <p className="text-[10px] font-bold text-red-600">01</p>
                    <p className="text-sm font-bold mt-1">Skin Detection</p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      ViT-B/16
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-gray-100
                    shadow-sm p-3">
                    <p className="text-[10px] font-bold text-red-600">02</p>
                    <p className="text-sm font-bold mt-1">Classification</p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Multi-class
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-gray-100
                    shadow-sm p-3">
                    <p className="text-[10px] font-bold text-red-600">03</p>
                    <p className="text-sm font-bold mt-1">Explainable AI</p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Grad-CAM
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating upload card */}
              <div className="absolute -left-3 md:-left-8 top-16 bg-white
                rounded-2xl shadow-xl border border-gray-100 p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex
                    items-center justify-center">
                    <Upload className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Upload</p>
                    <p className="text-xs text-gray-400">Skin image</p>
                  </div>
                </div>
              </div>

              {/* Floating status card */}
              <div className="absolute -right-2 md:-right-8 bottom-28
                bg-red-600 text-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6" />
                  <div>
                    <p className="text-sm font-bold">Analysis Ready</p>
                    <p className="text-[10px] text-red-100">
                      AI model active
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          QUICK FEATURES - similar to reference cards
      ========================================================= */}
      <section className="py-10 px-5">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3
          gap-5">

          <div className="rounded-2xl bg-white border border-gray-100
            shadow-sm p-6 hover:shadow-lg hover:border-red-100 transition">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center
              justify-center">
              <Stethoscope className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mt-4">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-500 mt-2 leading-6">
              Computer vision models analyze uploaded skin images.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100
            shadow-sm p-6 hover:shadow-lg hover:border-red-100 transition">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center
              justify-center">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mt-4">Confidence Analysis</h3>
            <p className="text-sm text-gray-500 mt-2 leading-6">
              View probability information for classification results.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100
            shadow-sm p-6 hover:shadow-lg hover:border-red-100 transition">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center
              justify-center">
              <Eye className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mt-4">Explainable Results</h3>
            <p className="text-sm text-gray-500 mt-2 leading-6">
              Grad-CAM highlights image regions related to the prediction.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}
      <section className="py-20 px-5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14
          items-center">

          <div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=85"
                alt="Healthcare"
                className="w-full h-72 object-cover rounded-2xl"
              />
              <div className="rounded-2xl bg-red-600 text-white p-7 flex
                flex-col justify-center">
                <p className="text-4xl font-bold">AI</p>
                <p className="text-sm text-red-100 mt-2">
                  Computer vision based skin image analysis
                </p>
              </div>
              <div className="col-span-2">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=85"
                  alt="Medical research"
                  className="w-full h-56 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-red-600
              uppercase">
              About Us
            </p>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4">
              Caring for your skin with intelligent technology.
            </h2>

            <p className="text-gray-500 leading-7 mt-6">
              SkinAI combines a two-stage Vision Transformer architecture
              with explainable AI techniques for image-based skin analysis.
            </p>

            <p className="text-gray-500 leading-7 mt-4">
              The system first checks the uploaded image and then performs
              lesion classification. Grad-CAM helps visualize important
              regions that influenced the model output.
            </p>

            <div className="space-y-5 mt-7">
              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>AI Image Analysis</span>
                  <span className="text-red-600">95%</span>
                </div>
                <div className="h-2 bg-red-50 rounded-full mt-2">
                  <div className="h-2 w-[95%] bg-red-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Explainable AI</span>
                  <span className="text-red-600">90%</span>
                </div>
                <div className="h-2 bg-red-50 rounded-full mt-2">
                  <div className="h-2 w-[90%] bg-red-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Research Support</span>
                  <span className="text-red-600">85%</span>
                </div>
                <div className="h-2 bg-red-50 rounded-full mt-2">
                  <div className="h-2 w-[85%] bg-red-400 rounded-full" />
                </div>
              </div>
            </div>

            <Link to="/about"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3
              rounded-full bg-red-600 text-white font-semibold
              hover:bg-red-700 transition">
              Learn More
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          TECHNOLOGY
      ========================================================= */}
      <section id="technology" className="py-24 px-5 bg-[#fff8f8]">
        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-bold tracking-[0.2em] text-red-600
              uppercase">
              How It Works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              A simple four-step pipeline
            </h2>
            <p className="text-gray-500 text-lg mt-5">
              Each stage has a specific role in transforming an uploaded
              image into an explainable AI result.
            </p>
          </div>

          <div className="grid md:grid-cols-4 mt-14 bg-white rounded-3xl
            shadow-sm border border-red-100 overflow-hidden">

            <div className="p-7 border-b md:border-b-0 md:border-r
              border-gray-100">
              <span className="text-sm font-bold text-red-600">01</span>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center
                justify-center mt-5">
                <Upload className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mt-5">Upload Image</h3>
              <p className="text-gray-500 text-sm mt-3 leading-6">
                Upload a skin image through the analysis interface.
              </p>
            </div>

            <div className="p-7 border-b md:border-b-0 md:border-r
              border-gray-100">
              <span className="text-sm font-bold text-red-600">02</span>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center
                justify-center mt-5">
                <Brain className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mt-5">Stage 1</h3>
              <p className="text-red-600 text-sm font-semibold mt-1">
                Skin / Non-Skin
              </p>
              <p className="text-gray-500 text-sm mt-3 leading-6">
                ViT-B/16 determines whether the uploaded image contains skin.
              </p>
            </div>

            <div className="p-7 border-b md:border-b-0 md:border-r
              border-gray-100">
              <span className="text-sm font-bold text-red-600">03</span>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center
                justify-center mt-5">
                <Stethoscope className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mt-5">Stage 2</h3>
              <p className="text-red-600 text-sm font-semibold mt-1">
                Lesion Classification
              </p>
              <p className="text-gray-500 text-sm mt-3 leading-6">
                The model performs multi-class classification using the
                ISIC-2019 dataset.
              </p>
            </div>

            <div className="p-7">
              <span className="text-sm font-bold text-red-600">04</span>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center
                justify-center mt-5">
                <Eye className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mt-5">Explainable AI</h3>
              <p className="text-red-600 text-sm font-semibold mt-1">
                Grad-CAM
              </p>
              <p className="text-gray-500 text-sm mt-3 leading-6">
                Important image regions are visualized to help understand
                the model output.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section id="features" className="py-24 px-5">
        <div className="max-w-7xl mx-auto">

          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-red-600
              uppercase">
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Built for AI research
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">

            {[
              {
                icon: Brain,
                title: "Vision Transformer",
                text: "Transformer-based architecture for image classification.",
              },
              {
                icon: Eye,
                title: "Grad-CAM",
                text: "Visual explanation of regions influencing model predictions.",
              },
              {
                icon: BarChart3,
                title: "Confidence Analysis",
                text: "Probability distributions for classification results.",
              },
              {
                icon: Clock,
                title: "Prediction History",
                text: "Review previous image analysis and prediction results.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div key={index}
                  className="group p-7 rounded-3xl border border-gray-200
                  hover:border-red-200 hover:shadow-xl hover:shadow-red-100/50
                  transition">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex
                    items-center justify-center group-hover:bg-red-600
                    transition">
                    <Icon className="w-6 h-6 text-red-600
                      group-hover:text-white transition" />
                  </div>

                  <h3 className="text-xl font-bold mt-7">
                    {feature.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-6 mt-3">
                    {feature.text}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="px-5 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[32px] bg-red-600
            px-8 py-14 md:px-16">

            <div className="absolute -top-32 -right-20 w-96 h-96
              rounded-full bg-white/10" />
            <div className="absolute -bottom-40 left-20 w-96 h-96
              rounded-full bg-red-800/20" />

            <div className="relative max-w-3xl">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex
                items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mt-7">
                Explore AI-based skin screening.
              </h2>

              <p className="text-red-100 text-lg leading-7 mt-5 max-w-2xl">
                Experience the complete two-stage Vision Transformer workflow
                with classification and explainable visualization.
              </p>

              <Link to="/signup"
                className="inline-flex items-center gap-3 mt-8 px-7 py-4
                rounded-full bg-white text-red-600 font-bold
                hover:bg-red-50 transition shadow-lg">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-5 py-10">

          <div className="flex flex-col md:flex-row justify-between
            items-center gap-6">

            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex
                items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>

              <div>
                <p className="font-bold">
                  Skin<span className="text-red-600">AI</span>
                </p>
                <p className="text-xs text-gray-400">
                  Intelligent Skin Screening
                </p>
              </div>
            </Link>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">
                © 2026 AI Skin Classification System
              </p>
              <p className="text-xs text-gray-400 mt-1">
                For research and academic purposes only.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 max-w-3xl mx-auto leading-5">
              This system is intended for research and academic purposes only
              and is not a medical diagnosis tool. AI predictions should not
              replace professional medical evaluation or advice.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
