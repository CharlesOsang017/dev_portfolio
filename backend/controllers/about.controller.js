import { v2 as cloudinary } from "cloudinary";
import About from "../models/about.model.js";
import { v4 as uuidv4 } from "uuid";
export const createAbout = async (req, res) => {
  try {
    const {
      heroImage,
      heroTitle,
      heroDescription,
      yearsOfExperience,
      projectsCompleted,
      aboutDescription,
      workImage,
    } = req.body;
    // upload heroImage and workImage to cloudinary
    let heroImageUrl = null;
    if (heroImage) {
      const uploadResponse = await cloudinary.uploader.upload(heroImage);
      // const uploadResponse = await cloudinary.uploader.upload(heroImage, {
      //   public_id: `heroImage_${uuidv4()}`, // Ensure unique public_id
      //   folder: "about_images", // Optional: organize in a folder
      // });
      heroImageUrl = uploadResponse.secure_url;
    }

    let workImageUrl = null;
    if (workImage) {
      const uploadResponse = await cloudinary.uploader.upload(workImage);
      // const uploadResponse = await cloudinary.uploader.upload(heroImage, {
      //   public_id: `heroImage_${uuidv4()}`, // Ensure unique public_id
      //   folder: "about_images", // Optional: organize in a folder
      // });
      workImageUrl = uploadResponse.secure_url;
    }
    const newAbout = await About.create({
      heroImage: heroImageUrl,
      heroTitle,
      heroDescription,
      yearsOfExperience,
      projectsCompleted,
      aboutDescription,
      workImage: workImageUrl,
    });
    await newAbout.save();
    return res
      .status(201)
      .json({ message: "About created successfully", newAbout });
  } catch (error) {
    console.log("error creating about", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateAbout = async (req, res) => {
  const {
    heroTitle,
    heroDescription,
    yearsOfExperience,
    projectsCompleted,
    aboutDescription,
  } = req.body;
  let { heroImage, workImage } = req.body;
  try {
    const { id } = req.params;
    const about = await About.findById(id);
    // Handle image upload
    if (heroImage) {
      if (about.heroImage) {
        const imageId = about.heroImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageId);
      }
      const uploadedResponse = await cloudinary.uploader.upload(heroImage);
      heroImage = uploadedResponse.secure_url;
    }

    if (workImage) {
      if (about.workImage) {
        const imageId = about.workImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageId);
      }
      const uploadedResponse = await cloudinary.uploader.upload(workImage);
      workImage = uploadedResponse.secure_url;
    }

    const updatedAbout = await About.findByIdAndUpdate(
      id,
      {
        heroImage,
        heroTitle,
        heroDescription,
        yearsOfExperience,
        projectsCompleted,
        aboutDescription,
        workImage,
      },
      { new: true }
    );
    return res.status(200).json(updatedAbout);
  } catch (error) {
    console.log("error updating about", error.message);
    return res.status(500).json({ message: error.message });
  }
};
