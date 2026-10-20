import { supabase } from "../lib/supabase";

export async function getHealthInsurance() {
  const { error, data } = await supabase
    .from("health_insurances")
    .select("*")
  if (error) throw error

  return data
}