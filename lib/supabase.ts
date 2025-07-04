import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;
  return data;
};

export const uploadFile = async (file: File, folder: string) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const path = `${folder}/${fileName}`;

  await uploadImage(file, "chatbot", path);

  return getImageUrl("chatbot", path);
};

export const getImageUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Error deleting file from Supabase:", error);
    throw error;
  }
  return data;
};
