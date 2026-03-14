import { Button } from '@/components/ui/button';

type FolderBreadcrumbItem = {
  id: string | null;
  name: string;
};

type FolderBreadcrumbsProps = Readonly<{
  items: FolderBreadcrumbItem[];
  onSelect: (folderId: string | null) => void;
}>;

export function FolderBreadcrumbs({
  items,
  onSelect,
}: FolderBreadcrumbsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item, index) => (
        <div key={item.id ?? 'root'} className="flex items-center gap-3">
          <Button onClick={() => onSelect(item.id)} variant="secondary">
            {item.name}
          </Button>
          {index < items.length - 1 ? (
            <span className="text-sm font-black uppercase tracking-[0.14em] text-ink">
              /
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
