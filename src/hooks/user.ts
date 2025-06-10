import { supabase } from "@/supabase/supabase";
import { useQuery } from "@tanstack/react-query";

export const useGetUserByIdQuery = (id:string) => {
  return useQuery({
    queryKey: ["userById", id],
    queryFn: () => getUserById(id),
  })
}

export const useGetRoleByIdQuery = (id:string) => {
  return useQuery({
    queryKey: ["roleById", id],
    queryFn: () => getRoleById(id),
  })
}

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

export const getUserById = async (id:string) => {
  const { data } = await supabase.from("user").select("*").eq("id",id).single();
  return data;
}

const getRoleById = async (id:string) => {
  const { data } = await supabase.from("role").select("*").eq("id",id).single();
  return data;
}


