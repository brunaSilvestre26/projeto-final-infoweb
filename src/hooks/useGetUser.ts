import { supabase } from "@/supabase/supabase";
import { useQuery } from "@tanstack/react-query";

export const useGetUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  })
}


export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
}