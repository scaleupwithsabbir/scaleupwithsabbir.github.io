import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ImpactStrip from './components/ImpactStrip';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Projects from './components/Projects';
import Software from './components/Software';
import Consultation from './components/Consultation';
import Footer from './components/Footer';

function App() {
  // A link such as /#projects or /#berlin-short-stay should land on that section.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <ImpactStrip />
      <About />
      <Services />
      <Portfolio />
      <Projects />
      <Software />
      <Consultation />
      <Footer />
    </div>
  );
}

export default App;
