import { api } from "@/lib/fetch-utils";
import { useQuery } from "@tanstack/react-query";
import { About } from "../types";

const useGetAbout = ()=>{
    const { data: aboutInfo, isLoading: isLoadingAbout } = useQuery<About>({
        queryKey: ["aboutInfo"],
        queryFn: async () => {
          const response = await api.get("/about");
          return response.data as About;
        },
      });
      return { aboutInfo, isLoadingAbout };
}

export default useGetAbout