// app/[locale]/admin/landing/page.tsx
import { Link } from "@/i18n/navigation";
import { mockPages } from "@/lib/admin/mock";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const sections = [
  {
    id: "hero",
    name: "Hero Section",
    key: "home.hero",
    description: "Headline utama & CTA di landing page.",
    enabled: true,
  },
  {
    id: "advantages",
    name: "Advantages",
    key: "home.advantages",
    description: "Daftar keunggulan utama Cetha.",
    enabled: true,
  },
  {
    id: "how-it-works",
    name: "How It Works",
    key: "home.howItWorks",
    description: "Step-by-step cara kerja Cetha.",
    enabled: true,
  },
  {
    id: "cv-upgrade",
    name: "CV Upgrade",
    key: "home.cvUpgrade",
    description: "Section upgrade CV dengan contoh.",
    enabled: true,
  },
  {
    id: "improve-linkedin",
    name: "Improve LinkedIn",
    key: "home.improveLinkedin",
    description: "Section untuk fitur LinkedIn helper.",
    enabled: true,
  },
  {
    id: "cta",
    name: "Call To Action",
    key: "home.cta",
    description: "Ajakan terakhir sebelum footer.",
    enabled: true,
  },
];

function fmt(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString();
}

export default function AdminLandingPage() {
  const landingPages = mockPages.filter((p) =>
    ["/", "/pricing", "/about-us", "/review-cv"].some((slug) =>
      p.slug.includes(slug.replace("/", "")),
    ),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Landing Sections</h1>
          <p className="text-muted-foreground text-sm">
            Atur urutan & status section di landing page (dummy mode).
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/pages">Kelola Konten Halaman</Link>
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Sections Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {sections.filter((s) => s.enabled).length}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              Semua section utama saat ini aktif.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Landing Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {landingPages.map((p) => (
              <div
                key={p.id}
                className="bg-muted/30 flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{p.title}</div>
                  <div className="text-muted-foreground text-xs">
                    /{p.slug} • Updated {fmt(p.updatedAt)}
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Catatan
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm">
            <p>
              Area ini masih{" "}
              <span className="text-foreground font-medium">dummy</span>.
            </p>
            <p>
              Ke depannya setting di sini bisa terhubung ke Firestore untuk
              menyusun layout landing page secara dinamis tanpa deploy.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Section Ordering & Visibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Urutan</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">Tampil</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section, index) => (
                <TableRow key={section.id}>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    #{index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{section.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {section.key}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {section.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <Switch
                        checked={section.enabled}
                        onCheckedChange={() =>
                          alert(
                            "Dummy: toggle visibility belum tersambung backend.",
                          )
                        }
                      />
                      <span className="text-muted-foreground text-xs">
                        {section.enabled ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-muted-foreground mt-3 text-xs">
            Untuk saat ini perubahan tidak akan disimpan. Ini hanya tampilan
            awal untuk diskusi struktur CMS landing page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
