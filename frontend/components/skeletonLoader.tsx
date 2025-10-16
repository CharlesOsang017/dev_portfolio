// components/SkeletonLoader.jsx
import React from "react";

const SkeletonLoader = ({ type = "text", className = "" }) => {
  const baseStyle = "animate-pulse bg-gray-700 rounded";

  const styles = {
    image: `w-[60px] h-[60px] rounded-full ${baseStyle}`,
    heroImage: `w-[350px] h-[400px] rounded-lg ${baseStyle}`,
    text: `h-6 w-3/4 ${baseStyle}`,
    headline: `h-10 w-1/2 ${baseStyle}`,
    button: `h-10 w-32 ${baseStyle}`,
  };

  return <div className={`${styles[type]} ${className}`} />;
};

export default SkeletonLoader;