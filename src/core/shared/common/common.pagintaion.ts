export interface PaginationOptions {
  page: number;
  perPage: number;
}

function getNextPage(currentPage: number, totalPages: number) {
  const nextPage = currentPage + 1;
  if (nextPage > totalPages) {
    return 1;
  }

  return nextPage;
}

function getPreviousPage(currentPage: number, totalPages: number) {
  const nextPage = currentPage - 1;
  if (nextPage <= 0) {
    return totalPages;
  }

  if (nextPage > totalPages) {
    return totalPages;
  }

  return nextPage;
}

export function getTotalPage(totalItems: number, perPage: number) {
  return Math.ceil(totalItems / perPage);
}

export function getOffset(options: PaginationOptions) {
  return (options.page - 1) * options.perPage;
}

export function getLimit(options: PaginationOptions) {
  return options.perPage;
}

export function getPagination(
  datas: object[],
  totalItems: number,
  options: PaginationOptions,
) {
  const totalPages = getTotalPage(totalItems, options.perPage);

  return {
    page: options.page,
    nextPage: getNextPage(options.page, totalPages),
    previousPage: getPreviousPage(options.page, totalPages),
    perPage: options.perPage,
    totalPages,
    currentPageItems: datas.length,
    totalItems,
  };
}
