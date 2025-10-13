import { api } from "@/lib/fetch-utils";
import { useQuery } from "@tanstack/react-query";
import { Project } from "../types";

const useGetProjects = () => {
  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["project"],
    queryFn: async () => {
      const response = await api.get("/project");
      return response.data as Project[];
    },
  });
  return { projects, isLoadingProjects };
};

export default useGetProjects;
