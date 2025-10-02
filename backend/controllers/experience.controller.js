import Experience from "../models/experience.model.js";

export const createExperience = async (req, res) => {
  try {
    const { role, company, startDate, endDate, description } = req.body;
    const newExperience = await Experience.create({
      role,
      company,
      startDate,
      endDate,
      description,
    });
    await newExperience.save();
    return res.status(201).json({ message: "Experience created successfully" });
  } catch (error) {
    console.log("error creating experience", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const allExperience = async (req, res) => {
  try {
    const allExperience = await Experience.find({});
    return res.status(200).json(allExperience);
  } catch (error) {
    console.log("error getting all experience", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    await Experience.findByIdAndDelete(id);
    return res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.log("error deleting experience", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, company, startDate, endDate, description } = req.body;
    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      { role, company, startDate, endDate, description },
      { new: true }
    );
    return res.status(200).json(updatedExperience);
  } catch (error) {
    console.log("error updating experience", error.message);
    return res.status(500).json({ message: error.message });
  }
};
