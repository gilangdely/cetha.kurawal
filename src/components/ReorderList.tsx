import { Reorder } from "motion/react";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReorderListProps<T extends { id: string }> {
    items: T[];
    onReorder: (newOrder: T[]) => void;
    onRemove: (id: string) => void;
    renderItemContent: (item: T) => React.ReactNode;
}

export function ReorderList<T extends { id: string }>({
    items,
    onReorder,
    onRemove,
    renderItemContent,
}: ReorderListProps<T>) {
    if (items.length === 0) {
        return (
            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-200">
                Belum ada item ditambahkan.
            </div>
        );
    }

    return (
        <Reorder.Group axis="y" values={items} onReorder={onReorder} className="flex flex-col gap-3">
            {items.map((item) => (
                <Reorder.Item key={item.id} value={item} className="bg-white border rounded-md p-4 shadow-sm relative group cursor-grab active:cursor-grabbing">
                    <div className="flex gap-3">
                        <div className="mt-1 text-gray-400 hover:text-gray-600">
                            <GripVertical size={18} />
                        </div>
                        <div className="flex-1 overflow-hidden pointer-events-auto cursor-auto">
                            {renderItemContent(item)}
                        </div>
                        <div className="pointer-events-auto">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(item.id);
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
}
