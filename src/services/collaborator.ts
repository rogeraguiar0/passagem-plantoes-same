import { supabase } from "../lib/supabase";

export async function getCollaborators() {
  const { data, error } = await supabase
    .from("collaborators")
    .select("id, name")
    .eq("active", true)
  if (error) throw error

  return data
}