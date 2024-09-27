import { combineReducers } from "@reduxjs/toolkit";
import activeUserReducer from "./app/store/activeUser.slice";
import activeUsersReducer from "./app/store/activeUsers.slice";
import activeErrorReducer from "./app/store/activeError.slice";
import activeNotificationReducer from "./app/store/activeNotification.slice";
import activeLiveNotificationsReducer from "./app/store/activeLiveNotifications.slice";
import activeCoursesReducer from "./app/store/activeCourses.slice";
import activeCourseReducer from "./app/store/activeCourse.slice";
import activeLeadsReducer from "./app/store/activeLeads.slice";
import activeLeadReducer from "./app/store/activeLead.slice";

const rootReducer = combineReducers({
  activeUser: activeUserReducer,
  activeUsers: activeUsersReducer,
  activeError: activeErrorReducer,
  activeNotification: activeNotificationReducer,
  activeLiveNotifications: activeLiveNotificationsReducer,
  activeCourses: activeCoursesReducer,
  activeCourse: activeCourseReducer,
  activeLeads: activeLeadsReducer,
  activeLead: activeLeadReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
