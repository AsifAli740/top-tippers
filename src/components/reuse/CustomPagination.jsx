import React, { useEffect, useState } from "react";
import { Box, Skeleton, Pagination } from "@mui/material";
import { useSelector } from "react-redux";
import { manageSportSelector } from "../../slices/manageTeam/manageTeamSelector";
const CustomPagination = (props) => {
  const { total, userList, rowsPerPage, mode } = props;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { selectedSport, currentModule } = useSelector(manageSportSelector);
  const handlePageButtonClick = (e, pageNumber) => {
    setCurrentPage(pageNumber);
    const reqParams = {
      page: mode === "articlePage" ? pageNumber : pageNumber - 1,
      sortValue: "",
      sortOrder: "",
      // season: "current",
    };
    if (selectedSport) {
      if (currentModule === "round") {
        reqParams.sportId = selectedSport === "all" ? "" : selectedSport;
      } else if (currentModule === "game") {
        reqParams.season = "current";
        reqParams.sport = selectedSport === "all" ? "" : selectedSport;
      } else {
        reqParams.sport = selectedSport === "all" ? "" : selectedSport;
      }
    }
    if (currentModule === "game") {
      reqParams.season = "current";
    }
    userList(reqParams);
  };
  useEffect(() => {
    if (rowsPerPage && total !== undefined) {
      const pages = Math.ceil(total / rowsPerPage);
      console.log(pages, "pages");
      setTotalPages(pages);
    } else {
      setTotalPages(0);
    }
  }, [rowsPerPage, total, selectedSport]);
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedSport, currentModule]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        height: "50px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          variant="outlined"
          color="primary"
          shape="circular"
          boundaryCount={2}
          onChange={handlePageButtonClick}
        />
      </Box>
    </Box>
  );
};
export default CustomPagination;
