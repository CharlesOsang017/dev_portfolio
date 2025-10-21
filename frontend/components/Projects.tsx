import { MoveUpRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import project1 from "../public/images/project-1.jpg";
import project2 from "../public/images/project-2.jpg";
import project3 from "../public/images/project-3.jpg";
import project4 from "../public/images/project-4.jpg";
import project5 from "../public/images/project-5.jpg";
import project6 from "../public/images/project-6.jpg";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Project } from "@/app/types";

interface projectProps {
  projects: Project[];
}
const Projects = ({ projects }: projectProps) => {
 
  //   {
  //     id: 1,
  //     title: "School Management System",
  //     technologies: ["React", "Node.js", "MongoDB"],
  //     image: project1,
  //     link: "https://github.com/username/project-1",
  //   },
  //   {
  //     id: 2,
  //     title: "Chronos",
  //     technologies: ["Express", "Node.js", "Nextjs"],
  //     image: project2,
  //     link: "https://github.com/username/project-2",
  //   },
  //   {
  //     id: 3,
  //     title: "Pewesha",
  //     technologies: ["SQL", "Node.js", "MongoDB"],
  //     image: project3,
  //     link: "https://github.com/username/project-3",
  //   },
  //   {
  //     id: 4,
  //     title: "Kiko Pay",
  //     technologies: ["Mongoose", "FastAPI", "MongoDB"],
  //     image: project4,
  //     link: "https://github.com/username/project-4",
  //   },
  //   {
  //     id: 5,
  //     title: "School Management",
  //     technologies: ["Python", "Node.js", "Mongoose"],
  //     image: project5,
  //     link: "https://github.com/username/project-5",
  //   },
  //   {
  //     id: 6,
  //     title: "School Management System",
  //     technologies: ["React", "Node.js", "MongoDB"],
  //     image: project6,
  //     link: "https://github.com/username/project-6",
  //   },
  // ];

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section className='min-h-screen py-16 px-4 flex flex-col items-center'>
      <motion.h1
        className='text-4xl md:text-5xl font-bold text-white mb-12'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Projects
      </motion.h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 max-w-6xl w-full'>
        {projects?.map((project, index) => (
          <motion.div
            key={project._id}
            className='bg-gray-700 text-white  rounded-lg shadow-lg overflow-hidden flex flex-col'
            variants={cardVariants}
            initial='hidden'
            animate='visible'
            custom={index}
          >
            {/* Image Section */}
            {project.image && (
              <div className='relative w-full h-48'>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className='object-cover'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
                <motion.div
                  className='absolute inset-0 bg-opacity-0 hover:bg-opacity-20'
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
            {/* Content Section */}
            <div className='flex flex-col flex-grow'>
              <div className='flex items-center justify-between mb-2'>
                <h2 className='text-lg font-semibold text-white'>
                  {project.title}
                </h2>
                <motion.a
                  href={project.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`View ${project.title} on GitHub`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className='text-white font-semibold px-4 rounded-full transition-all duration-300 flex items-center space-x-2'
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='bg-zinc-800 text-white rounded-md p-1'>
                        <MoveUpRight className='w-5 h-5 text-white  transition-colors' />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>View Live Demo</TooltipContent>
                  </Tooltip>
                </motion.a>
              </div>
              <div className='flex flex-wrap gap-2 mb-4'>
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className='text-xs text-gray-200 bg-gray-500 rounded-full px-3 py-1'
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
