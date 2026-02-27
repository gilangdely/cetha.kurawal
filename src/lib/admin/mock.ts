// lib/admin/mock.ts
export type CmsStatus = "draft" | "published";

export type CmsPage = {
  id: string;
  title: string;
  slug: string;
  status: CmsStatus;
  updatedAt: string; // ISO string (dummy)
  updatedBy: string;
};

export const mockPages: CmsPage[] = [
  {
    id: "1",
    title: "About Cetha",
    slug: "about",
    status: "published",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedBy: "Gilang",
  },
  {
    id: "2",
    title: "Pricing",
    slug: "pricing",
    status: "draft",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedBy: "Gilang",
  },
  {
    id: "3",
    title: "FAQ",
    slug: "faq",
    status: "published",
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedBy: "Gilang",
  },
  {
    id: "4",
    title: "Terms of Service",
    slug: "terms",
    status: "draft",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedBy: "Gilang",
  },
];

export const mockStats = {
  pagesTotal: mockPages.length,
  pagesDraft: mockPages.filter((p) => p.status === "draft").length,
  pagesPublished: mockPages.filter((p) => p.status === "published").length,
  lastUpdated: mockPages
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.updatedAt,
};