import { api } from "@/lib/fetch-utils";
import { useQuery } from "@tanstack/react-query";
import { Experience } from "../types";


const useGetExperiences = ()=>{
    const { data: experiences, isLoading: isLoadingExperiences } = useQuery<Experience[]>({
        queryKey: ["experience"],
        queryFn: async () => {
          const response = await api.get("/experience");
          return response.data as Experience[];
        },
      });

      return { experiences, isLoadingExperiences };
    
}

export default useGetExperiences