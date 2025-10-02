import Project from "../models/project.model.js";

export const createNewProject = async (req, res) => {
  try {
    const { title, technologies, image, link } = req.body;
    const newProject = await Project.create({
      title,
      technologies,
      image,
      link,
    });
    await newProject.save();
    return res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    console.log("error creating new project", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    return res.status(200).json(projects);
  } catch (error) {
    console.log("error getting projects", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log("error deleting project", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, technologies, image, link } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, technologies, image, link },
      { new: true }
    );
    return res.status(200).json(updatedProject);
  } catch (error) {
    console.log("error updating project", error.message);
    return res.status(500).json({ message: error.message });
  }
};
