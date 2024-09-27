import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { ActionStatus, Notification, NotificationsDetails } from "./types";
import { getNotifications, seeNotifications } from "./thunks";
import { intersectionWith } from "lodash";

//backend notifications
export type ActiveLiveNotificationsState = {
  notifications: Notification[];
  totalNotificationsCount: number;
  seenNotificationsCount: number;
  notSeenNotificationsCount: number;
  notificationsCount: number;
  loadingStatus: ActionStatus;
};

export const initialState: ActiveLiveNotificationsState = {
  notifications: [],
  notificationsCount: 0,
  loadingStatus: ActionStatus.INITIAL,
  seenNotificationsCount: 0,
  notSeenNotificationsCount: 0,
  totalNotificationsCount: 0,
};

export const activeNotificationSlice = createSlice({
  name: "notifications/active",
  initialState,
  reducers: {
    setActiveNotifications: (
      state: ActiveLiveNotificationsState,
      { payload }: PayloadAction<NotificationsDetails>
    ) => {
      state.notifications = payload.notifications;
      state.notificationsCount = payload.notificationsCount;
    },
    reset: (): ActiveLiveNotificationsState => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch one
      .addCase(
        getNotifications.pending,
        (state: ActiveLiveNotificationsState) => {
          state.loadingStatus = ActionStatus.PENDING;
        }
      )
      .addCase(
        getNotifications.fulfilled,
        (state: ActiveLiveNotificationsState, { payload }) => {
          if (
            payload.notificationsCount > 0 &&
            payload.totalUserNotifications > 0
          ) {
            state.notifications = payload.notifications;
            state.notSeenNotificationsCount =
              payload.totalUserNotSeenNotifications;
            state.seenNotificationsCount =
              payload.notificationsCount -
              payload.totalUserNotSeenNotifications;
            state.notificationsCount = payload.notificationsCount;
            state.totalNotificationsCount = payload.totalUserNotifications;
            state.loadingStatus = ActionStatus.SUCCESS;
          }
        }
      )
      .addCase(
        seeNotifications.fulfilled,
        (state: ActiveLiveNotificationsState, { payload }) => {
          const [changedNotifications, changedNotificationsCount] = [
            payload.notifications,
            payload.notificationsCount,
          ];
          const changedNotificationsIds = changedNotifications.map(
            (notif: Notification) => notif.id
          );
          const copyState = state.notifications;
          if (state.notifications) {
            const newNotificationsState = state.notifications.map((notif) => {
              if (changedNotificationsIds.includes(notif.id)) {
                const newNotifState = changedNotifications.find(
                  (cNotif) => cNotif.id === notif.id
                );
                return newNotifState || notif;
              }
              return notif;
            });

            state.notifications = [...newNotificationsState];
          }
          // the ones that already seen (but clicked) to not be taken into consideration
          const customComparator = (
            notification1: Notification,
            notification2: Notification
          ) =>
            notification1.id === notification2.id &&
            notification1.seen !== notification2.seen;

          const commonNotifications = intersectionWith(
            state.notifications,
            copyState,
            customComparator
          );

          const commonCount = commonNotifications.length;

          state.notSeenNotificationsCount =
            state.notSeenNotificationsCount - commonCount;
          state.loadingStatus = ActionStatus.SUCCESS;
        }
      );
  },
});

const selectEntityState = (state: RootState): ActiveLiveNotificationsState =>
  state.activeLiveNotifications;

export const selectActiveLiveNotifications = createSelector(
  [selectEntityState],
  (state) => state.notifications
);
export const selectActiveLiveNotificationsCount = createSelector(
  [selectEntityState],
  (state) => state.notificationsCount
);
export const selectActiveLiveNotSeenNotificationsCount = createSelector(
  [selectEntityState],
  (state) => state.notSeenNotificationsCount
);
export const selectActiveLiveSeenNotificationsCount = createSelector(
  [selectEntityState],
  (state) => state.seenNotificationsCount
);
export const selectActiveLiveToalNotificationsCount = createSelector(
  [selectEntityState],
  (state) => state.totalNotificationsCount
);

export const activeNotificationActions = activeNotificationSlice.actions;
export default activeNotificationSlice.reducer;
