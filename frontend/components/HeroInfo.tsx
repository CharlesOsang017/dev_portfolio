import { useState, useEffect } from 'react';

const HeroInfo = ({heroInfo}: any) => {
  const [projectCount, setProjectCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);

  useEffect(() => {
    const projectTarget = heroInfo?.projectsCompleted;
    const yearTarget = heroInfo?.yearsOfExperience;
    const duration = 2000; // 2 seconds
    const incrementTime = 50; // Update every 50ms

    const projectIncrement = projectTarget / (duration / incrementTime);
    const yearIncrement = yearTarget / (duration / incrementTime);

    let projectCurrent = 0;
    let yearCurrent = 0;

    const counter = setInterval(() => {
      projectCurrent += projectIncrement;
      yearCurrent += yearIncrement;

      if (projectCurrent >= projectTarget) {
        setProjectCount(projectTarget);
        setYearCount(yearTarget);
        clearInterval(counter);
      } else {
        setProjectCount(Math.ceil(projectCurrent));
        setYearCount(Math.ceil(yearCurrent));
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, []);

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
          transition: transform 0.3s ease;
        }
      `}</style>
      <div className="sm:px-6 md:px-20 px-20 md:mb-30 md:max-w-[69rem] bg-gradient-to-br from-zinc-800 to-gray-900 py-2 md:py-6 rounded-2xl animate-slide-up">
        <div className="max-w-3xl">
          <p className="text-sm sm:text-base md:text-lg text-gray-200">
            {/* Welcome! I'm Charles Osango, a professional software developer with a
            knack for crafting visually stunning and highly functional web
            applications. Combining my passion for coding with my love for design,
            I bring a unique blend of creativity and technical expertise to every
            project I undertake. */}
            {heroInfo?.heroDescription}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:justify-between items-center py-4 gap-6 sm:gap-4">
          <div className="flex px-12 gap-6 sm:gap-8">
            <div className="hover-scale">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                {projectCount}+
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">
                Projects completed
              </p>
            </div>
            <div className="hover-scale">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
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
