export default function About() {
  const techStack = {
    tools: ['R', 'R Studio', 'SQL', 'Python', 'SPSS', 'VS Code'],
    viz: ['Power BI', 'Looker Studio', 'Tableau'],
    marketing: ['GA4', 'Google Tag Manager', 'Meta Ads Manager', 'Shopify Analytics']
  };

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">The Expert</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg p-8 sm:p-12 mb-12 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-lg text-gray-700 leading-relaxed">
            I am a <span className="font-semibold text-gray-900">Quantitative Data Analyst and Researcher</span> based in Germany with experience across Asia, Europe, and the UK. I bridge the gap between messy raw data and actionable business strategy.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Tech Stack</h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-8 border border-blue-200/50 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider text-center">Tools & Languages</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {techStack.tools.map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-white backdrop-blur-sm text-gray-800 rounded-full text-sm font-semibold border border-blue-300/50 hover:border-blue-500 hover:shadow-md transition-all duration-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-8 border border-green-200/50 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider text-center">Visualization</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {techStack.viz.map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-white backdrop-blur-sm text-gray-800 rounded-full text-sm font-semibold border border-green-300/50 hover:border-green-500 hover:shadow-md transition-all duration-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="group bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl p-8 border border-pink-200/50 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider text-center">Digital Marketing</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {techStack.marketing.map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-white backdrop-blur-sm text-gray-800 rounded-full text-sm font-semibold border border-pink-300/50 hover:border-pink-500 hover:shadow-md transition-all duration-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
