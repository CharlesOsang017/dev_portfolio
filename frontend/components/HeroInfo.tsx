"use client";

import { useState, useEffect } from "react";

interface AboutInfo {
  aboutDescription?: string;
  projectsCompleted?: number;
  yearsOfExperience?: number;
}

const HeroInfo = ({ aboutInfo }: { aboutInfo: AboutInfo }) => {
  const [projectCount, setProjectCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);

  useEffect(() => {
    const projectTarget = Number(aboutInfo?.projectsCompleted) || 0;
    const yearTarget = Number(aboutInfo?.yearsOfExperience) || 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setProjectCount(Math.ceil(projectTarget * progress));
      setYearCount(Math.ceil(yearTarget * progress));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [aboutInfo]);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        .hover-scale:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
      `}</style>
      <div className="sm:px-6 md:px-20 px-20 md:mb-30 md:max-w-[69rem] bg-gradient-to-br from-zinc-800 to-gray-900 py-2 md:py-6 rounded-2xl animate-slide-up">
        <div className="max-w-3xl">
          <p className="text-sm sm:text-base md:text-lg text-gray-200">
            {aboutInfo?.aboutDescription || "Welcome! I'm a professional software developer."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:justify-between items-center py-4 gap-6 sm:gap-4">
          <div className="flex px-12 gap-6 sm:gap-8">
            <div className="hover-scale">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white"
                aria-label={`${projectCount} projects completed`}
              >
                {projectCount}+
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">
                Projects completed
              </p>
            </div>
            <div className="hover-scale">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white"
                aria-label={`${yearCount} years of experience`}
              >
                {yearCount}+
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">
                Years of experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroInfo;