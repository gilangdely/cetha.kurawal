import { adminDb } from "@/app/lib/firebase-admin";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^a-z0-9-]/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export function extractYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // match patterns like v=ID or youtu.be/ID
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

export async function ensureUniqueSlug(baseSlug: string, currentDocId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const snapshot = await adminDb
      .collection("contents")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      isUnique = true;
    } else {
      // If the found doc is the same as we are editing, it's fine
      const docId = snapshot.docs[0].id;
      if (currentDocId && docId === currentDocId) {
        isUnique = true;
      } else {
        counter++;
        slug = `${baseSlug}-${counter}`;
      }
    }
  }

  return slug;
}
