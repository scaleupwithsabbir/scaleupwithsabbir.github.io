import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-pink-700 transition-all duration-300">Sabbir Rifat</h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-gray-900 transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="text-gray-700 hover:text-gray-900 transition-colors">
              Portfolio
            </button>
            <button onClick={() => scrollToSection('consult')} className="text-gray-700 hover:text-gray-900 transition-colors">
              Consult
            </button>
            <button
              onClick={() => scrollToSection('consult')}
              className="px-6 py-2 bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Book a Call
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection('consult')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Consult
            </button>
            <button
              onClick={() => scrollToSection('consult')}
              className="w-full px-6 py-2 bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Book a Call
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
