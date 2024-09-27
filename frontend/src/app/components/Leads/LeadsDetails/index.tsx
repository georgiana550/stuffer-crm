import { Add, Delete, Edit, Info, PlayForWork } from "@mui/icons-material";
import { Box, Button, Chip, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { isNil } from "lodash";
import Moment from "moment";
import { ReactElement, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { activeErrorActions } from "../../../store/activeError.slice";
import {
  activeLeadActions,
  selectActiveLead,
  selectIsMarkedForDelete,
} from "../../../store/activeLead.slice";
import {
  activeLeadsActions,
  selectActiveImport,
  selectActiveLeads,
  selectFilters,
} from "../../../store/activeLeads.slice";
import { activeNotificationActions } from "../../../store/activeNotification.slice";
import { selectActiveUser } from "../../../store/activeUser.slice";
import { AppDispatch } from "../../../store/store";
import { deleteLead, getLeads } from "../../../store/thunks";
import {
  FiltersLeads,
  INITIAL_PAGINATION,
  Lead,
  LeadStatusNames,
  LeadsDetails as LeadsDetailsType,
  PageModes,
} from "../../../store/types";
import {
  Status,
  StatusChip,
  StatusColors,
  ThemeColors,
  customTableStyles,
} from "../../CustomStyles";
import CustomDialog from "../../SimpleDialog";
import CreateLead from "../Create";
import ViewLead from "../View";
import FileDetailsDialog from "./FileDetailsDialog";
import FiltersBox from "./FiltersBox";
import ImportLeadsDialog from "./ImportLeadsDialog";

type Order = "asc" | "desc";

export const getBackgroundColor = (status: string): string => {
  if (status === Status.ATTEMPTED) return StatusColors[Status.ATTEMPTED];
  if (status === Status.NEW) return StatusColors[Status.NEW];
  if (status === Status.OPEN) return StatusColors[Status.OPEN];
  if (status === Status.UNQUALIFIED) return StatusColors[Status.UNQUALIFIED];
  if (status === Status.WAITING) return StatusColors[Status.WAITING];

  return ThemeColors.dark;
};

export const getStatusName = (status: string): string => {
  if (status === Status.ATTEMPTED) return LeadStatusNames.ATTEMPTED;
  if (status === Status.NEW) return LeadStatusNames.NEW;
  if (status === Status.OPEN) return LeadStatusNames.OPEN;
  if (status === Status.UNQUALIFIED) return LeadStatusNames.UNQUALIFIED;
  if (status === Status.WAITING) return LeadStatusNames.WAITING;

  return ThemeColors.dark;
};


const LeadsDetails = (): ReactElement => {
  const activeLeads = useSelector(selectActiveLeads);
  const activeLead = useSelector(selectActiveLead);
  const isDeleting = useSelector(selectIsMarkedForDelete);
  const activeFilters = useSelector(selectFilters);
  const rows: LeadsDetailsType | undefined = activeLeads;
  const dispatch = useDispatch<AppDispatch>();
  const activeUser = useSelector(selectActiveUser);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [fileDetailsDialog, setFileDetailsDialog] = useState(false);
  const activeImport = useSelector(selectActiveImport);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState("created_at");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  const [[tooltipContent, state], setTooltipContent] = useState<
    [string | undefined, boolean | undefined]
  >([undefined, undefined]);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  useEffect(() => {
    const fetchLeads = async () => {
      if (activeUser)
        try {
          const leads = unwrapResult(
            await dispatch(
              getLeads({
                userId: activeUser.id,
                limit: limit,
                offset: offset,
                order: order === "desc" ? "DESC" : "ASC",
                orderBy: orderBy,
                fullName: activeFilters?.fullName || null,
                email: activeFilters?.email || null,
                status: activeFilters?.status || null,
              })
            )
          );
          dispatch(activeLeadsActions.setLeadsList(leads));
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
      fetchLeads();
    }
  }, [limit, offset, orderBy, order, page, activeFilters]);

  const handleCreate = () => {
    dispatch(activeLeadActions.setPageMode(PageModes.CREATE));
  };

  const handleImportLeads = () => {
    setImportDialogOpen(true);
  };

  const handleOpenFileDialog = () => {
    setFileDetailsDialog(true);
  };

  const handleUpdate = (event: any, lead: Lead) => {
    event.stopPropagation();

    dispatch(activeLeadActions.setPageMode(PageModes.EDIT));
    dispatch(activeLeadActions.setLead(lead));
  };

  const handleAcceptDelete = async (): Promise<void> => {
    if (activeUser && isDeleting && activeLead && activeLead.id)
      try {
        unwrapResult(
          await dispatch(
            deleteLead({ userId: activeUser.id, leadId: activeLead.id })
          )
        );
        dispatch(
          activeNotificationActions.setActiveNotification({
            level: "info",
            message: "Lead deleted successfully!",
          })
        );

        dispatch(activeLeadActions.setPageMode(PageModes.INITIAL));
      } catch (error: any) {
        dispatch(
          activeErrorActions.setActiveError({
            message: error.message,
            code: error.statusCode,
          })
        );
      }
  };

  const handleDelete = async (event: any, lead: Lead) => {
    event.stopPropagation();

    dispatch(activeLeadActions.setPageMode(PageModes.DELETE));
    dispatch(activeLeadActions.setLead(lead));
  };

  const handleView = (lead: Lead) => {
    dispatch(activeLeadActions.setPageMode(PageModes.VIEW));
    dispatch(activeLeadActions.setLead(lead));
  };

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

  const handleFilters = (filters: FiltersLeads) => {
    dispatch(activeLeadsActions.setFilters(filters));
  };

  const showTooltip = (row: Lead, event: React.MouseEvent) => {
    setTooltipContent([
      !isNil(row.asigneeId)
        ? `Lead assigned to ${row.asigneeEmail}`
        : "Lead is not assigned",
      !isNil(row.asigneeId) ? true : false,
    ]);
    setTooltipPosition({ top: event.clientY, left: event.clientX });
  };

  // Method to hide tooltip
  const hideTooltip = () => {
    setTooltipContent([undefined, undefined]);
  };

  const columns = [
    {
      name: "Full name",
      minWidth: "13%",
      sortable: true,
      id: "fullName",
      selector: (row: Lead) => row.fullName || "Not provided",
    },
    {
      name: "Course(s)",
      maxWidth: "100%",
      cell: (row: Lead) =>
        row.courses && row.courses.length > 0 ? (
          row.courses.map((course) => (
            <Tooltip title={course.description}>
              <Chip
                style={{
                  marginRight: "4px",
                  backgroundColor: ThemeColors.negativecourseschip,
                }}
                label={course.name}
              />
            </Tooltip>
          ))
        ) : (
          <Chip
            style={{
              marginRight: "4px",
              backgroundColor: ThemeColors.courseschip,
            }}
            label="Not registered"
          />
        ),
    },
    {
      name: "Email",
      minWidth: "12.5%",
      sortable: true,
      id: "email",
      selector: (row: Lead) => row.email || "Not provided",
    },
    {
      name: "Phone",
      minWidth: "12%",
      selector: (row: Lead) => row.phone || "Not provided",
    },
    {
      name: "Submitted date",
      minWidth: "11%",
      selector: (row: Lead) =>
        row.submittedDate
          ? Moment(row.submittedDate).format("DD/MM/yyyy")
          : "Not provided",
    },
    {
      name: "Status",
      minWidth: "12%",
      selector: (row: Lead) => row.status,
      cell: (row: Lead) => (
        <Chip
          style={{
            backgroundColor: getBackgroundColor(row.status),
            color: ThemeColors.dark,
            textOverflow: "initial",
            textAlign: "center",
            whiteSpace: "initial",
            width: "100%",
          }}
          label={getStatusName(row.status)}
        />
      ),
    },
    {
      name: "Actions",
      maxWidth: "8%",
      cell: (row: Lead) => (
        <>
          <Edit
            style={{ cursor: "pointer" }}
            onClick={(ev) => handleUpdate(ev, row)}
          />
          <Delete
            style={{ cursor: "pointer" }}
            onClick={(ev) => handleDelete(ev, row)}
          />
        </>
      ),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row: Lead) => !isNil(row.asigneeId),
      style: {
        cursor: "pointer",
        color: ThemeColors.whitelow,
        backgroundColor: ThemeColors.highlight,
      }, // Apply custom styles if needed
    },
    {
      when: (row: Lead) => isNil(row.asigneeId),
      style: {
        cursor: "pointer",
        color: ThemeColors.whitelow,
        backgroundColor: ThemeColors.unhighlight,
      }, // Apply custom styles if needed
    },
  ];

  return (
    <>
      <Button
        style={{
          margin: "4px",
          backgroundColor: ThemeColors.buttonsecondary,
          color: ThemeColors.white,
        }}
        variant="contained"
        onClick={handleCreate}
        size="small"
      >
        <Add style={{ color: ThemeColors.white, marginRight: "4px" }} />
        Add lead manually
      </Button>
      <Button
        style={{
          margin: "4px",
          backgroundColor: ThemeColors.buttonprimary,
          color: ThemeColors.white,
        }}
        variant="contained"
        onClick={handleImportLeads}
        size="small"
      >
        <PlayForWork style={{ color: ThemeColors.white, marginRight: "4px" }} />
        Import leads
      </Button>
      {(activeImport.duplicateLines.length > 0 ||
        activeImport.errorLines.length > 0) && (
        <Tooltip title="See file errors">
          <Info
            color="warning"
            style={{ cursor: "pointer" }}
            onClick={handleOpenFileDialog}
          ></Info>
        </Tooltip>
      )}
      <Box
        margin={"4px"}
        border={"6px"}
        borderRadius={"4px"}
        alignItems={"right"}
      >
        <FiltersBox
          onApply={(filters: FiltersLeads) => handleFilters(filters)}
          onClear={() => {
            dispatch(
              activeLeadsActions.setFilters({
                fullName: "",
                email: "",
                status: "",
              })
            );
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
          defaultSortAsc={false}
          columns={columns}
          data={rows ? rows.leads : []}
          paginationTotalRows={rows?.leadsCount}
          selectableRowsNoSelectAll={true}
          paginationDefaultPage={1}
          striped
          paginationRowsPerPageOptions={[5, 10, 15]}
          onChangePage={handleChangePageOffset}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onRowClicked={handleView}
          onRowMouseEnter={(row, e) => showTooltip(row, e)}
          customStyles={customTableStyles}
          conditionalRowStyles={conditionalRowStyles}
        />
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
                  bgcolor: state
                    ? ThemeColors.warning
                    : ThemeColors.warningdark,
                },
              },
            }}
          >
            <div />
          </Tooltip>
        )}
      </Box>
      <CreateLead
        onClose={() => {
          dispatch(activeLeadActions.setPageMode(PageModes.INITIAL));
        }}
      />
      <ViewLead
        onClose={() => {
          dispatch(activeLeadActions.setPageMode(PageModes.INITIAL));
        }}
      />
      {isDeleting && (
        <CustomDialog
          message="Are you sure you want to delete this lead? All information associated with lead will be deleted."
          title="Delete Lead"
          open={isDeleting}
          onClose={() =>
            dispatch(activeLeadActions.setPageMode(PageModes.INITIAL))
          }
          onSubmit={(value: boolean | string) => {
            if (typeof value == "boolean" && value === true) {
              handleAcceptDelete();
              dispatch(activeLeadActions.setPageMode(PageModes.INITIAL));
            }
          }}
        />
      )}
      {importDialogOpen && (
        <ImportLeadsDialog onClose={() => setImportDialogOpen(false)} />
      )}
      {fileDetailsDialog && (
        <FileDetailsDialog onClose={() => setFileDetailsDialog(false)} />
      )}
    </>
  );
};

export default LeadsDetails;
