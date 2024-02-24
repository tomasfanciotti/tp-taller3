export interface Column<T = unknown> {
  id: keyof T;
  name: string;
  className?: string;
  displayFn?: (d: string) => string;
}

export type Order = 'asc' | 'desc';

export interface Ordering<T = unknown> {
  sortedBy?: keyof T;
  order: Order;
}

export interface TableContainerProps<T = unknown> {
  columns: Array<Column<T>>,
  sortingColumns: Array<keyof T>;
  data: Array<T>,
  onClickRow?: (element: T) => void;
  ordering?: Ordering<T>;
  setOrdering: Dispatch<SetStateAction<Ordering<T> | undefined>>;
  defaultOrder: Order;
}
