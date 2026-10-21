import { supabase } from "../lib/supabase";

export async function getDoctors() {
  const { error, data } = await supabase
    .from("doctors")
    .select("*")
  if (error) throw error

  return data
}