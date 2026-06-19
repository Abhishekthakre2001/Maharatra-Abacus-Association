import { useState } from "react";
import useDebounce from "./useDebounce";

const useTableState = ({
  initialPage = 1,
  initialLimit = 5,
  debounceDelay = 500,
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(
    search,
    debounceDelay
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setPage(1);
  };

  const resetTable = () => {
    setPage(1);
    setLimit(initialLimit);
    setSearch("");
  };

  return {
    page,
    limit,
    search,
    debouncedSearch,

    setPage,
    setLimit,
    setSearch,

    handleSearchChange,
    handleLimitChange,
    resetTable,
  };
};

export default useTableState;