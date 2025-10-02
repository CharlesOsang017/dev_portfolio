import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  // Animation variants ww
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <footer className='text-white py-12 px-4'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 gap-12'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left Side - Text and Image */}
          <motion.div className='space-y-6' variants={itemVariants}>
            <h2 className='text-xl text-center md:text-3xl font-bold'>
              Let's work together today
            </h2>
            <div className='relative ml-40 hidden md:block'>
              <img src='/images/logo.svg' alt='footer_logo' width={150} />
            </div>
          </motion.div>
          {/* Right Side - Sitemap and Socials */}
          <motion.div
            className='grid grid-cols-2 text-center sm:grid-cols-2 gap-8'
            variants={itemVariants}
          >
            {/* Sitemap */}
            <div>
              <h3 className='text-xl font-semibold mb-4'>Sitemap</h3>
              <ul className='space-y-2'>
                {[
                  { name: "Projects", href: "#projects" },
                  { name: "About", href: "#about" },
                  { name: "Home", href: "/" },
                  { name: "Skills", href: "#skills" },
                ].map((link) => (
                  <motion.li key={link.name} variants={itemVariants}>
                    <Link
                      href={link.href}
                      className='text-gray-300 hover:text-blue-400 hover:underline transition-colors'
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h3 className='text-xl font-semibold mb-4'>Socials</h3>
              <ul className='space-y-2'>
                {[
                  {
                    name: "Instagram",
                    href: "https://instagram.com/yourprofile",
                  },
                  {
                    name: "LinkedIn",
                    href: "https://linkedin.com/in/yourprofile",
                  },
                  {
                    name: "GitHub",
                    href: "https://github.com/username",
                  },
                  { name: "X", href: "https://x.com/yourprofile" },
                ].map((social) => (
                  <motion.li key={social.name} variants={itemVariants}>
                    <Link
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-300 hover:text-blue-400 hover:underline transition-colors'
                    >
                      {social.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Copyright */}
        <motion.div
          className=' mt-10 text-center text-gray-400'
          variants={itemVariants}
        >
          <p>
            &copy; {new Date().getFullYear()} Charles Osango. All rights
            reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
