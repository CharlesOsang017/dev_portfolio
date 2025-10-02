import React from "react";

const Skills = () => {
  return (
    <>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
      `}</style>
      <div className="py-8 sm:py-12 md:py-16">
        <div className="px-28 sm:px-6 md:px-8 mb-6 animate-slide-up">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
            Essential Tools I Use
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-2">
            Discover the powerful tools and technologies I use to create exceptional, <br /> high-performing websites and applications
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-28 sm:px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex gap-4 border border-slate-600 rounded-2xl p-4 hover:bg-transparent bg-gray-800 hover-scale animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="border border-slate-600 rounded-2xl p-2 flex-shrink-0">
              <img width={30} src="/images/css3.svg" alt="CSS" className="w-6 sm:w-8 md:w-10 h-auto" />
            </div>
            <div>
              <h4 className="ml-2 text-sm sm:text-base font-semibold text-white">CSS</h4>
              <p className="ml-2 text-xs sm:text-sm text-gray-400">User Interface</p>
            </div>
          </div>
          <div className="flex gap-4 border border-slate-600 rounded-2xl p-4 hover:bg-transparent bg-gray-800 hover-scale animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="border border-slate-600 rounded-2xl p-2 flex-shrink-0">
              <img width={30} src="/images/expressjs.svg" alt="Express.js" className="w-6 sm:w-8 md:w-10 h-auto" />
            </div>
            <div>
              <h4 className="ml-2 text-sm sm:text-base font-semibold text-white">Express.js</h4>
              <p className="ml-2 text-xs sm:text-sm text-gray-400">Node Framework</p>
            </div>
          </div>
          <div className="flex gap-4 border border-slate-600 rounded-2xl p-4 hover:bg-transparent bg-gray-800 hover-scale animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="border border-slate-600 rounded-2xl p-2 flex-shrink-0">
              <img width={30} src="/images/javascript.svg" alt="JavaScript" className="w-6 sm:w-8 md:w-10 h-auto" />
            </div>
            <div>
              <h4 className="ml-2 text-sm sm:text-base font-semibold text-white">JavaScript</h4>
              <p className="ml-2 text-xs sm:text-sm text-gray-400">Interaction</p>
            </div>
          </div>
          <div className="flex gap-4 border border-slate-600 rounded-2xl p-4 hover:bg-transparent bg-gray-800 hover-scale animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="border border-slate-600 rounded-2xl p-2 flex-shrink-0">
              <img width={30} src="/images/mongodb.svg" alt="MongoDB" className="w-6 sm:w-8 md:w-10 h-auto" />
            </div>
            <div>
              <h4 className="ml-2 text-sm sm:text-base font-semibold text-white">MongoDB</h4>
              <p className="ml-2 text-xs sm:text-sm text-gray-400">Database</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Skills;