import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ImpactStrip from './components/ImpactStrip';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Consultation from './components/Consultation';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <ImpactStrip />
      <About />
      <Services />
      <Portfolio />
      <Consultation />
      <Footer />
    </div>
  );
}

export default App;
