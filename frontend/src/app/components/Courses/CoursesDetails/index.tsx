import { Add, Edit, EmojiPeople } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import Moment from "moment";
import { ReactElement, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { activeCourseActions } from "../../../store/activeCourse.slice";
import {
  activeCoursesActions,
  selectActiveCourses,
} from "../../../store/activeCourses.slice";
import { activeErrorActions } from "../../../store/activeError.slice";
import { selectActiveUser } from "../../../store/activeUser.slice";
import { AppDispatch } from "../../../store/store";
import { getCourses } from "../../../store/thunks";
import {
  Course,
  CoursesDetails as CoursesDetailsType,
  FiltersCourses,
  INITIAL_PAGINATION,
  PageModes,
} from "../../../store/types";
import { ThemeColors, customTableStyles } from "../../CustomStyles";
import CreateCourse from "../Create";
import ViewCourse from "../View";
import FiltersBox from "./FiltersBox";
import LeadsDialog from "./LeadsDialog";

type Order = "asc" | "desc";

const CoursesDetails = (): ReactElement => {
  const activeCourses = useSelector(selectActiveCourses);
  const rows: CoursesDetailsType | undefined = activeCourses;
  const dispatch = useDispatch<AppDispatch>();
  const [[courseLeadsDialog, isOpen], setOpenLeadsDialog] = useState<
    [Course | undefined, boolean]
  >([undefined, true]);
  const activeUser = useSelector(selectActiveUser);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState("created_at");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FiltersCourses>({
    name: "",
    location: "",
    universityName: "",
  });
  const [[tooltipContent, state], setTooltipContent] = useState<
    [string | undefined, boolean | undefined]
  >([undefined, undefined]);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  useEffect(() => {
    const fetchCourses = async () => {
      if (activeUser)
        try {
          const courses = unwrapResult(
            await dispatch(
              getCourses({
                userId: activeUser.id,
                limit: limit,
                offset: offset,
                order: order === "desc" ? "DESC" : "ASC",
                orderBy: orderBy,
                name: filters.name || null,
                location: filters.location || null,
                universityName: filters.universityName || null,
              })
            )
          );
          dispatch(activeCoursesActions.setCoursesList(courses));
        } catch (error: any) {
          dispatch(
            activeErrorActions.setActiveError({
              message: error.message,
              code: error.statusCode,
            })
          );
        }
    };

    if (activeUser && activeUser.id) {
      fetchCourses();
    }
  }, [limit, offset, filters, order, orderBy]);

  const handleChangeRowsPerPage = (event: number) => {
    setLimit(event);
  };

  const handleChangePageOffset = (pageNumber: number) => {
    setPage(pageNumber);
    setOffset(limit * (pageNumber - 1));
  };

  const handleRequestSort = (property: string, order: string) => {
    setOrder(order === "asc" ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleCreate = () => {
    dispatch(activeCourseActions.setPageMode(PageModes.CREATE));
  };

  const handleUpdate = (event: any, course: Course) => {
    event.stopPropagation();

    dispatch(activeCourseActions.setPageMode(PageModes.EDIT));
    dispatch(activeCourseActions.setCourse(course));
  };

  const handleViewLeads = (event: any, course: Course) => {
    event.stopPropagation();
    setOpenLeadsDialog([course, true]);
  };

  const handleView = (course: Course) => {
    dispatch(activeCourseActions.setPageMode(PageModes.VIEW));
    dispatch(activeCourseActions.setCourse(course));
  };

  const handleFilters = (filters: FiltersCourses) => {
    setFilters(filters);
  };

  const columns = [
    {
      name: "Name",
      maxWidth: "9%",
      sortable: true,
      id: "name",
      selector: (row: Course) => row.name || "Not provided",
    },
    {
      name: "Description",
      minWidth: "15%",
      selector: (row: Course) => row.description || "Not provided",
    },
    {
      name: "Location",
      minWidth: "12.5%",
      sortable: true,
      id: "location",
      selector: (row: Course) => row.location || "Not provided",
    },
    {
      name: "Additional Information",
      minWidth: "15%",
      selector: (row: Course) => row.additionalInformation || "Not provided",
    },
    {
      name: "Start Date",
      maxWidth: "10%",
      selector: (row: Course) =>
        row.startDate
          ? Moment(row.startDate).format("DD/MM/yyyy")
          : "Not provided",
    },
    {
      name: "End date",
      maxWidth: "10%",
      selector: (row: Course) =>
        Moment(row.endDate).format("DD/MM/yyyy") || "Not provided",
    },
    {
      name: "University Name",
      minWidth: "12.5%",
      sortable: true,
      id: "universityName",
      selector: (row: Course) => row.universityName || "Not provided",
    },
    {
      name: "Actions",
      maxWidth: "10%",
      cell: (row: Course) => (
        <>
          <Edit
            style={{ cursor: "pointer" }}
            onClick={(ev) => handleUpdate(ev, row)}
          />
          <EmojiPeople
            style={{ cursor: "pointer" }}
            onClick={(ev) => handleViewLeads(ev, row)}
          />
        </>
      ),
    },
  ];

  // Define the conditionalRowStyles prop to render tooltips for rows
  const conditionalRowStyles = [
    {
      when: (row: Course) => row.leads.length > 0,
      style: {
        cursor: "pointer",
        color: ThemeColors.whitelow,
        backgroundColor: ThemeColors.highlight,
      }, // Apply custom styles if needed
    },
    {
      when: (row: Course) => row.leads.length === 0,
      style: {
        cursor: "pointer",
        color: ThemeColors.whitelow,
        backgroundColor: ThemeColors.unhighlight,
      }, // Apply custom styles if needed
    },
  ];

  const showTooltip = (row: Course, event: React.MouseEvent) => {
    setTooltipContent([
      row.leads.length > 0
        ? "You have leads assigned to this course"
        : "You don't have leads assigned to this course",
      row.leads.length > 0 ? true : false,
    ]);
    setTooltipPosition({ top: event.clientY, left: event.clientX });
  };

  // Method to hide tooltip
  const hideTooltip = () => {
    setTooltipContent([undefined, undefined]);
  };

  return (
    <>
      <Button
        style={{
          margin: "4px",
          backgroundColor: ThemeColors.buttonprimary,
          color: ThemeColors.white,
        }}
        variant="contained"
        onClick={handleCreate}
        size="small"
      >
        <Add style={{ color: ThemeColors.white }} />
        Add course
      </Button>

      <Box
        margin={"4px"}
        border={"6px"}
        borderRadius={"4px"}
        alignItems={"right"}
      >
        <FiltersBox
          onApply={(filters: FiltersCourses) => handleFilters(filters)}
          onClear={() => {
            setFilters({ name: "", universityName: "", location: "" });
            setOrder(INITIAL_PAGINATION.order === "ASC" ? "asc" : "desc");
            setOrderBy(INITIAL_PAGINATION.orderBy);
          }}
        />
        <DataTable
          pagination
          paginationServer
          onSort={(selectedColumn, sortDirection) =>
            handleRequestSort(selectedColumn.id as string, sortDirection)
          }
          onRowMouseEnter={(row, e) => showTooltip(row, e)}
          columns={columns}
          defaultSortAsc={false}
          data={rows ? rows.courses : []}
          paginationTotalRows={rows?.coursesCount}
          selectableRowsNoSelectAll={true}
          paginationDefaultPage={1}
          striped
          paginationRowsPerPageOptions={[5, 10, 15]} //you can remove it later, just to have more pages
          onChangePage={handleChangePageOffset}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onRowClicked={handleView}
          customStyles={customTableStyles}
          conditionalRowStyles={conditionalRowStyles}
        />
      </Box>
      {tooltipContent && (
        <Tooltip
          open={!!tooltipContent}
          title={tooltipContent}
          onClose={hideTooltip}
          style={{
            position: "fixed",
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: state ? ThemeColors.warning : ThemeColors.warningdark,
              },
            },
          }}
        >
          <div />
        </Tooltip>
      )}
      <CreateCourse
        onClose={() =>
          dispatch(activeCourseActions.setPageMode(PageModes.INITIAL))
        }
      />
      <ViewCourse
        onClose={() => {
          dispatch(activeCourseActions.setPageMode(PageModes.INITIAL));
        }}
      />
      {isOpen && courseLeadsDialog && (
        <LeadsDialog
          onClose={() => setOpenLeadsDialog([undefined, false])}
          course={courseLeadsDialog}
        ></LeadsDialog>
      )}
    </>
  );
};

export default CoursesDetails;
