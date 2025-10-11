"use client";
import { useState } from "react";
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
import { MoreHorizontal, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetch-utils";
import { toast } from "sonner";

// Utility function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Define TypeScript interfaces for data structures
interface Skill {
  _id: string;
  title: string;
  description: string;
  logo?: string;
}

interface Project {
  _id: string;
  title: string;
  technologies: string[] | string; // Allow string for form input
  link?: string;
  image?: string;
}

interface Experience {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface About {
  _id: string;
  heroImage?: string;
  workImage?: string;
  heroTitle: string;
  heroDescription: string;
  aboutDescription: string;
  projectsCompleted: number;
  yearsOfExperience: number;
}

// Discriminated union for editData
type EditData =
  | { section: "skill"; data: Skill }
  | { section: "project"; data: Project }
  | { section: "experience"; data: Experience }
  | { section: "aboutInfo"; data: About }
  | { section: null; data: null };

type ModalType = "update" | "delete" | "view" | null;
type SectionType = "skill" | "project" | "experience" | "aboutInfo" | null;

// Loader Component
const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
    </div>
  </div>
);

const Admin = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editData, setEditData] = useState<EditData>({ section: null, data: null });
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});

  const queryClient = useQueryClient();

  // Fetch data using useQuery
  const { data: skills, isLoading: isLoadingSkills } = useQuery<Skill[]>({
    queryKey: ["skill"],
    queryFn: async () => {
      const response = await api.get("/skill");
      return response.data as Skill[];
    },
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["project"],
    queryFn: async () => {
      const response = await api.get("/project");
      return response.data as Project[];
    },
  });

  const { data: experiences, isLoading: isLoadingExperiences } = useQuery<Experience[]>({
    queryKey: ["experience"],
    queryFn: async () => {
      const response = await api.get("/experience");
      return response.data as Experience[];
    },
  });

  const { data: aboutInfo, isLoading: isLoadingAbout } = useQuery<About>({
    queryKey: ["about"],
    queryFn: async () => {
      const response = await api.get("/about");
      return response.data as About;
    },
  });

  // Check if any query is loading
  const isLoading = isLoadingSkills || isLoadingProjects || isLoadingExperiences || isLoadingAbout;

  // Mutation for updating data
  const updateMutation = useMutation({
    mutationFn: async ({
      section,
      id,
      data,
    }: {
      section: SectionType;
      id: string;
      data: Skill | Project | Experience | About;
    }) => {
      if (!section) throw new Error("Section is required");
      const endpoint = section === "aboutInfo" ? "about" : section;
      return api.put(`/${endpoint}/${id}`, data);
    },
    onSuccess: (_, { section }) => {
      toast.success(`Successfully updated ${section}.`);
      queryClient.invalidateQueries({ queryKey: [section] });
      setModalOpen(false);
      setEditData({ section: null, data: null });
      setImagePreviews({});
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || `Failed to update ${editData.section}.`;
      toast.error(errorMessage);
    },
  });

  // Mutation for deleting data
  const deleteMutation = useMutation({
    mutationFn: async ({ section, id }: { section: SectionType; id: string }) => {
      if (!section) throw new Error("Section is required");
      return api.delete(`/${section}/${id}`);
    },
    onSuccess: (_, { section }) => {
      toast.success(`Successfully deleted ${section}.`);
      queryClient.invalidateQueries({ queryKey: [section] });
      setModalOpen(false);
      setEditData({ section: null, data: null });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || `Failed to delete ${editData.section}.`;
      toast.error(errorMessage);
    },
  });

  // Handle edit form changes
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files[0]) {
      fileToBase64(files[0])
        .then((base64) => {
          setEditData((prev) => ({
            ...prev,
            data: prev.data ? { ...prev.data, [name]: base64 } : prev.data,
          }));
          setImagePreviews((prev) => ({
            ...prev,
            [name]: URL.createObjectURL(files[0]),
          }));
        })
        .catch((error) => {
          console.error("Error converting file to base64:", error);
          toast.error("Failed to process image file");
        });
    } else {
      setEditData((prev) => ({
        ...prev,
        data: prev.data
          ? {
              ...prev.data,
              [name]:
                name === "projectsCompleted" || name === "yearsOfExperience"
                  ? Number(value)
                  : value,
            }
          : prev.data,
      }));
    }
  };

  // Handle clearing image previews
  const handleClearImage = (fieldName: string) => {
    setEditData((prev) => ({
      ...prev,
      data: prev.data ? { ...prev.data, [fieldName]: undefined } : prev.data,
    }));
    setImagePreviews((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  // Handle update submission
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editData.section || !editData.data) return;

    // Basic validation
    if (editData.section === "experience") {
      const data = editData.data as Experience;
      if (
        !data.company ||
        !data.role ||
        !data.startDate ||
        !data.endDate ||
        !data.description
      ) {
        toast.error("All fields are required.");
        return;
      }
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start >= end) {
        toast.error("End date must be after start date.");
        return;
      }
    } else if (editData.section === "aboutInfo") {
      const data = editData.data as About;
      if (
        !data.heroTitle ||
        !data.heroDescription ||
        !data.aboutDescription ||
        data.projectsCompleted === undefined ||
        data.yearsOfExperience === undefined
      ) {
        toast.error("All fields are required.");
        return;
      }
      if (data.projectsCompleted < 0) {
        toast.error("Projects Completed must be a non-negative number.");
        return;
      }
      if (data.yearsOfExperience < 0) {
        toast.error("Years of Experience must be a non-negative number.");
        return;
      }
    } else if (editData.section === "project") {
      const data = editData.data as Project;
      if (!data.title || !data.technologies) {
        toast.error("Title and technologies are required.");
        return;
      }
      const techArray = typeof data.technologies === "string"
        ? data.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech)
        : data.technologies;
      if (techArray.length === 0) {
        toast.error("Please provide at least one technology.");
        return;
      }
      if (
        data.link &&
        !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(data.link)
      ) {
        toast.error("Please provide a valid URL for the link.");
        return;
      }
      data.technologies = techArray; // Update technologies to array
    } else if (editData.section === "skill") {
      const data = editData.data as Skill;
      if (!data.title || !data.description) {
        toast.error("All fields are required.");
        return;
      }
    }

    updateMutation.mutate({
      section: editData.section,
      id: editData.data._id,
      data: editData.data,
    });
  };

  // Handle delete
  const handleDelete = () => {
    if (!editData.section || !editData.data) return;
    deleteMutation.mutate({
      section: editData.section,
      id: editData.data._id,
    });
  };

  // Open modal for specific action
  const openModal = (
    type: ModalType,
    section: "skills" | "projects" | "experiences" | "aboutInfo",
    item: Skill | Project | Experience | About
  ) => {
    const sectionMap: { [key: string]: SectionType } = {
      skills: "skill",
      projects: "project",
      experiences: "experience",
      aboutInfo: "aboutInfo",
    };

    const normalizedSection = sectionMap[section] || section;

    let data: Skill | Project | Experience | About;

    if (normalizedSection === "project") {
      data = {
        ...item,
        technologies: Array.isArray((item as Project).technologies)
          ? (item as Project).technologies.join(", ")
          : (item as Project).technologies || "",
      } as Project;
    } else {
      data = { ...item };
    }

    setModalType(type);
    setEditData({
      section: normalizedSection,
      data,
    });
    setImagePreviews({
      heroImage: normalizedSection === "aboutInfo" ? (item as About).heroImage || null : null,
      workImage: normalizedSection === "aboutInfo" ? (item as About).workImage || null : null,
      image: normalizedSection === "project" ? (item as Project).image || null : null,
      logo: normalizedSection === "skill" ? (item as Skill).logo || null : null,
    });
    setModalOpen(true);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={`min-h-screen bg-gray-100 py-10 px-4 ${isLoading ? 'opacity-50' : ''}`}>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>

          {/* Modal */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
              {modalType === "update" && editData.section && (
                <>
                  <DialogHeader>
                    <DialogTitle>Edit {editData.section}</DialogTitle>
                    <DialogDescription>
                      Update the details below.
                    </DialogDescription>
                  </DialogHeader>
                  {editData.section === "aboutInfo" && editData.data ? (
                    <div className="max-h-[70vh] overflow-y-auto space-y-4">
                      <form onSubmit={handleUpdateSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Hero Image
                          </label>
                          <input
                            type="file"
                            name="heroImage"
                            onChange={handleEditChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            accept="image/jpeg,image/png,image/gif"
                          />
                          {imagePreviews.heroImage && (
                            <div className="relative">
                              <X
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => handleClearImage("heroImage")}
                                aria-label="Clear Hero Image"
                              />
                              <img
                                src={imagePreviews.heroImage}
                                alt="Hero Preview"
                                className="mt-2 w-full h-40 object-cover rounded-md"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Work Image
                          </label>
                          <input
                            type="file"
                            name="workImage"
                            onChange={handleEditChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            accept="image/jpeg,image/png,image/gif"
                          />
                          {imagePreviews.workImage && (
                            <div className="relative">
                              <X
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => handleClearImage("workImage")}
                                aria-label="Clear Work Image"
                              />
                              <img
                                src={imagePreviews.workImage}
                                alt="Work Preview"
                                className="mt-2 w-full h-40 object-cover rounded-md"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Hero Title
                          </label>
                          <input
                            type="text"
                            name="heroTitle"
                            value={(editData.data as About).heroTitle || ""}
                            onChange={handleEditChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Hero Description
                          </label>
                          <textarea
                            name="heroDescription"
                            value={(editData.data as About).heroDescription || ""}
                            onChange={handleEditChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            rows={4}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            About Description
                          </label>
                          <textarea
                            name="aboutDescription"
                            value={(editData.data as About).aboutDescription || ""}
                            onChange={handleEditChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            rows={4}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Projects Completed
                          </label>
                          <input
                            type="number"
                            name="projectsCompleted"
                            value={(editData.data as About).projectsCompleted ?? ""}
                            onChange={handleEditChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Years of Experience
                          </label>
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={(editData.data as About).yearsOfExperience ?? ""}
                            onChange={handleEditChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="0"
                          />
                        </div>
                        <DialogFooter>
                          <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className={`py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              updateMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {updateMutation.isPending ? "Updating..." : "Update"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </DialogFooter>
                      </form>
                    </div>
                  ) : (
                    editData.section === "aboutInfo" && !editData.data && (
                      <p>No data available</p>
                    )
                  )}
                  {editData.section === "experience" && editData.data && (
                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={(editData.data as Experience).company || ""}
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <input
                          type="text"
                          name="role"
                          value={(editData.data as Experience).role || ""}
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={(editData.data as Experience).startDate || ""}
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={(editData.data as Experience).endDate || ""}
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={(editData.data as Experience).description || ""}
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          rows={4}
                          required
                        />
                      </div>
                      <DialogFooter>
                        <button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className={`py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            updateMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {updateMutation.isPending ? "Updating..." : "Update"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </DialogFooter>
                    </form>
                  )}
                  {editData.section === "project" && editData.data && (
                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={(editData.data as Project).title || ""}
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Technologies (comma-separated)
                        </label>
                        <input
                          type="text"
                          name="technologies"
                          value={
                            typeof (editData.data as Project).technologies === "string"
                              ? (editData.data as Project).technologies
                              : (editData.data as Project).technologies.join(", ") || ""
                          }
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Link
                        </label>
                        <input
                          type="url"
                          name="link"
                          value={(editData.data as Project).link || ""}
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Image
                        </label>
                        <input
                          type="file"
                          name="image"
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                          accept="image/jpeg,image/png,image/gif"
                        />
                        {imagePreviews.image && (
                          <div className="relative">
                            <X
                              className="absolute top-2 right-2 cursor-pointer"
                              onClick={() => handleClearImage("image")}
                              aria-label="Clear Project Image"
                            />
                            <img
                              src={imagePreviews.image}
                              alt="Project Preview"
                              className="mt-2 w-full h-40 object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className={`py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            updateMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {updateMutation.isPending ? "Updating..." : "Update"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </DialogFooter>
                    </form>
                  )}
                  {editData.section === "skill" && editData.data && (
                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={(editData.data as Skill).title || ""}
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={(editData.data as Skill).description || ""}
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          rows={4}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Logo
                        </label>
                        <input
                          type="file"
                          name="logo"
                          onChange={handleEditChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                          accept="image/jpeg,image/png,image/gif"
                        />
                        {imagePreviews.logo && (
                          <div className="relative">
                            <X
                              className="absolute top-2 right-2 cursor-pointer"
                              onClick={() => handleClearImage("logo")}
                              aria-label="Clear Skill Logo"
                            />
                            <img
                              src={imagePreviews.logo}
                              alt="Skill Logo"
                              className="mt-2 w-32 h-32 object-contain rounded-md"
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className={`py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            updateMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {updateMutation.isPending ? "Updating..." : "Update"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </DialogFooter>
                    </form>
                  )}
                </>
              )}
              {modalType === "delete" && editData.section && (
                <>
                  <DialogHeader>
                    <DialogTitle>Delete {editData.section}</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this {editData.section} entry? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <button
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className={`py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        deleteMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </DialogFooter>
                </>
              )}
              {modalType === "view" && editData.section && (
                <>
                  <DialogHeader>
                    <DialogTitle>View {editData.section} Details</DialogTitle>
                    <DialogDescription>
                      Details of the selected entry.
                    </DialogDescription>
                  </DialogHeader>
                  {editData.section === "aboutInfo" && editData.data ? (
                    <div className="max-h-[70vh] overflow-y-auto space-y-4">
                      <div className="space-y-4">
                        <p>
                          <strong>Hero Title:</strong> {(editData.data as About).heroTitle || "N/A"}
                        </p>
                        <p>
                          <strong>Hero Description:</strong>{" "}
                          {(editData.data as About).heroDescription || "N/A"}
                        </p>
                        <p>
                          <strong>About Description:</strong>{" "}
                          {(editData.data as About).aboutDescription || "N/A"}
                        </p>
                        <p>
                          <strong>Projects Completed:</strong>{" "}
                          {(editData.data as About).projectsCompleted ?? "N/A"}
                        </p>
                        <p>
                          <strong>Years of Experience:</strong>{" "}
                          {(editData.data as About).yearsOfExperience ?? "N/A"}
                        </p>
                        {(editData.data as About).heroImage && (
                          <div>
                            <strong>Hero Image:</strong>
                            <img
                              src={(editData.data as About).heroImage}
                              alt="Hero Preview"
                              className="mt-2 w-full h-40 object-cover rounded-md"
                            />
                          </div>
                        )}
                        {(editData.data as About).workImage && (
                          <div>
                            <strong>Work Image:</strong>
                            <img
                              src={(editData.data as About).workImage}
                              alt="Work Preview"
                              className="mt-2 w-full h-40 object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <button
                          onClick={() => setModalOpen(false)}
                          className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                        >
                          Close
                        </button>
                      </DialogFooter>
                    </div>
                  ) : (
                    editData.section === "aboutInfo" && !editData.data && (
                      <p>No data available</p>
                    )
                  )}
                  {editData.section === "experience" && editData.data && (
                    <div className="space-y-4">
                      <p>
                        <strong>Company:</strong> {(editData.data as Experience).company || "N/A"}
                      </p>
                      <p>
                        <strong>Role:</strong> {(editData.data as Experience).role || "N/A"}
                      </p>
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date((editData.data as Experience).startDate).toLocaleDateString() || "N/A"}
                      </p>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {new Date((editData.data as Experience).endDate).toLocaleDateString() || "N/A"}
                      </p>
                      <p>
                        <strong>Description:</strong> {(editData.data as Experience).description || "N/A"}
                      </p>
                      <DialogFooter>
                        <button
                          onClick={() => setModalOpen(false)}
                          className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                        >
                          Close
                        </button>
                      </DialogFooter>
                    </div>
                  )}
                  {editData.section === "project" && editData.data && (
                    <div className="space-y-4">
                      <p>
                        <strong>Title:</strong> {(editData.data as Project).title || "N/A"}
                      </p>
                      <p>
                        <strong>Technologies:</strong>{" "}
                        {typeof (editData.data as Project).technologies === "string"
                          ? (editData.data as Project).technologies
                          : (editData.data as Project).technologies.join(", ") || "N/A"}
                      </p>
                      <p>
                        <strong>Link:</strong>{" "}
                        {(editData.data as Project).link ? (
                          <a
                            href={(editData.data as Project).link}
                            className="text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {(editData.data as Project).link}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                      {(editData.data as Project).image && (
                        <div>
                          <strong>Image:</strong>
                          <img
                            src={(editData.data as Project).image}
                            alt="Project Preview"
                            className="mt-2 w-full h-40 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <DialogFooter>
                        <button
                          onClick={() => setModalOpen(false)}
                          className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                        >
                          Close
                        </button>
                      </DialogFooter>
                    </div>
                  )}
                  {editData.section === "skill" && editData.data && (
                    <div className="space-y-4">
                      <p>
                        <strong>Title:</strong> {(editData.data as Skill).title || "N/A"}
                      </p>
                      <p>
                        <strong>Description:</strong> {(editData.data as Skill).description || "N/A"}
                      </p>
                      {(editData.data as Skill).logo && (
                        <div>
                          <strong>Logo:</strong>
                          <img
                            src={(editData.data as Skill).logo}
                            alt="Skill Logo"
                            className="mt-2 w-32 h-32 object-contain rounded-md"
                          />
                        </div>
                      )}
                      <DialogFooter>
                        <button
                          onClick={() => setModalOpen(false)}
                          className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                        >
                          Close
                        </button>
                      </DialogFooter>
                    </div>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Experiences Table */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Experiences</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Company</th>
                  <th className="border border-gray-300 p-2">Role</th>
                  <th className="border border-gray-300 p-2">Start Date</th>
                  <th className="border border-gray-300 p-2">End Date</th>
                  <th className="border border-gray-300 p-2">Description</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiences?.map((exp) => (
                  <tr key={exp._id}>
                    <td className="border border-gray-300 p-2">{exp.company}</td>
                    <td className="border border-gray-300 p-2">{exp.role}</td>
                    <td className="border border-gray-300 p-2">
                      {new Date(exp.startDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(exp.endDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-2">{exp.description}</td>
                    <td className="border border-gray-300 p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => openModal("view", "experiences", exp)}
                            className="text-green-500"
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("update", "experiences", exp)}
                            className="text-blue-500"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("delete", "experiences", exp)}
                            className="text-red-500"
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
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">About</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Hero Title</th>
                  <th className="border border-gray-300 p-2">Hero Description</th>
                  <th className="border border-gray-300 p-2">About Description</th>
                  <th className="border border-gray-300 p-2">Projects Completed</th>
                  <th className="border border-gray-300 p-2">Years of Experience</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {aboutInfo ? (
                  <tr>
                    <td className="border border-gray-300 p-2">{aboutInfo.heroTitle || "N/A"}</td>
                    <td className="border border-gray-300 p-2">{aboutInfo.heroDescription || "N/A"}</td>
                    <td className="border border-gray-300 p-2">{aboutInfo.aboutDescription || "N/A"}</td>
                    <td className="border border-gray-300 p-2">{aboutInfo.projectsCompleted ?? "N/A"}</td>
                    <td className="border border-gray-300 p-2">{aboutInfo.yearsOfExperience ?? "N/A"}</td>
                    <td className="border border-gray-300 p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => openModal("view", "aboutInfo", aboutInfo)}
                            className="text-green-500"
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("update", "aboutInfo", aboutInfo)}
                            className="text-blue-500"
                          >
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="border border-gray-300 p-2 text-center">
                      No About data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Projects Table */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Projects</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Title</th>
                  <th className="border border-gray-300 p-2">Technologies</th>
                  <th className="border border-gray-300 p-2">Link</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects?.map((project) => (
                  <tr key={project._id}>
                    <td className="border border-gray-300 p-2">{project.title}</td>
                    <td className="border border-gray-300 p-2">
                      {typeof project.technologies === "string"
                        ? project.technologies
                        : project.technologies.join(", ")}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {project.link ? (
                        <a
                          href={project.link}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => openModal("view", "projects", project)}
                            className="text-green-500"
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("update", "projects", project)}
                            className="text-blue-500"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("delete", "projects", project)}
                            className="text-red-500"
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
            <h3 className="text-xl font-semibold mb-4">Skills</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Title</th>
                  <th className="border border-gray-300 p-2">Description</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills?.map((skill) => (
                  <tr key={skill._id}>
                    <td className="border border-gray-300 p-2">{skill.title}</td>
                    <td className="border border-gray-300 p-2">{skill.description}</td>
                    <td className="border border-gray-300 p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => openModal("view", "skills", skill)}
                            className="text-green-500"
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("update", "skills", skill)}
                            className="text-blue-500"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("delete", "skills", skill)}
                            className="text-red-500"
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
    </>
  );
};

export default Admin;