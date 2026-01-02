import { ArrowRight, Calendar } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-pink-50/30 to-green-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Stop Guessing.<br />
                <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                  Start Growing
                </span>{' '}
                with Data-Backed Evidence.
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Quantitative Researcher & Digital Marketing Analyst helping businesses and researchers find clarity in the noise.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('consult')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                Book a Consultation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-96 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-pink-200/40 to-green-200/40 rounded-3xl backdrop-blur-sm"></div>
              <div className="absolute inset-8 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl overflow-hidden group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                <img
  src="https://github.com/scaleupwithsabbir/Media-files-/blob/18ab29c2811e57e5dea4fa06485d54c2a4d90e46/Image%203.jpeg"
  alt="Sabbir Rifat"
  className="w-full h-full object-contain rounded-2xl"
/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
