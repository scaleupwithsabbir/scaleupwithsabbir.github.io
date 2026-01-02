import { Calendar, Clock, Video, Mail } from 'lucide-react';

export default function Consultation() {
  return (
    <section id="consult" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-pink-50/30 to-green-50/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Solve Your Data Problems?
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600">
            Pick a time that works for you
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-xl p-4 sm:p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="group bg-white/40 backdrop-blur-sm rounded-lg p-6 border border-gray-200/30 hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Flexible Scheduling</h3>
                    <p className="text-gray-600">Choose a time slot that fits your schedule</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/40 backdrop-blur-sm rounded-lg p-6 border border-gray-200/30 hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">20-Minute Sessions</h3>
                    <p className="text-gray-600">Focused discussion on your specific needs</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/40 backdrop-blur-sm rounded-lg p-6 border border-gray-200/30 hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Video className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Video Conference</h3>
                    <p className="text-gray-600">Connect via Google Meet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendly Integration Start */}
            {/* UPDATED: h-[500px] on mobile, h-[700px] on tablet/desktop */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200/50 h-[500px] sm:h-[700px]">
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

          <div className="bg-gradient-to-r from-blue-50 via-pink-50 to-green-50 rounded-xl p-8 border border-blue-200/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <Mail className="text-blue-600" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Prefer Email?</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Send me a message and I'll get back to you within 24 hours
                </p>
                <a
                  href="mailto:scaleupwithsabbir@gmail.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 break-all sm:break-normal"
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
