import type { PickedMedia } from '@/services/media';

export type UploadedMedia = { url: string; publicId?: string; resourceType: 'image' | 'video' | 'raw'; name: string; mimeType: string; size?: number; duration?: number };

// Cloudinary's unsigned upload endpoint is used only for shared media. Firebase Storage is never used.
// Create an unsigned upload preset and set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and
// EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env. Without these values, media sending is disabled.
export async function uploadMedia(file: PickedMedia): Promise<UploadedMedia> {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) throw new Error('Media uploads are not configured yet.');
  const resourceType = file.mimeType.startsWith('image/') ? 'image' : file.mimeType.startsWith('video/') ? 'video' : 'raw';
  const body = new FormData();
  body.append('file', { uri: file.uri, name: file.name, type: file.mimeType } as any);
  body.append('upload_preset', uploadPreset);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { method: 'POST', body });
  if (!response.ok) throw new Error(`Media upload failed (${response.status}).`);
  const data = await response.json() as { secure_url: string; public_id?: string; bytes?: number; duration?: number };
  return { url: data.secure_url, publicId: data.public_id, resourceType, name: file.name, mimeType: file.mimeType, size: data.bytes || file.size, duration: data.duration || file.duration };
}
