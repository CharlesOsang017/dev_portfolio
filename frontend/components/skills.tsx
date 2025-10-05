const Skills = () => {
  const skills = [
    {
      id: 1,
      title: "CSS",
      description: "User Interface",
      logo: "/images/css3.svg",
    },
    {
      id: 2,
      title: "Expressjs",
      description: "Node Framework",
      logo: "/images/expressjs.svg",
    },
    {
      id: 3,
      title: "Javascript",
      description: "Interaction",
      logo: "/images/javascript.svg",
    },
    {
      id: 4,
      title: "Mongo DB",
      description: "Database",
      logo: "/images/mongodb.svg",
    },
    {
      id: 5,
      title: "Nodejs",
      description: "Backend",
      logo: "/images/nodejs.svg",
    },
    {
      id: 6,
      title: "Figma",
      description: "Design",
      logo: "/images/figma.svg",
    },
  ];

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
        <div className="px-4 sm:px-6 md:px-8 mb-6 animate-slide-up">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
            Essential Tools I Use
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-2">
            Discover the powerful tools and technologies I use to create
            exceptional, high-performing websites and applications
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              className="flex gap-4 border border-slate-600 rounded-2xl p-4 hover:bg-transparent bg-gray-800 hover-scale animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="border border-slate-600 rounded-2xl p-2 flex-shrink-0">
                <img
                  width={30}
                  src={skill.logo}
                  alt={skill.title}
                  className="w-6 sm:w-8 md:w-10 h-auto"
                />
              </div>
              <div>
                <h4 className="ml-2 text-sm sm:text-base font-semibold text-white">
                  {skill.title}
                </h4>
                <p className="ml-2 text-xs sm:text-sm text-gray-400">
                  {skill.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Skills;