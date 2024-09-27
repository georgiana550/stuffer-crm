import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import {
  createLead,
  deleteLead,
  getLeads,
  importLeads,
  logoutUser,
  updateLead,
} from "./thunks";
import {
  ActionStatus,
  FiltersLeads,
  ImportLeadsResponseDto,
  INITIAL_PAGINATION,
  LeadsDetails,
  PageModes,
  Pagination,
  UserDetails,
} from "./types";
import _ from "lodash";

const EMPTY_LEADS: LeadsDetails = {
  leadsCount: 0,
  leads: [],
};

const EMPTY_IMPORT: ImportLeadsResponseDto = {
  createdLeads: [],
  importedLeadsCount: 0,
  errorLines: [],
  duplicateLines: [],
  filename: "",
};

const EMPTY_FILTERS: FiltersLeads = {
  fullName: null,
  email: null,
  status: null,
};

export type ActiveLeadsState = {
  mode: PageModes;
  savingStatus: ActionStatus;
  loadingStatus: ActionStatus;
  leads: LeadsDetails;
  pagination: Pagination;
  filters: FiltersLeads;
  importLeadsFile?: ImportLeadsResponseDto;
  activeUserId?: number;
  activeUserEmail?: string;
};

export const initialState: ActiveLeadsState = {
  mode: PageModes.VIEW,
  savingStatus: ActionStatus.INITIAL,
  loadingStatus: ActionStatus.INITIAL,
  leads: EMPTY_LEADS,
  pagination: INITIAL_PAGINATION,
  filters: EMPTY_FILTERS,
};

export const activeLeadsSlice = createSlice({
  name: "leads/active",
  initialState: initialState,
  reducers: {
    setPageMode: (
      state: ActiveLeadsState,
      { payload }: PayloadAction<PageModes>
    ) => {
      state.mode = payload;
    },
    setLeadsList: (
      state: ActiveLeadsState,
      { payload }: PayloadAction<LeadsDetails>
    ) => {
      state.leads = payload;
    },
    setUserDetails: (
      state: ActiveLeadsState,
      { payload }: PayloadAction<UserDetails>
    ) => {
      state.activeUserId = payload.id;
      state.activeUserEmail = payload.email;
    },
    setPagination: (
      state: ActiveLeadsState,
      { payload }: PayloadAction<Pagination>
    ) => {
      state.pagination = payload;
    },
    setFilters: (
      state: ActiveLeadsState,
      { payload }: PayloadAction<FiltersLeads>
    ) => {
      state.filters = payload;
    },
    reset: (): ActiveLeadsState => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch one
      .addCase(getLeads.pending, (state: ActiveLeadsState) => {
        state.loadingStatus = ActionStatus.PENDING;
      })
      .addCase(getLeads.fulfilled, (state: ActiveLeadsState, { payload }) => {
        state.mode = PageModes.VIEW;
        state.leads = payload;
        state.loadingStatus = ActionStatus.SUCCESS;
      })
      .addCase(getLeads.rejected, (state: ActiveLeadsState) => {
        state.leads = EMPTY_LEADS;
        state.loadingStatus = ActionStatus.FAILURE;
      })
      .addCase(createLead.fulfilled, (state: ActiveLeadsState, { payload }) => {
        if (
          state.leads.leads.length > 0 &&
          payload.asigneeId === state.activeUserId
        )
          state.leads.leads = [...state.leads?.leads, payload];
        else state.leads.leads = [payload];

        state.loadingStatus = ActionStatus.SUCCESS;
      })
      .addCase(
        importLeads.fulfilled,
        (state: ActiveLeadsState, { payload }) => {
          if (payload.importedLeadsCount > 0) {
            payload.createdLeads.map((createdLead) => {
              if (!createdLead.asigneeEmail)
                state.leads.leads = [...state.leads?.leads, createdLead];
              if (createdLead.asigneeEmail === state.activeUserEmail)
                state.leads.leads = [...state.leads?.leads, createdLead];
            });
          }
          state.importLeadsFile = { ...EMPTY_IMPORT };

          state.importLeadsFile.duplicateLines = payload.duplicateLines || [];
          state.importLeadsFile.createdLeads = payload.createdLeads || [];
          state.importLeadsFile.errorLines = payload.errorLines || [];
          state.importLeadsFile.importedLeadsCount =
            payload.importedLeadsCount || 0;
          state.importLeadsFile.filename = payload.filename || "";

          state.loadingStatus = ActionStatus.SUCCESS;
        }
      )
      .addCase(importLeads.rejected, (state: ActiveLeadsState, { payload }) => {
        state.importLeadsFile = EMPTY_IMPORT;

        state.loadingStatus = ActionStatus.SUCCESS;
      })
      .addCase(logoutUser.fulfilled, (state: ActiveLeadsState, { payload }) => {
        state.importLeadsFile = undefined;

        state.activeUserEmail = undefined;
        state.activeUserId = undefined;
      })
      .addCase(updateLead.fulfilled, (state: ActiveLeadsState, { payload }) => {
        const [payloadData, userId] = payload;
        if (state.leads && state.leads.leads) {
          const lead = state.leads.leads.find(
            (lead) => lead.id === payloadData.id
          );
          const leadIndex = state.leads.leads.findIndex(
            (lead) => lead.id === payloadData.id
          );

          if (!_.isNil(lead) && !_.isNil(lead.id)) {
            if (
              !_.isNil(lead.asigneeId) &&
              lead.asigneeId !== payloadData.asigneeId
            )
              state.leads.leads.splice(leadIndex, 1);

            if (
              !_.isNil(lead.asigneeId) &&
              lead.asigneeId === payloadData.asigneeId
            )
              state.leads.leads[leadIndex] = payloadData;

            if (lead.asigneeId !== 0 && !payloadData.asigneeId)
              state.leads.leads[leadIndex] = payloadData;

            if (
              _.isNil(lead.asigneeId) &&
              payloadData.asigneeId &&
              userId !== payloadData.asigneeId
            )
              state.leads.leads.splice(leadIndex, 1);

            if (_.isNil(lead.asigneeId) && userId === payloadData.asigneeId)
              state.leads.leads[leadIndex] = payloadData;
          }
        }

        state.loadingStatus = ActionStatus.SUCCESS;
      })
      .addCase(deleteLead.fulfilled, (state: ActiveLeadsState, { payload }) => {
        if (state.leads && state.leads.leads) {
          const leadIndex = state.leads.leads.find(
            (lead) => lead.id === payload.leadId
          );

          state.leads.leads = state.leads.leads.filter(
            (lead) => lead.id !== leadIndex?.id
          );
          state.leads.leadsCount = state.leads.leadsCount - 1;
          state.loadingStatus = ActionStatus.SUCCESS;
        }
      });
  },
});

const selectEntityState = (state: RootState): ActiveLeadsState =>
  state.activeLeads;

export const selectActiveLeads = createSelector(
  [selectEntityState],
  (state) => state.leads
);
export const selectPagination = createSelector(
  [selectEntityState],
  (state) => state.pagination
);
export const selectFilters = createSelector(
  [selectEntityState],
  (state) => state.filters
);
export const selectActiveImport = createSelector(
  [selectEntityState],
  (state) => state.importLeadsFile || EMPTY_IMPORT
);
export const selectSavingStatus = createSelector(
  [selectEntityState],
  (state) => state.savingStatus
);
export const selectLoadingStatus = createSelector(
  [selectEntityState],
  (state) => state.loadingStatus
);
export const selectIsLoading = createSelector(
  [selectEntityState],
  (state) => state.loadingStatus === ActionStatus.PENDING
);
export const selectIsEditing = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.EDIT
);
export const selectIsCreating = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.CREATE
);
export const selectIsMarkedForDelete = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.DELETE
);
export const selectIsCloning = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.CLONE
);
export const selectIsViewing = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.VIEW
);
export const selectPageMode = createSelector(
  [selectEntityState],
  (state) => state.mode
);
export const selectIsEditingCreatingOrDeleting = createSelector(
  [selectIsEditing, selectIsCreating, selectIsMarkedForDelete],
  (editing, creating, deleting) => editing || creating || deleting
);

export const activeLeadsActions = activeLeadsSlice.actions;
export default activeLeadsSlice.reducer;
