import { api } from "@/lib/fetch-utils";
import { Skill } from "../types";
import { useQuery } from "@tanstack/react-query";

const useGetSkills = ()=>{
    const { data: skills, isLoading: isLoadingSkills } = useQuery<Skill[]>({
        queryKey: ["skill"],
        queryFn: async () => {
          const response = await api.get("/skill");
          return response.data as Skill[];
        },
      });

      return { skills, isLoadingSkills };
}

export default useGetSkills