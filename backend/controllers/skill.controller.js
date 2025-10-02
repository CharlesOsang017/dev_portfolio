import Skill from "../models/skill.model.js";

export const createNewSkill = async (req, res) => {
  try {
    const { title, percentage, category } = req.body;
    const newSkill = await Skill.create({
      title,
      percentage,
      category,
    });
    await newSkill.save();
    return res.status(201).json({ message: "Skill created successfully" });
  } catch (error) {
    console.log("error creating new skill", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const allSkills = async (req, res) => {
  try {
    const allSkills = await Skill.find({});
    return res.status(200).json(allSkills);
  } catch (error) {
    console.log("error getting all skills", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSkill = await Skill.findByIdAndDelete(id);
    return res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.log("error deleting skill", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, percentage, category } = req.body;
    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { title, percentage, category },
      { new: true }
    );
    return res.status(200).json(updatedSkill);
  } catch (error) {
    console.log("error updating skill", error.message);
    return res.status(500).json({ message: error.message });
  }
};
