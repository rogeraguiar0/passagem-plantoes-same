import { supabase } from "../lib/supabase";

export async function getSectors() {
  const { error, data } = await supabase
    .from("sectors")
    .select("*")
  if (error) throw error

  return data
}