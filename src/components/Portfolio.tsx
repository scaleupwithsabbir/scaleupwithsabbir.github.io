import { Database, TrendingUp, GraduationCap } from 'lucide-react';

export default function Portfolio() {
  const projects = [
    {
      icon: Database,
      title: 'Unified Data Lake for Brain Feed Ltd',
      description: 'Integrated GA4 with BigQuery to create a centralized data warehouse, enabling real-time analytics and custom reporting for multi-channel marketing campaigns.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: TrendingUp,
      title: 'Market Expansion Strategy for Qi Europe',
      description: 'Conducted comprehensive feasibility study and risk assessment for European market entry, including competitor analysis, demand forecasting, and financial modeling.',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      icon: GraduationCap,
      title: 'Academic Research Mentorship',
      description: 'Mentored graduate students at OVGU in quantitative research methods, including experimental design, statistical analysis in R, and academic paper preparation.',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    }
  ];

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Work</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Case studies showcasing data-driven solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <div
                key={index}
                className={`group bg-gradient-to-br ${project.bgGradient} rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-4 transition-all duration-300 cursor-pointer`}
              >
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${project.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="text-white" size={32} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
