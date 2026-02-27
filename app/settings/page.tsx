"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Globe, Image as ImageIcon, Plus, Save, Search, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const [siteTitle, setSiteTitle] = useState("CORRAD+ UI");
  const [tagline, setTagline] = useState("Design system and admin standards.");
  const [titleFormat, setTitleFormat] = useState("%page% | %site%");
  const [metaDescription, setMetaDescription] = useState(
    "Internal UI standard and admin toolkit for CORRAD+.",
  );
  const [siteIconUrl, setSiteIconUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [timezone, setTimezone] = useState("asia_jakarta");
  const [language, setLanguage] = useState("en");

  const previewTitle = useMemo(
    () => titleFormat.replace("%page%", "Settings").replace("%site%", siteTitle || "Site"),
    [siteTitle, titleFormat],
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900">
      <header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4 text-sm text-slate-700">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900">CORRAD+ Admin</span>
          <span className="text-slate-400">/ Settings</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-600 hover:bg-slate-50">
            <Plus className="h-3.5 w-3.5" />
            New
          </button>
          <button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-48px)] flex-col md:flex-row">
        <aside className="w-full shrink-0 border-r border-slate-200 bg-white px-3 py-4 md:w-64">
          <nav className="space-y-1">
            <Link href="/" className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/" className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              UI Reference
            </Link>
            <Link
              href="/settings"
              className="block rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900"
            >
              Settings
            </Link>
          </nav>
        </aside>

        <main className="w-full p-4 md:p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
                <p className="text-muted-foreground">Edit site identity, browser icons, and SEO defaults.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="w-56 bg-white pl-8" placeholder="Search settings..." />
                </div>
                <Badge variant="secondary" className="h-fit">Route: /settings</Badge>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Identity</CardTitle>
                    <CardDescription>Core branding used across tabs, admin, and page titles.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="site-title">Site Title</Label>
                      <Input
                        id="site-title"
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                        placeholder="Your site name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Short site description"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="title-format">Page Title Format</Label>
                      <Input
                        id="title-format"
                        value={titleFormat}
                        onChange={(e) => setTitleFormat(e.target.value)}
                        placeholder="%page% | %site%"
                      />
                      <p className="text-xs text-muted-foreground">Use `%page%` and `%site%` placeholders.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Icon & Favicon</CardTitle>
                    <CardDescription>Configure browser tab icon and application/site icon.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="site-icon">Site Icon URL</Label>
                      <Input
                        id="site-icon"
                        value={siteIconUrl}
                        onChange={(e) => setSiteIconUrl(e.target.value)}
                        placeholder="https://example.com/icon-512.png"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="favicon">Favicon URL</Label>
                      <Input
                        id="favicon"
                        value={faviconUrl}
                        onChange={(e) => setFaviconUrl(e.target.value)}
                        placeholder="https://example.com/favicon.ico"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border bg-slate-50 p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Site Icon Preview</p>
                        <div className="flex h-16 w-16 items-center justify-center rounded border bg-white">
                          {siteIconUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={siteIconUrl} alt="Site icon preview" className="h-12 w-12 rounded object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg border bg-slate-50 p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Favicon Preview</p>
                        <div className="flex h-16 w-16 items-center justify-center rounded border bg-white">
                          {faviconUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={faviconUrl} alt="Favicon preview" className="h-8 w-8 rounded object-contain" />
                          ) : (
                            <Globe className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Meta Defaults</CardTitle>
                    <CardDescription>Global metadata fallback for pages without custom SEO.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="meta-description">Meta Description</Label>
                      <Textarea
                        id="meta-description"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Default meta description..."
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label>Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="id">Bahasa Indonesia</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Timezone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asia_jakarta">Asia/Jakarta</SelectItem>
                            <SelectItem value="asia_singapore">Asia/Singapore</SelectItem>
                            <SelectItem value="utc">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Settings className="h-4 w-4" />
                      Preview
                    </CardTitle>
                    <CardDescription>Live output from current settings values.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Tab Title</p>
                      <p className="mt-1 text-sm font-medium">{previewTitle}</p>
                    </div>
                    <div className="rounded-lg border bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Site Title</p>
                      <p className="mt-1 text-sm font-medium">{siteTitle || "-"}</p>
                    </div>
                    <div className="rounded-lg border bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Tagline</p>
                      <p className="mt-1 text-sm">{tagline || "-"}</p>
                    </div>
                    <div className="rounded-lg border bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Meta Description</p>
                      <p className="mt-1 text-sm">{metaDescription || "-"}</p>
                    </div>
                    <Button className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
