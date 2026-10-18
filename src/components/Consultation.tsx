import { Calendar, Clock, Video, Mail } from 'lucide-react';
import { ChartDivider, Eyebrow, Reveal } from './ui';

export default function Consultation() {
  return (
    <section id="consult" className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-70 pointer-events-none" aria-hidden="true" />
      <div className="pointer-events-none absolute top-24 -right-40 w-[420px] h-[420px] rounded-full bg-brand-100/50 blur-3xl" aria-hidden="true" />
      <div className="relative max-w-5xl mx-auto">
        <Reveal className="text-center mb-8 sm:mb-12">
          <Eyebrow>Let's talk</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4 tracking-tight">
            Ready to Solve Your Data Problems?
          </h2>
          <ChartDivider className="mb-6" />
          <p className="text-xl text-slate-600">
            Pick a time that works for you
          </p>
        </Reveal>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_30px_70px_-40px_rgba(14,24,56,0.5)] p-4 sm:p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="group bg-slate-50 rounded-xl p-6 border border-slate-200 hover:bg-white hover:border-brand-200 hover:shadow-[0_18px_40px_-24px_rgba(14,24,56,0.45)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink mb-2">Flexible Scheduling</h3>
                    <p className="text-slate-600">Choose a time slot that fits your schedule</p>
                  </div>
                </div>
              </div>

              <div className="group bg-slate-50 rounded-xl p-6 border border-slate-200 hover:bg-white hover:border-brand-200 hover:shadow-[0_18px_40px_-24px_rgba(14,24,56,0.45)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink mb-2">20-Minute Sessions</h3>
                    <p className="text-slate-600">Focused discussion on your specific needs</p>
                  </div>
                </div>
              </div>

              <div className="group bg-slate-50 rounded-xl p-6 border border-slate-200 hover:bg-white hover:border-brand-200 hover:shadow-[0_18px_40px_-24px_rgba(14,24,56,0.45)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Video className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink mb-2">Video Conference</h3>
                    <p className="text-slate-600">Connect via Google Meet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendly Integration Start */}
            {/* UPDATED: h-[500px] on mobile, h-[700px] on tablet/desktop */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 h-[500px] sm:h-[700px]">
              <iframe
                src="https://calendly.com/scaleupwithsabbir/new-meeting?hide_landing_page_details=1&hide_gdpr_banner=1"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Select a Date & Time"
                className="w-full h-full"
              ></iframe>
            </div>
            {/* Calendly Integration End */}

          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 rounded-xl p-8 border border-brand-900 hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 bg-white/10 ring-1 ring-white/20 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <Mail className="text-teal-300" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-3 text-lg">Prefer Email?</h3>
                <p className="text-brand-100/80 mb-4 leading-relaxed">
                  Send me a message and I'll get back to you within 24 hours
                </p>
                <a
                  href="mailto:scaleupwithsabbir@gmail.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-800 font-semibold rounded-lg shadow-lg hover:bg-teal-50 hover:text-brand-900 transition-all duration-300 hover:-translate-y-0.5 break-all sm:break-normal"
                >
                  scaleupwithsabbir@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
