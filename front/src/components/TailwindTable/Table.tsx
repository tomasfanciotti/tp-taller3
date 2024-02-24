import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid';
import { Order, Ordering, TableContainerProps } from './definitions';

const OrderIcon = ({ order }: { order: Order }) => (
  <span>
    {order === 'desc' ? (
      <ArrowSmDownIcon className="h-4 ml-2 text-gray-400" />
    ) : (
      <ArrowSmUpIcon className="h-4 ml-2 text-gray-400" />
    )}
  </span>
);

const getOrder = <T extends unknown>(
  newSortedBy: keyof T, defaultOrder: Order, prevSortedBy?: keyof T, currentOrder?: Order,
) => {
  if (prevSortedBy === newSortedBy) return currentOrder === 'asc' ? 'desc' : 'asc';
  return defaultOrder;
};

const Table = <T extends unknown>({
                                             data,
                                             columns,
                                             onClickRow,
                                             ordering,
                                             setOrdering,
                                             defaultOrder,
                                             sortingColumns,
                                           }: TableContainerProps<T>) => {
  const columnClassName = 'px-6 py-4 whitespace-nowrap text-sm';

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
      <tr>
        {columns.map((col, index) => (
          <th
            key={index}
            scope="col"
            className={`px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase ${sortingColumns?.includes(col.id) ? 'cursor-pointer' : ''}`}
            onClick={() => sortingColumns?.includes(col.id) && setOrdering((prevOrdering: Ordering<T>) => ({
              sortedBy: col.id,
              order: getOrder(col.id, defaultOrder, prevOrdering?.sortedBy, prevOrdering?.order),
            }))}
          >
            <div className="flex items-center">
              {col.name}
              {ordering && col.id === ordering.sortedBy && (
                <OrderIcon order={ordering.order} />
              )}
            </div>
          </th>
        ))}
      </tr>
      </thead>
      <tbody>
      {data.map((elem, rowIndex) => (
        <tr
          key={rowIndex}
          className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
            onClickRow ? 'cursor-pointer hover:bg-gray-200' : ''
          }`}
          onClick={onClickRow ? () => onClickRow(elem) : undefined}
        >
          {columns.map((col, colIndex) => (
            <td
              key={colIndex}
              className={
                col.className ? `${columnClassName} ${col.className}` : ''
              }
            >
              {col.displayFn ? col.displayFn(elem[col.id] as string) : elem[col.id] as string}
            </td>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default Table;
