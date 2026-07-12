const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadToCloudinary(
  file: File,
  folder?: string
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (folder) formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Gagal upload gambar");
  }

  return res.json();
}

export function cloudinaryUrl(
  publicId: string,
  opts?: { w?: number; h?: number; q?: number }
) {
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  const transforms = [];
  if (opts?.w) transforms.push(`w_${opts.w}`);
  if (opts?.h) transforms.push(`h_${opts.h}`);
  if (opts?.q) transforms.push(`q_${opts.q}`);
  transforms.push("f_auto"); // auto format (webp)
  return transforms.length
    ? `${base}/${transforms.join(",")}/${publicId}`
    : `${base}/${publicId}`;
}
