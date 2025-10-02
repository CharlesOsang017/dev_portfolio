import Project from "../models/project.model.js";

export const createNewProject = async (req, res) => {
  try {
    const { title, technologies, image, link } = req.body;

    let ImageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(thumbnail);
      ImageUrl = uploadResponse.secure_url;
    }

    const newProject = await Project.create({
      title,
      technologies,
      image: ImageUrl,
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
    const project = await Project.findById(req.params.id);
    // Delete the image from cloudinary
    if (project.image) {
      const imgId = project.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Project.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log("error deleting project", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const { title, technologies, link } = req.body;
    let {image }= req.body;
    
    // Handle image upload
    if (image) {
      if (project.image) {
        const imageId = project.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageId);
      }

      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }
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
