import { useState } from "react";

type OptionalsOpts = {
  initialPage: number;
};

export const usePagination = <TypeData,>(
  data: TypeData[],
  maxPage: number,
  opts?: OptionalsOpts
) => {
  const [page, setPage] = useState(opts?.initialPage || 0);

  return {
    setPage,
    page,
    pagesCount: Math.ceil(data.length / maxPage),
    data: data.slice(page * maxPage, page * maxPage + maxPage),
  };
};
