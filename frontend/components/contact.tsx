import { GithubOutlined, LinkedinFilled, LinkedinOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const form = e.target;
    const formDataToSubmit = new FormData(form);

    try {
      const response = await fetch("https://getform.io/f/bolzwema", {
        method: "POST",
        body: formDataToSubmit,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
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
    <section className="text-white min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left Side - Contact Text */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.div
              className="text-center lg:text-left"
              variants={itemVariants}
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Contact me for collaboration
              </h1>
              <p className="text-lg text-white leading-relaxed">
                Reach out today to discuss your project needs and start collaborating on something amazing. 
                Whether it's a complex web application, innovative startup idea, or creative digital solution, 
                I'm here to bring your vision to life.
              </p>
            </motion.div>

            <motion.div
              className="flex space-x-4 justify-center lg:justify-start mt-8"
              variants={itemVariants}
            >
              <div className="text-center flex items-center  lg:text-left">       
                <Link className=" transition-colors w-24 h-24" href="">
                <LinkedinFilled  style={{ fontSize: '28px' }} />
                </Link>
              </div>
              <div className="text-center lg:text-left">            
                <GithubOutlined style={{ fontSize: '28px' }} />
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
            >
              <div className=" flex flex-col justify-center items-center lg:items-start rounded-lg mb-10 -mt-10 shadow-md">
                <h3 className="text-lg font-semibold text-white mb-3">What I can help you with:</h3>
                <ul className="space-y-2 text-white">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Full-stack web development
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    React & Next.js applications
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Node.js backend solutions
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Database design & integration
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            className="w-full max-w-md mx-auto lg:mx-0"
            variants={itemVariants}
          >
            <div className=" rounded-lg shadow-lg p-6 lg:p-8">
              <motion.h2
                className="text-2xl font-bold text-white mb-6 text-center"
                variants={itemVariants}
              >
                Let's Talk About Your Project
              </motion.h2>

              {submitStatus === "success" && (
                <motion.div
                  className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <p className="font-medium">Thank you! Your message has been sent successfully. I'll get back to you soon.</p>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <p className="font-medium">Oops! Something went wrong. Please try again.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  className="space-y-2"
                  variants={itemVariants}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  variants={itemVariants}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  variants={itemVariants}
                >
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-300 hover:bg-blue-400 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span className="text-black cursor-pointer">Send Message</span>
                    )}
                  </button>
                </motion.div>

                {/* Hidden input for Getform */}
                <input type="hidden" name="redirect" value="" />
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactPage;