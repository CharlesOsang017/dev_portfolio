import React from "react";

const Experience = () => {
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
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .timeline-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 32px;
          width: 4px;
          background: #4b5563;
        }
        .timeline-dot::before {
          content: '';
          position: absolute;
          top: 24px;
          left: -6px;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
        }
        @media (max-width: 640px) {
          .timeline-line {
            left: 12px;
          }
          .timeline-dot::before {
            left: 6px;
          }
        }
      `}</style>
      <div className="md:px-0 px-7 py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-8 text-center animate-slide-up">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
           Experience
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mt-2 max-w-3xl mx-auto">
            Explore my journey as a software developer, where I’ve built innovative solutions and collaborated with talented teams to deliver impactful projects.
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative">
          <div className="timeline-line" />
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="relative flex flex-col gap-4  border border-slate-600 rounded-2xl p-4 sm:p-6 ml-12 sm:ml-16 hover-scale animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="timeline-dot" />
              <div className="w-full">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white">Senior Full-Stack Developer</h4>
                <p className="text-sm sm:text-base text-gray-300">TechCorp Solutions</p>
                <p className="text-xs sm:text-sm text-gray-400">January 2023 – Present</p>
                <ul className="mt-2 text-sm sm:text-base text-gray-200 list-disc list-inside">
                  <li>Led development of a scalable e-commerce platform using React, Node.js, and MongoDB.</li>
                  <li>Optimized application performance, reducing load times by 30%.</li>
                  <li>Mentored junior developers and conducted code reviews to ensure quality.</li>
                </ul>
              </div>
            </div>
            <div className="relative flex flex-col gap-4  border border-slate-600 rounded-2xl p-4 sm:p-6 ml-12 sm:ml-16 hover-scale animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="timeline-dot" />
              <div className="w-full">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white">Frontend Developer</h4>
                <p className="text-sm sm:text-base text-gray-300">InnovateX Labs</p>
                <p className="text-xs sm:text-sm text-gray-400">June 2021 – December 2022</p>
                <ul className="mt-2 text-sm sm:text-base text-gray-200 list-disc list-inside">
                  <li>Developed responsive web interfaces using React and Tailwind CSS.</li>
                  <li>Integrated RESTful APIs to enhance application functionality.</li>
                  <li>Collaborated with designers to create user-friendly UI/UX designs.</li>
                </ul>
              </div>
            </div>
            <div className="relative flex flex-col gap-4  border border-slate-600 rounded-2xl p-4 sm:p-6 ml-12 sm:ml-16 hover-scale animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="timeline-dot" />
              <div className="w-full">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white">Junior Software Developer</h4>
                <p className="text-sm sm:text-base text-gray-300">StartUp Dynamics</p>
                <p className="text-xs sm:text-sm text-gray-400">March 2020 – May 2021</p>
                <ul className="mt-2 text-sm sm:text-base text-gray-200 list-disc list-inside">
                  <li>Built and maintained web applications using JavaScript and Express.js.</li>
                  <li>Assisted in database design and management with MongoDB.</li>
                  <li>Contributed to agile development processes and sprint planning.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Experience;