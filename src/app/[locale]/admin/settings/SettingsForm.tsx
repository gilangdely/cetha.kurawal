"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function SettingsForm() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Site Settings</h1>
          <p className="text-sm text-muted-foreground">
            Pengaturan global untuk brand, SEO, dan integrasi (dummy mode).
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() =>
            alert("Dummy: pengaturan belum tersambung backend.")
          }
        >
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Brand & Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  defaultValue="Cetha"
                  placeholder="Nama brand"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-tagline">Tagline</Label>
                <Input
                  id="site-tagline"
                  defaultValue="AI Career Copilot"
                  placeholder="Tagline singkat"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-color">
                Primary Color (Tailwind token)
              </Label>
              <Input
                id="primary-color"
                defaultValue="blue-600"
                placeholder="Mis. blue-600"
              />
              <p className="text-xs text-muted-foreground">
                Dummy field. Ke depan bisa dipakai untuk generate theme Tailwind
                secara dinamis.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                defaultValue="support@cetha.ai"
                placeholder="Email dukungan"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status & Keamanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Maintenance Mode</div>
                <p className="text-xs text-muted-foreground">
                  Saat aktif, user publik akan melihat halaman maintenance.
                </p>
              </div>
              <Switch
                checked={false}
                onCheckedChange={() =>
                  alert(
                    "Dummy: toggle maintenance belum tersambung backend.",
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Require Login for Beta</div>
                <p className="text-xs text-muted-foreground">
                  Kunci fitur eksperimental hanya untuk user tertentu.
                </p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={() =>
                  alert("Dummy: toggle beta access belum tersambung backend.")
                }
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Semua pengaturan di atas masih dummy dan belum menyimpan data
              apapun. Fokus ke tampilan & struktur terlebih dahulu.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Default SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-title">Default Meta Title</Label>
              <Input
                id="default-title"
                defaultValue="Cetha - AI Career Copilot"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-description">
                Default Meta Description
              </Label>
              <Textarea
                id="default-description"
                defaultValue="Cetha membantu kamu upgrade CV, profil LinkedIn, dan menemukan pekerjaan impian dengan bantuan AI."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-image">Default Share Image URL</Label>
              <Input
                id="default-image"
                defaultValue="https://cetha.ai/og-image.png"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Integrasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ga-id">Google Analytics ID</Label>
              <Input id="ga-id" placeholder="G-XXXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-pixel">Meta Pixel ID</Label>
              <Input id="meta-pixel" placeholder="XXXXXXXXXXXXXXX" />
            </div>
            <p className="text-xs text-muted-foreground">
              Nilai di atas hanya contoh. Nanti bisa dihubungkan ke environment
              variable atau Firestore config khusus.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
