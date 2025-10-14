"use client";
import { ArrowDownToLine, Download, Wifi } from "lucide-react";
import { Button } from "./ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import HeroInfo from "./HeroInfo";
import Skills from "./skills";
import Experience from "./Experience";
import Projects from "./Projects";
import ContactPage from "./contact";
import Footer from "./Footer";
import heroImage from "../public/images/hero-banner.png";
import workImage from "../public/images/avatar-1.jpg";
import Image from "next/image";
import useGetSkills from "@/app/hooks/use-skills";
import useGetExperiences from "@/app/hooks/use-experiences";
import useGetProjects from "@/app/hooks/use-projects";
import useGetAbout from "@/app/hooks/use-about";
// import { useGetSkills } from "@/app/hooks/use-skills";
// import { useGetExperiences } from "@/app/hooks/use-experiences";
// import { useGetProjects } from "@/app/hooks/use-projects";
// import { useGetAbout } from "@/app/hooks/use-about";

const Hero = () => {
  // Refs for each section
  const heroRef = useRef(null);
  const heroInfoRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Scroll-triggered animation for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Hook to detect when sections are in view
  const heroInfoInView = useInView(heroInfoRef, { once: true, margin: "-100px" });
  const skillsInView = useInView(skillsRef, { once: true, margin: "-100px" });
  const experienceInView = useInView(experienceRef, { once: true, margin: "-100px" });
  const projectsInView = useInView(projectsRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });

  // Fetch data using custom hooks
  const { skills, isLoadingSkills } = useGetSkills();
  const { experiences, isLoadingExperiences } = useGetExperiences();
  const { projects, isLoadingProjects } = useGetProjects();
  const { aboutInfo, isLoadingAbout } = useGetAbout();

  // Fallback images
  const defaultWorkImage = workImage;
  const defaultHeroImage = heroImage;

  return (
    <div>
      <section
        ref={heroRef}
        id="home"
        className="relative gap-y-50 flex flex-col lg:flex-row items-center justify-between min-h-screen py-16 px-25 bg-gradient-to-br from-gray-900 text-white overflow-hidden"
      >
        {/* Left Content */}
        <motion.div
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg space-y-6 z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile and Status */}
          <motion.div className="flex items-center space-x-4" variants={childVariants}>
            {isLoadingAbout ? (
              <div className="w-[60px] h-[60px] bg-gray-700 rounded-full animate-pulse" />
            ) : (
              aboutInfo?.workImage && (
                <Image
                  height={60}
                  width={60}
                  src={aboutInfo.workImage || defaultWorkImage}
                  alt={aboutInfo?.heroTitle || "Profile image"}
                  className="rounded-full border-2 border-indigo-400 shadow-lg"
                />
              )
            )}
            <Wifi size={32} className="text-green-400 animate-pulse" />
            <h4 className="text-lg font-medium text-gray-200">Available for work</h4>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-lg md:text-5xl lg:text-3xl font-bold tracking-tight leading-tight"
            variants={childVariants}
          >
            {isLoadingAbout ? "Loading..." : aboutInfo?.heroTitle || "Crafting Scalable Websites"}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-gray-300 text-base md:text-lg max-w-md"
            variants={childVariants}
          >
            {isLoadingAbout
              ? "Loading description..."
              : aboutInfo?.heroDescription ||
                "I build high-performance, user-focused web experiences."}
          </motion.p>

          {/* Buttons */}
          <motion.div className="flex space-x-4" variants={childVariants}>
            <Button
              className="bg-cyan-500 hover:bg-cyan-400 font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center space-x-2"
              asChild
            >
              <a href="/Musera_Charles.pdf" download>
                Download CV <Download className="ml-2" size={20} />
              </a>
            </Button>
            <Button
              variant="outline"
              className="text-gray-600 cursor-pointer font-semibold py-3 px-2 rounded-full transition-all duration-300 flex items-center"
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
            >
              Scroll Down <ArrowDownToLine className="ml-2" size={20} />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="mt-12 lg:mt-0 lg:ml-12 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {isLoadingAbout ? (
            <div className="w-[400px] h-[400px] bg-gray-700 rounded-lg animate-pulse" />
          ) : (
            aboutInfo?.heroImage && (
              <Image
                src={aboutInfo.heroImage || defaultHeroImage}
                width={350}
                height={0}
                alt="Illustration of a modern web development workflow"
                className="rounded-lg image-containe shadow-2xl bg-gradient-to-b from-gray-900 to-cyan-700 transform hover:scale-105 transition-transform duration-500"
              />
            )
          )}
        </motion.div>
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Animated Sections */}
      <motion.div
        ref={heroInfoRef}
        id="about"
        variants={sectionVariants}
        initial="hidden"
        animate={heroInfoInView ? "visible" : "hidden"}
      >
        <HeroInfo aboutInfo={aboutInfo} />
      </motion.div>
      <motion.div
        ref={skillsRef}
        id="skills"
        variants={sectionVariants}
        initial="hidden"
        animate={skillsInView ? "visible" : "hidden"}
      >
        <Skills skills={skills} />
      </motion.div>
      <motion.div
        ref={experienceRef}
        id="experience"
        variants={sectionVariants}
        initial="hidden"
        animate={experienceInView ? "visible" : "hidden"}
      >
        <Experience experiences={experiences} />
      </motion.div>
      <motion.div
        ref={projectsRef}
        id="projects"
        variants={sectionVariants}
        initial="hidden"
        animate={projectsInView ? "visible" : "hidden"}
      >
        <Projects projects={projects} />
      </motion.div>
      <motion.div
        ref={contactRef}
        id="contact"
        variants={sectionVariants}
        initial="hidden"
        animate={contactInView ? "visible" : "hidden"}
      >
        <ContactPage />
      </motion.div>
      <Footer />
    </div>
  );
};

export default Hero;