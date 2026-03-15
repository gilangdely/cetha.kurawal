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

export type TransactionStatus = "success" | "pending" | "failed";

export type Transaction = {
  id: string;
  user: string;
  plan: string;
  amount: number; // IDR
  status: TransactionStatus;
  createdAt: string; // ISO string
};

// ── Pages ────────────────────────────────────────────────────────────────────
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

// ── Transactions ─────────────────────────────────────────────────────────────
export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    user: "Budi Santoso",
    plan: "Pro Monthly",
    amount: 99000,
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "txn_002",
    user: "Sari Dewi",
    plan: "Pro Yearly",
    amount: 899000,
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "txn_003",
    user: "Ahmad Fauzi",
    plan: "Pro Monthly",
    amount: 99000,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "txn_004",
    user: "Rina Kusuma",
    plan: "Pro Yearly",
    amount: 899000,
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "txn_005",
    user: "Deni Prasetyo",
    plan: "Pro Monthly",
    amount: 99000,
    status: "failed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

const successTxns = mockTransactions.filter((t) => t.status === "success");

export const mockFinanceStats = {
  totalTransactions: mockTransactions.length,
  successTransactions: successTxns.length,
  pendingTransactions: mockTransactions.filter((t) => t.status === "pending")
    .length,
  failedTransactions: mockTransactions.filter((t) => t.status === "failed")
    .length,
  totalRevenue: successTxns.reduce((sum, t) => sum + t.amount, 0),
};