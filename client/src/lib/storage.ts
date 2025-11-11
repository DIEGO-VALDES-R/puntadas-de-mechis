/**
 * Storage utility for uploading files to S3
 */

export async function storagePut(
  key: string,
  data: File | Blob | string,
  contentType?: string
): Promise<{ url: string; key: string }> {
  // Call the backend API to upload the file
  const formData = new FormData();
  formData.append("key", key);
  formData.append("file", data);
  if (contentType) {
    formData.append("contentType", contentType);
  }

  const response = await fetch("/api/storage/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const result = await response.json();
  return result;
}

export async function storageGet(key: string, expiresIn?: number): Promise<{ url: string; key: string }> {
  const response = await fetch("/api/storage/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, expiresIn }),
  });

  if (!response.ok) {
    throw new Error("Failed to get storage URL");
  }

  const result = await response.json();
  return result;
}
