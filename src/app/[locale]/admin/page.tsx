// app/[locale]/admin/page.tsx
import { Link } from "@/i18n/navigation";
import { mockStats, mockPages } from "@/lib/admin/mock";
import { StatsCard } from "@/components/admin/stats-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function fmt(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString();
}

export default function AdminDashboardPage() {
  const recent = mockPages
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan konten & aktivitas CMS (dummy).
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/pages">Manage Pages</Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/admin/pages/new">New Page</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Pages" value={mockStats.pagesTotal} />
        <StatsCard
          title="Published"
          value={mockStats.pagesPublished}
          hint="Live di website"
        />
        <StatsCard
          title="Draft"
          value={mockStats.pagesDraft}
          hint="Belum tayang"
        />
        <StatsCard title="Last Updated" value={fmt(mockStats.lastUpdated)} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <Button variant="ghost" asChild>
            <Link href="/admin/pages">See all</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {recent.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  Updated by {p.updatedBy} • {fmt(p.updatedAt)}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/pages/${p.slug}`}>Edit</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

