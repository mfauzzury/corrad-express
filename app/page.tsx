"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  Eye,
  FileText,
  Gauge,
  Image,
  Info,
  MessageSquare,
  Pencil,
  Plug,
  Plus,
  Settings2,
  Search,
  Settings,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";

function StandardSection({
  id,
  title,
  description,
  preview,
  variants,
  states,
  doText,
  dontText,
}: {
  id: string;
  title: string;
  description: string;
  preview: ReactNode;
  variants: ReactNode;
  states: ReactNode;
  doText: string;
  dontText: string;
}) {
  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
          <div className="rounded-lg border bg-muted/25 p-4">{preview}</div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Variants</p>
          <div className="rounded-lg border bg-background p-4">{variants}</div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">States</p>
          <div className="rounded-lg border bg-background p-4">{states}</div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            <p className="mb-1 font-semibold">Do</p>
            <p>{doText}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="mb-1 font-semibold">Don&apos;t</p>
            <p>{dontText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UiStandardPage() {
  const [selectValue, setSelectValue] = useState("active");
  const [dropdownStatus, setDropdownStatus] = useState("published");
  const [showMeta, setShowMeta] = useState(true);
  const [page, setPage] = useState(2);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Posts: true,
    Media: true,
    Pages: false,
    Comments: false,
    Appearance: false,
    Plugins: false,
    Tools: false,
  });

  const totalItems = 48;
  const itemsPerPage = 10;
  const totalPages = useMemo(() => Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage]);
  const adminMenu: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    children?: Array<{ label: string; href: string }>;
  }> = [
    { label: "Dashboard", icon: Gauge, href: "#" },
    {
      label: "Posts",
      icon: FileText,
      href: "#overview",
      children: [
        { label: "All Posts", href: "#overview" },
        { label: "Add New", href: "#buttons" },
        { label: "Categories", href: "#badges" },
        { label: "Tags", href: "#inputs" },
      ],
    },
    {
      label: "Media",
      icon: Image,
      href: "#table",
      children: [
        { label: "Library", href: "#table" },
        { label: "Add New", href: "#dialog" },
      ],
    },
    {
      label: "Pages",
      icon: FileText,
      href: "#tabs",
      children: [
        { label: "All Pages", href: "#tabs" },
        { label: "Add New", href: "#select" },
      ],
    },
    {
      label: "Comments",
      icon: MessageSquare,
      href: "#tooltip",
      children: [{ label: "Moderation Queue", href: "#tooltip" }],
    },
    {
      label: "Appearance",
      icon: Settings2,
      href: "#tokens",
      children: [
        { label: "Themes", href: "#tokens" },
        { label: "Menus", href: "#pagination" },
      ],
    },
    {
      label: "Plugins",
      icon: Plug,
      href: "#dropdown",
      children: [
        { label: "Installed Plugins", href: "#dropdown" },
        { label: "Add Plugin", href: "#dialog" },
      ],
    },
    { label: "Users", icon: Users, href: "#table" },
    {
      label: "Tools",
      icon: Wrench,
      href: "#inputs",
      children: [{ label: "Import / Export", href: "#inputs" }],
    },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];
  const sectionLinks = [
    { id: "overview", label: "Overview" },
    { id: "tokens", label: "Color & Typography" },
    { id: "buttons", label: "Buttons" },
    { id: "badges", label: "Badges" },
    { id: "inputs", label: "Inputs" },
    { id: "select", label: "Select" },
    { id: "tabs", label: "Tabs" },
    { id: "dialog", label: "Dialog" },
    { id: "dropdown", label: "Dropdown" },
    { id: "tooltip", label: "Tooltip" },
    { id: "table", label: "Table" },
    { id: "pagination", label: "Pagination" },
  ];
  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900">
      <header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4 text-sm text-slate-700">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900">CORRAD+ Admin</span>
          <span className="text-slate-400">/ UI Standard</span>
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
          <nav className="grid grid-cols-1 gap-1">
            {adminMenu.map((item) => (
              <div key={item.label} className="rounded-md">
                {item.children && item.children.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    aria-expanded={Boolean(openMenus[item.label])}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1">{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openMenus[item.label] ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                )}
                {item.children && item.children.length > 0 ? (
                  <div
                    className={`space-y-0.5 border-t border-slate-100 bg-slate-50 px-2 py-1.5 ${
                      openMenus[item.label] ? "block" : "hidden"
                    }`}
                  >
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block rounded px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 md:mt-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Quick Jump</p>
            <div className="space-y-1">
              {sectionLinks.map((link) => (
                <a key={link.id} href={`#${link.id}`} className="block text-sm text-slate-600 hover:text-slate-900">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <main className="w-full p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">UI Standard Reference</h1>
                <p className="text-muted-foreground">Single-source guideline for all new UI implementation.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="w-64 bg-white pl-8" placeholder="Search section..." />
                </div>
                <Badge variant="secondary" className="h-fit">Route: /</Badge>
              </div>
            </div>

            <section className="space-y-6 min-w-0">
          <Card id="overview" className="scroll-mt-24">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Rules for applying this guide consistently across new pages.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="mb-2 text-sm font-semibold">Usage rules</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>1. Use existing `components/ui` primitives first.</li>
                  <li>2. Keep labels explicit and action-oriented.</li>
                  <li>3. Always include loading, empty, and error states.</li>
                  <li>4. Validate accessibility before shipping.</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <p className="mb-2 text-sm font-semibold">Naming conventions</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>1. Use semantic labels: `Save changes`, not `Submit`.</li>
                  <li>2. Use consistent status terms: `Draft`, `Published`, `Archived`.</li>
                  <li>3. Keep page sections predictable: Header, Filters, Content, Actions.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card id="tokens" className="scroll-mt-24">
            <CardHeader>
              <CardTitle>Color & Typography</CardTitle>
              <CardDescription>Current tokens from `app/globals.css` used in this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: "primary", bg: "var(--primary)", fg: "var(--primary-foreground)" },
                  { name: "secondary", bg: "var(--secondary)", fg: "var(--secondary-foreground)" },
                  { name: "accent", bg: "var(--accent)", fg: "var(--accent-foreground)" },
                  { name: "destructive", bg: "var(--destructive)", fg: "white" },
                ].map((swatch) => (
                  <div key={swatch.name} className="rounded-lg border p-3">
                    <div className="h-16 rounded-md border" style={{ background: swatch.bg, color: swatch.fg }} />
                    <p className="mt-2 text-sm font-medium">{swatch.name}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="text-3xl font-semibold">Heading / 30-36px</p>
                  <p className="mt-1 text-muted-foreground">For page titles and section hierarchy.</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-base">Body / 14-16px</p>
                  <p className="mt-1 text-sm text-muted-foreground">For labels, descriptions, and table values.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <StandardSection
            id="buttons"
            title="Buttons"
            description="Primary actions, secondary actions, and low-emphasis actions."
            preview={
              <div className="flex flex-wrap gap-2">
                <Button>Save changes</Button>
                <Button variant="outline">Cancel</Button>
                <Button variant="secondary">Preview</Button>
                <Button variant="destructive">Delete</Button>
                <Button variant="ghost">More</Button>
              </div>
            }
            variants={
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button variant="link">Link style</Button>
              </div>
            }
            states={
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button aria-invalid>Invalid</Button>
              </div>
            }
            doText="Use one clear primary CTA per section, then fallback actions as outline/ghost."
            dontText="Do not place multiple competing primary buttons side by side."
          />

          <StandardSection
            id="badges"
            title="Badges"
            description="Compact status indicators for records and chips."
            preview={
              <div className="flex flex-wrap gap-2">
                <Badge>Published</Badge>
                <Badge variant="secondary">Draft</Badge>
                <Badge variant="outline">Archived</Badge>
                <Badge variant="destructive">Rejected</Badge>
              </div>
            }
            variants={
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            }
            states={
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Active</Badge>
                <span className="text-sm text-muted-foreground">Use text + badge for clarity.</span>
              </div>
            }
            doText="Use badges for short statuses and keep wording consistent across screens."
            dontText="Do not use badge color alone to communicate meaning; include readable text."
          />

          <StandardSection
            id="inputs"
            title="Inputs, Label, Textarea"
            description="Baseline form controls for data capture."
            preview={
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="ref-title">Title</Label>
                  <Input id="ref-title" placeholder="Enter title" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ref-slug">Slug</Label>
                  <Input id="ref-slug" placeholder="my-first-post" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="ref-note">Description</Label>
                  <Textarea id="ref-note" placeholder="Write short description..." />
                </div>
              </div>
            }
            variants={
              <div className="grid gap-3 md:grid-cols-3">
                <Input placeholder="Default" />
                <Input disabled placeholder="Disabled" />
                <Input aria-invalid defaultValue="invalid@email" />
              </div>
            }
            states={
              <div className="space-y-2 text-sm">
                <div className="rounded border p-2">Default: editable and readable.</div>
                <div className="rounded border p-2">Invalid: set `aria-invalid` and show error message nearby.</div>
                <div className="rounded border p-2">Disabled: non-editable for unavailable fields.</div>
              </div>
            }
            doText="Pair every input with a clear label and nearby validation message."
            dontText="Do not rely on placeholder text as the only field label."
          />

          <StandardSection
            id="select"
            title="Select"
            description="Controlled choice field for categorical values."
            preview={
              <div className="max-w-sm">
                <Label htmlFor="ref-status" className="mb-1 block">Status</Label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger id="ref-status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
            variants={
              <div className="flex flex-wrap gap-3">
                <Select defaultValue="active">
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="active">Active</SelectItem></SelectContent>
                </Select>
                <Select defaultValue="review">
                  <SelectTrigger className="w-44" size="sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="review">Review</SelectItem></SelectContent>
                </Select>
              </div>
            }
            states={<p className="text-sm text-muted-foreground">Use default state for required fields and keep options concise.</p>}
            doText="Use select when options are finite and mutually exclusive."
            dontText="Do not use select for long free-text content or huge option sets without search."
          />

          <StandardSection
            id="tabs"
            title="Tabs"
            description="Segment related content in one page context."
            preview={
              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="publish">Publish</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="pt-3 text-sm text-muted-foreground">Main editor settings.</TabsContent>
                <TabsContent value="seo" className="pt-3 text-sm text-muted-foreground">Meta title and description.</TabsContent>
                <TabsContent value="publish" className="pt-3 text-sm text-muted-foreground">Visibility and schedule.</TabsContent>
              </Tabs>
            }
            variants={<p className="text-sm text-muted-foreground">Use 2-5 tabs max. Keep tab labels short and noun-based.</p>}
            states={<p className="text-sm text-muted-foreground">Active tab must be visually obvious and keyboard accessible.</p>}
            doText="Use tabs for related content under the same task context."
            dontText="Do not put unrelated workflows in tabs; split into separate pages instead."
          />

          <StandardSection
            id="dialog"
            title="Dialog"
            description="Use for short focused actions that need interruption."
            preview={
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open confirmation dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Publish this article?</DialogTitle>
                    <DialogDescription>
                      This action will make the article visible to all visitors.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="secondary">Cancel</Button>
                    <Button>Publish</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
            variants={<p className="text-sm text-muted-foreground">Prefer one primary and one secondary action in dialogs.</p>}
            states={<p className="text-sm text-muted-foreground">For destructive actions, use `destructive` button styling and explicit confirmation text.</p>}
            doText="Keep dialog content concise and task-specific."
            dontText="Do not place long multi-step workflows inside dialogs."
          />

          <StandardSection
            id="dropdown"
            title="Dropdown Menu"
            description="Compact action menu for contextual actions."
            preview={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Post actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit post</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuCheckboxItem checked={showMeta} onCheckedChange={(value) => setShowMeta(Boolean(value))}>
                    Show meta panel
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={dropdownStatus} onValueChange={setDropdownStatus}>
                        <DropdownMenuRadioItem value="published">Published</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="archived">Archived</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            }
            variants={<p className="text-sm text-muted-foreground">Mix item, checkbox, and radio entries only when needed for real context actions.</p>}
            states={<p className="text-sm text-muted-foreground">Current status: <span className="font-medium">{dropdownStatus}</span> {showMeta ? "(meta shown)" : "(meta hidden)"}</p>}
            doText="Use dropdown for secondary actions to reduce visual clutter."
            dontText="Do not hide primary actions inside dropdown menus."
          />

          <StandardSection
            id="tooltip"
            title="Tooltip"
            description="Short helper text for icon-only or ambiguous controls."
            preview={
              <div className="flex items-center gap-4">
                <Tooltip label="Save draft">
                  <Button variant="outline" size="icon" aria-label="Save draft">
                    <Check className="h-4 w-4" />
                  </Button>
                </Tooltip>
                <Tooltip label="More information">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border">
                    <Info className="h-4 w-4" />
                  </span>
                </Tooltip>
              </div>
            }
            variants={<p className="text-sm text-muted-foreground">Keep tooltip text short (1 line), descriptive, and action-focused.</p>}
            states={<p className="text-sm text-muted-foreground">Tooltip appears on hover/focus and should not block nearby controls.</p>}
            doText="Use tooltip to clarify icon-only actions."
            dontText="Do not use tooltip as a replacement for mandatory visible labels."
          />

          <StandardSection
            id="table"
            title="Table"
            description="Reference pattern for admin list views."
            preview={
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Welcome Post</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell><Badge>Published</Badge></TableCell>
                    <TableCell>2h ago</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Tooltip label="View">
                          <Button size="icon-sm" variant="ghost" aria-label="View post">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip label="Edit">
                          <Button size="icon-sm" variant="ghost" aria-label="Edit post">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip label="Delete">
                          <Button size="icon-sm" variant="ghost" aria-label="Delete post">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SEO Checklist</TableCell>
                    <TableCell>Editor</TableCell>
                    <TableCell><Badge variant="secondary">Draft</Badge></TableCell>
                    <TableCell>1d ago</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Tooltip label="View">
                          <Button size="icon-sm" variant="ghost" aria-label="View post">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip label="Edit">
                          <Button size="icon-sm" variant="ghost" aria-label="Edit post">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip label="Delete">
                          <Button size="icon-sm" variant="ghost" aria-label="Delete post">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            }
            variants={<p className="text-sm text-muted-foreground">Use badges or icons in cells when status clarity is important.</p>}
            states={<p className="text-sm text-muted-foreground">Provide empty, loading, and error table states in real feature pages.</p>}
            doText="Keep columns scannable and order by user priority."
            dontText="Do not overload table rows with too many inline actions."
          />

          <StandardSection
            id="pagination"
            title="Pagination"
            description="Use for long lists with clear page controls."
            preview={
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(next) => setPage(Math.max(1, Math.min(totalPages, next)))}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            }
            variants={<p className="text-sm text-muted-foreground">Use with table/list views when results exceed one page.</p>}
            states={<p className="text-sm text-muted-foreground">Disable previous/next controls at page boundaries (already built into component).</p>}
            doText="Keep pagination near the list it controls and preserve filters when changing pages."
            dontText="Do not paginate very small datasets; keep them on one page."
          />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
