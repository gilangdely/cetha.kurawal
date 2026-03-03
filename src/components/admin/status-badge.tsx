// components/admin/status-badge.tsx
import { Badge } from "@/components/ui/badge";
import { CmsStatus } from "@/lib/admin/mock";

export function StatusBadge({ status }: { status: CmsStatus }) {
  if (status === "published") {
    return (
      <Badge className="bg-blue-600 hover:bg-blue-600">Published</Badge>
    );
  }
  return <Badge variant="secondary">Draft</Badge>;
}