import Skill from "../models/skill.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createNewSkill = async (req, res) => {
  try {
    const { title, description, logo } = req.body;
    let imgUrl;
    if (logo) {
      const uploadResponse = await cloudinary.uploader.upload(logo);
      imgUrl = uploadResponse.secure_url; // Use the uploaded image URL
    }
    const newSkill = await Skill.create({
      title,
      description,
      logo: imgUrl,
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
    const skill = await Skill.findById(id);
    // delete logo in the cloudinary
    if (skill.logo) {
      const imgId = skill.logo.split("/").pop().split(".")[0]; // Extract Cloudinary image ID
      await cloudinary.uploader.destroy(imgId);
    }
    await Skill.findByIdAndDelete(id);
    return res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.log("error deleting skill", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// export const updateSkill = async (req, res) => {
//   const { id } = req.params;
//   const { title, description, logo } = req.body;
//   try {
//     const skill = await Skill.findById(id);
//     // Handle image upload
//     if (logo) {
//       if (skill.logo) {
//         const imageId = skill.logo.split("/").pop().split(".")[0];
//         await cloudinary.uploader.destroy(imageId);
//       }
//       const uploadedResponse = await cloudinary.uploader.upload(logo);
//       logo = uploadedResponse.secure_url;
//     }
//     // update fields
//     skill.title = title || skill.title;
//     skill.description = description || skill.description;
//     skill.logo = logo || skill.logo

//     skill.save()

//     return res.status(200).json({message: "Skill updated successfully!"});
//   } catch (error) {
//     console.log("error updating skill", error.message);
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const updateSkill = async (req, res) => {
//   try {
//     const { title, description, logo } = req.body;
//     const { id } = req.params;
//     const skill = await Skill.findById(id);

//     // Handle file upload
//     if (logo) {
//       // Delete existing logo from Cloudinary if it exists
//       if (skill.logo) {
//         const imageId = skill.logo.split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(imageId);
//       }

//     // Update fields (use existing values if new ones are undefined)
//     skill.title = title || skill.title;
//     skill.description = description || skill.description;
//     skill.logo = logo || skill.logo;

//     await skill.save();

//     return res.status(200).json({ message: 'Skill updated successfully!' });
//   } catch (error) {
//     console.error('Error updating skill:', error.message);
//     return res.status(500).json({ message: error.message });
//   }
// }

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);
    const { title, description, logo } = req.body;
    // Handle image upload
    let imageUrl = null;
    if (logo) {
      if (skill.logo) {
        const imageId = skill.logo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageId);
      }

      const uploadedResponse = await cloudinary.uploader.upload(logo);
      imageUrl = uploadedResponse.secure_url;
    }

    // update fields
    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { title, description, logo: imageUrl },
      { new: true }
    );

   
    return res.status(200).json(updatedSkill);
  } catch (error) {
    console.log("error updating skill", error.message);
    return res.status(500).json({ message: error.message });
  }
};
