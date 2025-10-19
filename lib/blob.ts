import { put, del } from '@vercel/blob';

export async function uploadImage(file: File, filename: string): Promise<string> {
  const blob = await put(filename, file, {
    access: 'public',
  });

  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  await del(url);
}

export function getImageFilename(originalName: string): string {
  const timestamp = Date.now();
  const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `esolrine-${timestamp}-${sanitized}`;
}
