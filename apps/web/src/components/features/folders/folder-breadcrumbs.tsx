import { Button } from '@/components/ui/button';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';

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
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <div key={item.id ?? 'root'} className="flex items-center gap-2">
          <Button
            className="px-3 py-1.5 text-xs font-medium tracking-[0.04em]"
            onClick={() => onSelect(item.id)}
            title={item.name}
            variant="secondary"
          >
            {truncateLongWords(item.name)}
          </Button>
          {index < items.length - 1 ? (
            <span className="text-xs font-semibold tracking-[0.08em] text-ink">
              /
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
