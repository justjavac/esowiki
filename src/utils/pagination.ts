export interface PaginationParameters {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  size: number;
  pageCount: number;
  end: boolean;
  total: number;
}

export function pagination<T>(
  data: T[],
  params: PaginationParameters
): PaginationResult<T> {
  const { page = 1, pageSize = 10 } = params;
  const total = data.length;

  const size = Math.min(99, pageSize);
  const currentPage = Math.max(page, 1);
  const pageCount = Math.ceil(total / size);

  const result: PaginationResult<T> = {
    data: [],
    currentPage,
    size,
    pageCount,
    end: pageCount === currentPage,
    total,
  };

  if (currentPage * size > total) {
    return result;
  }

  if (size > total) {
    result.data = data;
    return result;
  }

  const skip = (currentPage - 1) * size;
  const take = skip + size;

  result.data = data.slice(skip, take);

  return result;
}
