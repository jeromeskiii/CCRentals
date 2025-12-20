
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-50 pt-24 pb-12 border-t border-zinc-200">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-600/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.05.547l-1 1A2 2 0 004 20v1a1 1 0 001 1h14a1 1 0 001-1v-1a2 2 0 00-.572-1.414l-1-1zM12 2v3m0 0a3 3 0 00-3 3v1h6V8a3 3 0 00-3-3z" />
                </svg>
              </div>
              <span className="font-black text-2xl tracking-tight text-zinc-900">Coastal Clean</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium">
              The premier provider of portable sanitation and temporary site solutions for construction, industry, and high-end events.
            </p>
            <div className="flex gap-4">
               {[1,2,3].map(i => (
                 <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-sky-600 hover:border-sky-600 transition-all shadow-sm">
                   <div className="w-5 h-5 bg-current rounded-sm"></div>
                 </a>
               ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-zinc-900 mb-8 uppercase tracking-widest text-xs">Rental Solutions</h4>
            <ul className="space-y-4 text-sm font-bold text-zinc-500">
              <li><a href="#" className="hover:text-sky-600 transition-colors">Standard Portables</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Luxury Restroom Trailers</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Handwash Stations</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Temporary Fencing</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">ADA Compliant Units</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-zinc-900 mb-8 uppercase tracking-widest text-xs">Industries</h4>
            <ul className="space-y-4 text-sm font-bold text-zinc-500">
              <li><a href="#" className="hover:text-sky-600 transition-colors">Construction Sites</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Weddings & Parties</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Agricultural Operations</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Disaster Response</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Oil & Gas</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-zinc-900 mb-8 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4 text-sm font-bold text-zinc-500">
              <li><a href="#" className="hover:text-sky-600 transition-colors">Sanitation Blog</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">OSHA Requirements</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Service Area Map</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Partner Portal</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-zinc-200 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-sm text-zinc-400 font-bold">
            © 2024 Coastal Clean Site Services. A Division of Coastal Clean Rentals.
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Fleet Dispatch Active</span>
            </div>
            <div className="h-4 w-px bg-zinc-200"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">ISO 9001 Certified</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
