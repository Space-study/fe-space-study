import { OrderDirection } from "@/core/enums/order-direction.enum";
import { PaginationParams } from "@/core/types/pagination-params.type";
import { PaginatedList } from "@/core/types/paginated-list.type";
import { Dispatch, SetStateAction, useState } from "react";

interface IPaginateHook<T> {
  pagination: PaginationParams;
  setPagination: Dispatch<SetStateAction<PaginationParams>>;
  paginatedItems: PaginatedList<T> | undefined;
  setPaginatedItems: Dispatch<SetStateAction<PaginatedList<T> | undefined>>;
  onChangePageSize: (pageSize: number) => void;
  onChangePage: (page: number) => void;
  onChangeOrder: (orderBy: string, orderDirection: string) => void;
  onChangeSearch: (searchBy: string, searchValue: string) => void;
}

export const defaultPageSizeOptions = new Array(10).fill(0).map((_, index) => ({
  value: (index + 1) * 5,
}));

export default function usePaginate<T>(defaultPaginationParams?: Partial<PaginationParams>): IPaginateHook<T> {
  const [pagination, setPagination] = useState<PaginationParams>(
    defaultPaginationParams || {
      limit: 10,
      page: 1,
    },
  );
  const [paginatedItems, setPaginatedItems] = useState<PaginatedList<T>>();

  function onChangePageSize(pageSize: number) {
    setPagination((current) => ({ ...current, limit: pageSize }));
  }

  function onChangePage(page: number) {
    setPagination((current) => ({ ...current, page }));
  }

  function onChangeOrder(orderBy: string, orderDirection: string) {
    setPagination((current) => ({
      ...current,
      orderBy,
      orderDirection: orderDirection === "ascend" ? OrderDirection.ASC : OrderDirection.DESC,
    }));
  }

  function onChangeSearch(searchBy: string, searchValue: string) {
    setPagination((current) => ({ ...current, searchBy, searchValue }));
  }

  return {
    pagination,
    setPagination,
    paginatedItems,
    setPaginatedItems,
    onChangePageSize,
    onChangePage,
    onChangeOrder,
    onChangeSearch,
  };
}
