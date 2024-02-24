import { TFunction } from 'react-i18next';

export interface ColumnHeader<Element> {
    header: keyof Element;
    headerTranslateKey: string;
    className?: string;
    onClickFn?: () => void;
    displayFn?: (value: any, element: Element) => string | JSX.Element;
}

export interface TableProps<Element> {
    rowElements: Element[],
    headerElements: ColumnHeader<Element>[],
    onClickRow?: (Element) => void;
    t: TFunction;
    columnsOrder?: any;
    sortedBy?: string[];
}
