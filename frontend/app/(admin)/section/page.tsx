"use client";
import { use, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetch-utils";



// const { } = useQueries({
//   queries: [
//     {
//       queryKey: ["experiences"],
//       queryFn: () => api.get("/experiences"), 

//     },
//     {
//       queryKey: ["about"],
//       queryFn: () => api.get("/about"),
//     },
//     {
//       queryKey: ["projects"],
//       queryFn: () => api.get("/projects"),
//     },
//     {
//       queryKey: ["skills"],
//       queryFn: () => api.get("/skills"),
//     },
//   ],
// })

// Dummy data
const dummyData = {
  experiences: [
    {
      _id: "1",
      company: "Tech Corp",
      role: "Software Engineer",
      startDate: "2020-01-01",
      endDate: "2022-12-31",
      description: "Developed web applications using React and Node.js.",
    },
    {
      _id: "2",
      company: "Data Inc",
      role: "Data Analyst",
      startDate: "2023-01-01",
      endDate: "2024-06-30",
      description: "Analyzed large datasets to drive business decisions.",
    },
  ],
  about: [
    {
      _id: "1",
      heroImage: "https://via.placeholder.com/150",
      workImage: "https://via.placeholder.com/150",
      heroTitle: "Welcome to My Portfolio",
      heroDescription:
        "I am a passionate developer with a focus on web technologies.",
      aboutDescription: "Experienced in building scalable applications.",
      projectsCompleted: 10,
      yearsOfExperience: 5,
    },
  ],
  projects: [
    {
      _id: "1",
      title: "E-Commerce Platform",
      technologies: ["React", "Node.js", "MongoDB"],
      link: "https://example.com",
      image: "https://via.placeholder.com/150",
    },
    {
      _id: "2",
      title: "Task Manager",
      technologies: ["Vue", "Express"],
      link: "",
      image: "https://via.placeholder.com/150",
    },
  ],
  skills: [
    {
      _id: "1",
      title: "JavaScript",
      description: "Interaction.",
      logo: "https://via.placeholder.com/50",
    },
    {
      _id: "2",
      title: "Python",
      description: "Backend.",
      logo: "https://via.placeholder.com/50",
    },
  ],
};

const Admin = () => {
  const [data, setData] = useState(dummyData);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'update', 'delete', or 'view'
  const [editData, setEditData] = useState(null);
  const [editSection, setEditSection] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle edit form changes

  const { data: skills, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async() => {
      const response = await api.get("/skill");
      return response.data;
    },  
  })
  

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditData((prev) => ({
        ...prev,
        [name]: files[0] || prev[name],
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle update submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (editSection === "experiences") {
      if (
        !editData.company ||
        !editData.role ||
        !editData.startDate ||
        !editData.endDate ||
        !editData.description
      ) {
        setError("All fields are required.");
        return;
      }
      const start = new Date(editData.startDate);
      const end = new Date(editData.endDate);
      if (start >= end) {
        setError("End date must be after start date.");
        return;
      }
    } else if (editSection === "about") {
      if (
        !editData.heroTitle ||
        !editData.heroDescription ||
        !editData.aboutDescription ||
        !editData.projectsCompleted ||
        !editData.yearsOfExperience
      ) {
        setError("All fields are required.");
        return;
      }
      if (isNaN(editData.projectsCompleted) || editData.projectsCompleted < 0) {
        setError("Projects Completed must be a valid number.");
        return;
      }
      if (isNaN(editData.yearsOfExperience) || editData.yearsOfExperience < 0) {
        setError("Years of Experience must be a valid number.");
        return;
      }
    } else if (editSection === "projects") {
      if (!editData.title || !editData.technologies) {
        setError("Title and technologies are required.");
        return;
      }
      const techArray = editData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech);
      if (techArray.length === 0) {
        setError("Please provide at least one technology.");
        return;
      }
      if (
        editData.link &&
        !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(editData.link)
      ) {
        setError("Please provide a valid URL for the link.");
        return;
      }
      editData.technologies = techArray; // Update technologies to array
    } else if (editSection === "skills") {
      if (!editData.title || !editData.description) {
        setError("All fields are required.");
        return;
      }
    }

    // Update data
    setData((prev) => ({
      ...prev,
      [editSection]: prev[editSection].map((item) =>
        item._id === editData._id ? { ...item, ...editData } : item
      ),
    }));
    setSuccess(`Successfully updated ${editSection}.`);
    setModalOpen(false);
    setEditData(null);
    setEditSection(null);
  };

  // Handle delete
  const handleDelete = () => {
    setData((prev) => ({
      ...prev,
      [editSection]: prev[editSection].filter(
        (item) => item._id !== editData._id
      ),
    }));
    setSuccess(`Successfully deleted ${editSection}.`);
    setModalOpen(false);
    setEditData(null);
    setEditSection(null);
  };

  // Open modal for specific action
  const openModal = (type, section, item) => {
    setModalType(type);
    setEditSection(section);
    setEditData({
      ...item,
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(", ")
        : item.technologies, // Convert array to string for input
    });
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  return (
    <div className='min-h-screen bg-gray-100 py-10 px-4'>
      <div className='max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Admin Dashboard</h2>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
        {success && (
          <p className='text-green-500 text-center mb-4'>{success}</p>
        )}

        {/* Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className='sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg'>
            {modalType === "update" && (
              <>
                <DialogHeader>
                  <DialogTitle>Edit {editSection}</DialogTitle>
                  <DialogDescription>
                    Update the details below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateSubmit} className='space-y-4'>
                  {editSection === "experiences" && (
                    <>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Company
                        </label>
                        <input
                          type='text'
                          name='company'
                          value={editData?.company || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Role
                        </label>
                        <input
                          type='text'
                          name='role'
                          value={editData?.role || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-xsm font-medium  text-gray-700'>
                          Start Date
                        </label>
                        <input
                          type='date'
                          name='startDate'
                          value={editData?.startDate || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          End Date
                        </label>
                        <input
                          type='date'
                          name='endDate'
                          value={editData?.endDate || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Description
                        </label>
                        <textarea
                          name='description'
                          value={editData?.description || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          rows='4'
                          required
                        />
                      </div>
                    </>
                  )}
                  {editSection === "about" && (
                    <>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Hero Image
                        </label>
                        <input
                          type='file'
                          name='heroImage'
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                          accept='image/jpeg,image/png,image/gif'
                        />
                        {editData?.heroImage && (
                          <img
                            src={editData.heroImage}
                            alt='Hero Preview'
                            className='mt-2 w-full h-40 object-cover rounded-md'
                          />
                        )}
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Work Image
                        </label>
                        <input
                          type='file'
                          name='workImage'
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                          accept='image/jpeg,image/png,image/gif'
                        />
                        {editData?.workImage && (
                          <img
                            src={editData.workImage}
                            alt='Work Preview'
                            className='mt-2 w-full h-40 object-cover rounded-md'
                          />
                        )}
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Hero Title
                        </label>
                        <input
                          type='text'
                          name='heroTitle'
                          value={editData?.heroTitle || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Hero Description
                        </label>
                        <textarea
                          name='heroDescription'
                          value={editData?.heroDescription || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          rows='4'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          About Description
                        </label>
                        <textarea
                          name='aboutDescription'
                          value={editData?.aboutDescription || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          rows='4'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Projects Completed
                        </label>
                        <input
                          type='number'
                          name='projectsCompleted'
                          value={editData?.projectsCompleted || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                          min='0'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Years of Experience
                        </label>
                        <input
                          type='number'
                          name='yearsOfExperience'
                          value={editData?.yearsOfExperience || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                          min='0'
                        />
                      </div>
                    </>
                  )}
                  {editSection === "projects" && (
                    <>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Title
                        </label>
                        <input
                          type='text'
                          name='title'
                          value={editData?.title || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Technologies (comma-separated)
                        </label>
                        <input
                          type='text'
                          name='technologies'
                          value={editData?.technologies || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Link
                        </label>
                        <input
                          type='url'
                          name='link'
                          value={editData?.link || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Image
                        </label>
                        <input
                          type='file'
                          name='image'
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                          accept='image/jpeg,image/png,image/gif'
                        />
                        {editData?.image && (
                          <img
                            src={editData.image}
                            alt='Project Preview'
                            className='mt-2 w-full h-40 object-cover rounded-md'
                          />
                        )}
                      </div>
                    </>
                  )}
                  {editSection === "skills" && (
                    <>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Title
                        </label>
                        <input
                          type='text'
                          name='title'
                          value={editData?.title || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Description
                        </label>
                        <textarea
                          name='description'
                          value={editData?.description || ""}
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                          rows='4'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Logo
                        </label>
                        <input
                          type='file'
                          name='logo'
                          onChange={handleEditChange}
                          className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                          accept='image/jpeg,image/png,image/gif'
                        />
                        {editData?.logo && (
                          <img
                            src={editData.logo}
                            alt='Logo Preview'
                            className='mt-2 w-32 h-32 object-contain rounded-md'
                          />
                        )}
                      </div>
                    </>
                  )}
                  <DialogFooter>
                    <button
                      type='submit'
                      className='py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    >
                      Update
                    </button>
                    <button
                      type='button'
                      onClick={() => setModalOpen(false)}
                      className='py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400'
                    >
                      Cancel
                    </button>
                  </DialogFooter>
                </form>
              </>
            )}
            {modalType === "delete" && (
              <>
                <DialogHeader>
                  <DialogTitle>Delete {editSection}</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this {editSection} entry?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    onClick={handleDelete}
                    className='py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className='py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400'
                  >
                    Cancel
                  </button>
                </DialogFooter>
              </>
            )}
            {modalType === "view" && (
              <>
                <DialogHeader>
                  <DialogTitle>View {editSection} Details</DialogTitle>
                  <DialogDescription>
                    Details of the selected entry.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  {editSection === "experiences" && (
                    <>
                      <p>
                        <strong>Company:</strong> {editData.company}
                      </p>
                      <p>
                        <strong>Role:</strong> {editData.role}
                      </p>
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(editData.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(editData.endDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Description:</strong> {editData.description}
                      </p>
                    </>
                  )}
                  {editSection === "about" && (
                    <>
                      <p>
                        <strong>Hero Title:</strong> {editData.heroTitle}
                      </p>
                      <p>
                        <strong>Hero Description:</strong>{" "}
                        {editData.heroDescription}
                      </p>
                      <p>
                        <strong>About Description:</strong>{" "}
                        {editData.aboutDescription}
                      </p>
                      <p>
                        <strong>Projects Completed:</strong>{" "}
                        {editData.projectsCompleted}
                      </p>
                      <p>
                        <strong>Years of Experience:</strong>{" "}
                        {editData.yearsOfExperience}
                      </p>
                      {editData.heroImage && (
                        <div>
                          <strong>Hero Image:</strong>
                          <img
                            src={editData.heroImage}
                            alt='Hero'
                            className='mt-2 w-full h-40 object-cover rounded-md'
                          />
                        </div>
                      )}
                      {editData.workImage && (
                        <div>
                          <strong>Work Image:</strong>
                          <img
                            src={editData.workImage}
                            alt='Work'
                            className='mt-2 w-full h-40 object-cover rounded-md'
                          />
                        </div>
                      )}
                    </>
                  )}
                  {editSection === "projects" && (
                    <>
                      <p>
                        <strong>Title:</strong> {editData.title}
                      </p>
                      <p>
                        <strong>Technologies:</strong>{" "}
                        {Array.isArray(editData.technologies)
                          ? editData.technologies.join(", ")
                          : editData.technologies}
                      </p>
                      <p>
                        <strong>Link:</strong>{" "}
                        {editData.link ? (
                          <a
                            href={editData.link}
                            className='text-blue-500 hover:underline'
                          >
                            {editData.link}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                      {editData.image && (
                        <div>
                          <strong>Image:</strong>
                          <img
                            src={editData.image}
                            alt='Project'
                            className='mt-2 w-full h-40 object-cover rounded-md'
                          />
                        </div>
                      )}
                    </>
                  )}
                  {editSection === "skills" && (
                    <>
                      <p>
                        <strong>Title:</strong> {editData.title}
                      </p>
                      <p>
                        <strong>Description:</strong> {editData.description}
                      </p>
                      {editData.logo && (
                        <div>
                          <strong>Logo:</strong>
                          <img
                            src={editData.logo}
                            alt='Skill Logo'
                            className='mt-2 w-32 h-32 object-contain rounded-md'
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                <DialogFooter>
                  <button
                    onClick={() => setModalOpen(false)}
                    className='py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400'
                  >
                    Close
                  </button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Experiences Table */}
        <div className='mb-8'>
          <h3 className='text-xl font-semibold mb-4'>Experiences</h3>
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 p-2'>Company</th>
                <th className='border border-gray-300 p-2'>Role</th>
                <th className='border border-gray-300 p-2'>Start Date</th>
                <th className='border border-gray-300 p-2'>End Date</th>
                <th className='border border-gray-300 p-2'>Description</th>
                <th className='border border-gray-300 p-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.experiences.map((exp) => (
                <tr key={exp._id}>
                  <td className='border border-gray-300 p-2'>{exp.company}</td>
                  <td className='border border-gray-300 p-2'>{exp.role}</td>
                  <td className='border border-gray-300 p-2'>
                    {new Date(exp.startDate).toLocaleDateString()}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {new Date(exp.endDate).toLocaleDateString()}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {exp.description}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className='h-5 w-5 text-gray-500 hover:text-gray-700' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => openModal("view", "experiences", exp)}
                          className='text-green-500'
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal("update", "experiences", exp)}
                          className='text-blue-500'
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal("delete", "experiences", exp)}
                          className='text-red-500'
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* About Table */}
        <div className='mb-8'>
          <h3 className='text-xl font-semibold mb-4'>About</h3>
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 p-2'>Hero Title</th>
                <th className='border border-gray-300 p-2'>Hero Description</th>
                <th className='border border-gray-300 p-2'>
                  About Description
                </th>
                <th className='border border-gray-300 p-2'>
                  Projects Completed
                </th>
                <th className='border border-gray-300 p-2'>
                  Years of Experience
                </th>
                <th className='border border-gray-300 p-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.about.map((item) => (
                <tr key={item._id}>
                  <td className='border border-gray-300 p-2'>
                    {item.heroTitle}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {item.heroDescription}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {item.aboutDescription}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {item.projectsCompleted}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {item.yearsOfExperience}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className='h-5 w-5 text-gray-500 hover:text-gray-700' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => openModal("view", "about", item)}
                          className='text-green-500'
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal("update", "about", item)}
                          className='text-blue-500'
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal("delete", "about", item)}
                          className='text-red-500'
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Projects Table */}
        <div className='mb-8'>
          <h3 className='text-xl font-semibold mb-4'>Projects</h3>
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 p-2'>Title</th>
                <th className='border border-gray-300 p-2'>Technologies</th>
                <th className='border border-gray-300 p-2'>Link</th>
                <th className='border border-gray-300 p-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map((project) => (
                <tr key={project._id}>
                  <td className='border border-gray-300 p-2'>
                    {project.title}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {Array.isArray(project.technologies)
                      ? project.technologies.join(", ")
                      : project.technologies}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {project.link ? (
                      <a
                        href={project.link}
                        className='text-blue-500 hover:underline'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Link
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className='h-5 w-5 text-gray-500 hover:text-gray-700' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => openModal("view", "projects", project)}
                          className='text-green-500'
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal("update", "projects", project)}
                          className='text-blue-500'
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal("delete", "projects", project)}
                          className='text-red-500'
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skills Table */}
        <div>
          <h3 className='text-xl font-semibold mb-4'>Skills</h3>
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 p-2'>Title</th>
                <th className='border border-gray-300 p-2'>Description</th>
                <th className='border border-gray-300 p-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills?.map((skill: any) => (
                <tr key={skill._id}>
                  <td className='border border-gray-300 p-2'>{skill.title}</td>
                  <td className='border border-gray-300 p-2'>
                    {skill.description}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className='h-5 w-5 text-gray-500 hover:text-gray-700' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => openModal("view", "skills", skill)}
                          className='text-green-500'
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal("update", "skills", skill)}
                          className='text-blue-500'
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal("delete", "skills", skill)}
                          className='text-red-500'
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;