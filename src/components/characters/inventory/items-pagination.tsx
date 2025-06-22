import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { FC } from "react";

type ItemsPaginationProps = {
  page: number;
  onChangePage: (newPage: number) => void;
  pagesCount: number;
};
export const ItemsPagination: FC<ItemsPaginationProps> = ({
  page,
  onChangePage,
  pagesCount,
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (page > 0) onChangePage(page - 1);
            }}
          />
        </PaginationItem>
        {Array.from({
          length: Math.min(pagesCount, 4),
        }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={index === page}
              onClick={() => onChangePage(index)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (page < pagesCount - 1) onChangePage(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
