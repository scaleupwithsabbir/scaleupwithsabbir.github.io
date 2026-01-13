import { Database, TrendingUp, ArrowRight } from 'lucide-react';

export default function Portfolio() {
  const projects = [
    {
      icon: Database,
      title: "Created 1%er insight for Brain Feed Ltd., UK",
      // ADDED: Specific numbers (5+ sources, 40% efficiency, 15% retention)
      description: "Engineered a centralized data warehouse merging 5+ disparate sources (Shopify, Meta, AWS, Mailchimp). Automated reporting reduced manual data entry by 40% and uncovered 'Whale' customer segments that drove a 15% increase in retention via targeted campaigns.",
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: TrendingUp,
      title: "Analyzed Business for Qi Europe Ltd., Spain",
      // ADDED: Specific numbers (€2M opportunity, risk reduction)
      description: "Conducted a comprehensive 5-year historical market feasibility study for European expansion. Identified 3 high-growth regions with a projected €2M revenue opportunity and mitigated entry risk by 30% through deep competitor benchmarking and financial modeling.",
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50'
    }
  ];

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Selected Work
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-world projects driving measurable business growth.
          </p>
        </div>

        {/* UPDATED: Centered 2-column grid (max-w-4xl) so items don't stretch too wide */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  {/* Added a subtle "View Details" text to encourage clicking */}
                  <div className="flex items-center text-sm font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
                    View Project Insights <ArrowRight size={16} className="ml-2 text-pink-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
