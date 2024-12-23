export type PaginatedList<T> = {
    map(arg0: (user: import("./user.type").UserResponse) => { id: number; fullName: string; email: string; provider: string; status: string; }): never;
    content: T[];
    currentPage: number;
    skippedRecords: number;
    totalPages: number;
    hasNext: boolean;
    payloadSize: number;
    totalRecords: number;
  };