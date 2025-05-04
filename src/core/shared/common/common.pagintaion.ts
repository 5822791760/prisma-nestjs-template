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

function getPerpage(totalItems: number, perPage: number) {
  if (perPage < 0) {
    return totalItems;
  }

  return perPage;
}

function getPage(totalPages: number, page: number) {
  if (page > totalPages) {
    return totalPages;
  }

  return page;
}

export function getTotalPage(totalItems: number, perPage: number) {
  return Math.ceil(totalItems / perPage);
}

export function getOffset(options: PaginationOptions) {
  if (!options.perPage || options.perPage < 0) {
    return undefined;
  }

  return Math.abs((options.page - 1) * (options.perPage || 0));
}

export function getLimit(options: PaginationOptions) {
  if (!options.perPage || options.perPage < 0) {
    return undefined;
  }

  return options.perPage;
}

export function getPagination(
  datas: object[],
  totalItems: number,
  options: PaginationOptions,
) {
  const perPage = getPerpage(totalItems, options.perPage);
  const totalPages = getTotalPage(totalItems, perPage);

  return {
    totalPages,
    page: getPage(totalPages, options.page),
    nextPage: getNextPage(options.page, totalPages),
    previousPage: getPreviousPage(options.page, totalPages),
    perPage,
    currentPageItems: datas.length,
    totalItems,
  };
}
