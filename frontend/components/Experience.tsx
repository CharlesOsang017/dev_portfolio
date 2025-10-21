import type { Experience } from "@/app/types";
import React from "react";

interface experienceProps {
  experiences: Experience[];
}

const Experience = ({ experiences }: experienceProps) => {
  // const experiences = [
  //   {
  //     id: 1,
  //     company: "Techcop Solutions",
  //     role: "Senior Full Stack Developer",
  //     startDate: new Date("2022-06-01"),
  //     endDate: new Date("2023-09-01"),
  //     description: [
  //       "Led development of a scalable e-commerce platform using React, Node.js, and MongoDB.",
  //       "Optimized application performance, reducing load times by 30%.",
  //       "Mentored junior developers and conducted code reviews to ensure quality.",
  //     ],
  //   },
  //   {
  //     id: 2,
  //     company: "Innovatex Labs",
  //     role: "Fronted Developer",
  //     startDate: new Date("2021-09-01"),
  //     endDate: new Date("2022-06-01"),
  //     description: [
  //       "Developed responsive web interfaces using React and Tailwind CSS.",
  //       "Implemented user authentication and authorization using Firebase.",
  //       "Optimized application performance, reducing load times by 30%.",
  //     ],
  //   },
  //   {
  //     id: 3,
  //     company: "StartUp Dynamics",
  //     role: "Junior Software developer",
  //     startDate: new Date("2020-09-01"),
  //     endDate: new Date("2021-06-01"),
  //     description: [
  //       "Developed responsive web interfaces using React and Tailwind CSS.",
  //       "Implemented user authentication and authorization using Firebase.",
  //       "Optimized application performance, reducing load times by 30%.",
  //     ],
  //   },
  // ];
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
      <div className='md:px-8 py-8 sm:py-12 md:py-16'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-8 text-center animate-slide-up'>
          <h3 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white'>
            Experience
          </h3>
          <p className='text-sm sm:text-base md:text-lg text-gray-300 mt-2 max-w-3xl mx-auto'>
            Explore my journey as a software developer, where I’ve built
            innovative solutions and collaborated with talented teams to deliver
            impactful projects.
          </p>
        </div>
        <div className='max-w-6xl mx-auto sm:px-6 md:px-8 relative'>
          {experiences?.map((experience) => (
            <div key={experience._id}>
              <div className='timeline-line' />
              <div className='flex flex-col gap-6 m-6 sm:gap-8'>
                <div
                  className='relative flex flex-col gap-4  border border-slate-600 rounded-2xl p-4 sm:p-6 ml-12 sm:ml-16 hover-scale animate-slide-up'
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className='timeline-dot' />
                  <div className='w-full'>
                    <h4 className='text-base sm:text-lg md:text-xl font-semibold text-white'>
                      {/* Senior Full-Stack Developer */}
                      {experience.role}
                    </h4>
                    <p className='text-sm sm:text-base text-gray-300'>
                      {/* TechCorp Solutions */}
                      {experience.company}
                    </p>
                    <p className='text-xs sm:text-sm text-gray-400'>
                      {new Date(experience.startDate).toLocaleDateString()} –{" "}
                      {new Date(experience.endDate).toLocaleDateString()}
                    </p>
                    <div className='mt-2 text-sm sm:text-base text-gray-200'>
                      {typeof experience.description === "string" ? (
                        <ul className='list-disc list-inside'>
                          <li>{experience.description}</li>
                        </ul>
                      ) : (
                        experience.description?.map((desc, index) => (
                          <ul key={index} className='list-disc list-inside'>
                            <li>{desc}</li>
                          </ul>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Experience;
