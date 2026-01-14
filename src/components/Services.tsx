import { BarChart3, Brain } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: BarChart3,
      title: 'Data-Driven Decision Making & Visual Storytelling',
      target: 'SMEs, Startups, Marketing Managers',
      description: "Transform your messy spreadsheets and tracking tags into clear, interactive dashboards. I don't just dump data; I tell visual stories that help you optimize campaigns, fix conversion funnels, and prove ROI.",
      gradient: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-200/50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Brain,
      title: 'Advanced Statistical Analysis Solutions',
      target: 'PhD Students, Professors, Research Firms',
      description: 'Struggling with complex datasets or hypothesis testing? I provide academic-grade statistical modeling. From survey design to final analysis in R or SPSS, I ensure your methodology is rigorous and publication-ready.',
      gradient: 'from-pink-500/10 to-pink-600/10',
      borderColor: 'border-pink-200/50',
      iconColor: 'text-pink-600'
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Services</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforming data complexity into actionable insights
          </p>
        </div>

        {/* UPDATED: Centered the grid and limited it to 2 columns (max-w-5xl) */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`group bg-white/80 backdrop-blur-md rounded-2xl border ${service.borderColor} shadow-lg p-8 hover:shadow-2xl hover:-translate-y-4 hover:bg-white transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`${service.iconColor}`} size={32} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {service.title}
                </h3>

                <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                  {service.target}
                </p>

                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
