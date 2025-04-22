import type { ReactNode } from "react";

type SelectedItemProps<T> = {
  item: T | undefined;
  renderItem: (item: T) => ReactNode;
};

export function SelectedItem<T>({ item, renderItem }: SelectedItemProps<T>) {
  if (!item) return null;

  return <div className="mt-4 p-4 border rounded-md">{renderItem(item)}</div>;
}
