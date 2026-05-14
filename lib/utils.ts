// lib/utils.ts
export async function validateImageUrl(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok && res.headers.get("content-type")?.startsWith("image");
  } catch {
    return false;
  }
}
