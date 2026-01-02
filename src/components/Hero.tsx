import { ArrowRight, Calendar } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-24 pb-12 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-pink-50/30 to-green-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* TEXT SECTION: Order 2 on mobile (bottom), Order 1 on Desktop (left) */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left">
            <div className="space-y-4">
              {/* Responsive Text Sizes: Smaller on mobile, huge on desktop */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Stop Guessing.<br />
                <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                  Start Growing
                </span>{' '}
                with Data-Backed Evidence.
              </h1>
              {/* Centered text on mobile with max-width for readability */}
              <p className="text-base sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Quantitative Researcher & Digital Marketing Analyst helping businesses and researchers find clarity in the noise.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection('consult')}
                // Full width button on mobile for better UX
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Calendar size={20} />
                Book a Consultation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* IMAGE SECTION: Order 1 on mobile (top), Order 2 on Desktop (right) */}
          <div className="flex items-center justify-center order-1 lg:order-2 mb-8 lg:mb-0">
            {/* Height adjusts: 300px on mobile, 450px on desktop */}
            <div className="relative w-full max-w-md lg:max-w-full h-[300px] sm:h-[450px] group flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-pink-200/40 to-green-200/40 rounded-3xl backdrop-blur-sm"></div>
              
              {/* Frame padding adjusts slightly for mobile (inset-3) vs desktop (inset-4) */}
              <div className="absolute inset-3 sm:inset-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl overflow-hidden group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                <img 
                  src="https://raw.githubusercontent.com/scaleupwithsabbir/Media-files-/18ab29c2811e57e5dea4fa06485d54c2a4d90e46/Image%203.jpeg" 
                  alt="Sabbir Rifat" 
                  className="relative z-10 w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
