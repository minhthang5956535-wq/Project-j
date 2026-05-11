export default function BrandMarquee() {
  const brands = [
    { 
      name: "DJI FPV", 
      logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-500 group-hover:text-primary transition-all duration-300 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4l6 6M20 4l-6 6M4 20l6-6M20 20l-6-6M12 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4z"/></svg> 
    },
    { 
      name: "BetaFPV", 
      logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-500 group-hover:text-[#f5c242] transition-all duration-300 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.866 8.21 8.21 0 0 0 3 2.48Z" /><path d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" /></svg> 
    },
    { 
      name: "Foxeer", 
      logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-500 group-hover:text-primary transition-all duration-300 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> 
    },
    { 
      name: "Caddx", 
      logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-500 group-hover:text-white transition-all duration-300 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg> 
    },
    { 
      name: "T-Motor", 
      logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-500 group-hover:text-primary transition-all duration-300 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> 
    },
    { 
      name: "Radiomaster", 
      logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-500 group-hover:text-primary transition-all duration-300 drop-shadow-md"><rect width="20" height="12" x="2" y="6" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h4M8 10v4M15 11h.01M18 11h.01M15 13h.01M18 13h.01" /><circle cx="8" cy="12" r="0.5" fill="currentColor"/><circle cx="15" cy="11" r="0.5" fill="currentColor"/><circle cx="18" cy="11" r="0.5" fill="currentColor"/><circle cx="15" cy="13" r="0.5" fill="currentColor"/><circle cx="18" cy="13" r="0.5" fill="currentColor"/></svg> 
    },
    { 
      name: "TBS Crossfire", 
      logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-500 group-hover:text-primary transition-all duration-300 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" /></svg> 
    },
    { 
      name: "SpeedyBee", 
      logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-500 group-hover:text-[#f5c242] transition-all duration-300 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5v9l9 5.25 9-5.25v-9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12m-3 0a3 3 0 1 1 6 0 3 3 0 1 1-6 0" /></svg> 
    },
  ];

  return (
    <div className="w-full bg-dark py-8 border-y border-dark-border overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-transparent to-dark z-10 pointer-events-none"></div>
      <div className="flex w-full overflow-hidden">
        <div className="flex gap-20 whitespace-nowrap animate-marquee items-center pl-20">
          {[...brands, ...brands, ...brands].map((brand, idx) => (
            <div key={idx} className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors cursor-pointer group">
              <span className="opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-y-1">{brand.logo}</span>
              <span className="font-display text-xl font-black uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300 drop-shadow-sm">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
