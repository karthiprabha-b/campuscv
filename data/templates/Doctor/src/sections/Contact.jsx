import React from 'react';
import { MapPin, Phone, Mail, Clock, Building2, ShieldCheck, Car, CheckCircle2 } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function Contact({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  const clinic = data?.clinic || doctor?.clinic || {};

  const doctorName = data?.profile?.name || data?.hero?.name || data?.name || data?.fullName || doctor?.name || doctorProfile?.name || 'Dr. Elena Vance';
  const clinicName = data?.contact?.clinicName || clinic?.name || data?.clinicName || doctorProfile?.clinic?.name || 'Beacon Health Medical Pavilion & Consulting Suites';
  const address = data?.profile?.location || data?.contact?.location || data?.location || clinic?.address || clinic?.addressLine1 || data?.address || doctorProfile?.clinic?.addressLine1 || 'Suite 450, 750 Medical Center Boulevard, Boston, MA 02115';
  const phone = data?.profile?.phone || data?.contact?.phone || data?.phone || clinic?.phone || doctor?.phone || doctorProfile?.clinic?.phone || '+1 (617) 555-0194';
  const email = data?.profile?.email || data?.contact?.email || data?.email || clinic?.email || doctor?.email || doctorProfile?.clinic?.email || 'consultations@drelenavance.com';
  
  const rawHours = clinic?.receptionHours || clinic?.hours || data?.hours;
  const receptionHours = (Array.isArray(rawHours) && rawHours.length > 0)
    ? rawHours
    : (doctorProfile?.clinic?.hours || doctorProfile?.clinic?.receptionHours || [
        { days: 'Monday – Thursday', time: '8:30 AM – 5:30 PM' },
        { days: 'Friday', time: '8:30 AM – 3:00 PM' },
        { days: 'Saturday – Sunday', time: 'Urgent On-Call Only' }
      ]);
      
  const rawConsultTypes = doctor?.consultationTypes || data?.consultationTypes;
  const consultationTypes = (Array.isArray(rawConsultTypes) && rawConsultTypes.length > 0)
    ? rawConsultTypes
    : (doctorProfile?.consultationTypes || [
        { type: 'In-Person Comprehensive Consultation' },
        { type: 'Secure Telehealth Video Review' },
        { type: 'Specialist Second Opinion' }
      ]);

  const eyebrow = data?.contact?.eyebrow || 'Practice Details';
  const title = data?.contact?.title || 'Clinical Suites & Direct Contact';
  const description = data?.contact?.description || `Official consulting location, reception timings, and verified communication channels for ${doctorName}.`;

  return (
    <section
      id="contact"
      data-cv-section="contact"
      className="pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16 bg-slate-50 border-b border-slate-200/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full border border-sky-200" data-cv="contact.eyebrow">
            {eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight" data-cv="contact.title">
            {title}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed" data-cv="contact.description">
            {description}
          </p>
        </div>

        {/* 3-Column Structured Practice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Clinic Location & Facility */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Building2 className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-700">
                  Primary Practice Suite
                </div>
                <h3
                  className="text-base sm:text-lg font-bold text-slate-900 mt-1"
                  data-cv="clinic.name"
                >
                  {clinicName}
                </h3>
                <p
                  className="text-xs text-slate-500 mt-0.5"
                  data-cv="clinic.suite"
                >
                  {clinic?.suite || 'Suite 450, Level 4'}
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span data-cv="contact.location">{address}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span data-cv="clinic.parking">{clinic?.parking || 'Designated patient parking & valet available at entrance'}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span data-cv="clinic.accessibility">{clinic?.accessibility || 'Fully wheelchair accessible suites with elevator'}</span>
                </div>
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>

          {/* Card 2: Reception Hours & Appointments */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                <Clock className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Consulting Hours
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Reception Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clinical consultations strictly by confirmed appointment
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                {receptionHours.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="font-semibold text-slate-800" data-cv={`clinic.hours.${idx}.days`}>{slot.days || slot.day}</span>
                    <span className="text-slate-600 text-right" data-cv={`clinic.hours.${idx}.time`}>{slot.time || slot.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <span className="font-bold">Urgent Cases:</span> For acute emergency symptoms, contact hospital emergency services immediately.
            </div>
          </div>

          {/* Card 3: Direct Inquiries & Consultations */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Mail className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Direct Line & Email
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Inquiries & Appointments
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reach out for appointments, professional referrals, and record transfers
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-200 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-sky-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Telephone</div>
                    <div className="font-bold text-slate-900" data-cv="contact.phone">{phone}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-200 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-sky-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Official Email</div>
                    <div className="font-bold text-slate-900 truncate" data-cv="contact.email">{email}</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Available Consultation Modalities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {consultationTypes.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{typeof c === 'string' ? c : (c.type || c.name || 'Consultation')}</span>
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
