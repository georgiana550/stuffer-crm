import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Course,
  CoursesDetails,
  GetCourseArgs,
  GetCoursesArgs,
  GetLeadArgs,
  GetLeadsArgs,
  GetNotificationsArgs,
  GetUserArgs,
  ImportLeadsResponseDto,
  Lead,
  LeadsDetails,
  NotificationsDetails,
  PostCourseArgs,
  PostImportLeadsArgs,
  PostLeadArgs,
  PostLoginArgs,
  PostLogoutArgs,
  PostRegisterArgs,
  PutUserArgs,
  UpdateCourseArgs,
  UpdateLeadArgs,
  UpdateNotificationsArgs,
  UserArgs,
  UserDetails,
  UsersDetails,
} from "./types";
import axios from "axios";

export const registerUser = createAsyncThunk<UserDetails, PostRegisterArgs>(
  "user/register",
  async (registerDto, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        registerDto
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const getCourses = createAsyncThunk<CoursesDetails, GetCoursesArgs>(
  "user/getCourses",
  async (args, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/${args.userId}/getCourses`,
        {
          params: {
            limit: args.limit,
            offset: args.offset,
            order: args.order,
            orderBy: args.orderBy,
            name: args.name,
            location: args.location,
            universityName: args.universityName,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk<UsersDetails, UserArgs>(
  "user/getUsers",
  async (args, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/${args.userId}/getUsers`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

// TO DO: change to not search by id: serach by email or phone maybe
export const getUser = createAsyncThunk<UserDetails, GetUserArgs>(
  "user/getUsers",
  async (args, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/${args.userId}/getUsers/${args.userIdToSearch}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const getCourse = createAsyncThunk<Course, GetCourseArgs>(
  "user/getCourses",
  async (args, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/${args.userId}/getCourses/${args.userId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const createCourse = createAsyncThunk<Course, PostCourseArgs>(
  "course/createCourse",
  async (args, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/courses/${args.userId}`,
        args
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const updateCourse = createAsyncThunk<Course, UpdateCourseArgs>(
  "course/updateCourse",
  async (args, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/courses/${args.userId}/getCourses/${args.courseId}`,
        args
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const updateUser = createAsyncThunk<UserDetails, PutUserArgs>(
  "user/updateUser",
  async (args, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${args.userId}/updateUser`,
        args
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const loginUser = createAsyncThunk<UserDetails, PostLoginArgs>(
  "user/login",
  async (loginDto, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        loginDto
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const logoutUser = createAsyncThunk<void, PostLogoutArgs>(
  "user/logout",
  async (logoutDto, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/logout",
        logoutDto
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

// TO DO: when user do not exists, set in state undefiened in order to delogate
export const getLead = createAsyncThunk<Lead, GetLeadArgs>(
  "user/getLead",
  async (args, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/leads/${args.userId}/getLeads/${args.leadId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const deleteLead = createAsyncThunk<{ leadId: number }, GetLeadArgs>(
  "user/getLead",
  async (args, thunkAPI) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/leads/${args.userId}/getLeads/${args.leadId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const createLead = createAsyncThunk<Lead, PostLeadArgs>(
  "course/createLead",
  async (args, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/leads/${args.userId}`,
        args
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const importLeads = createAsyncThunk<
  ImportLeadsResponseDto,
  PostImportLeadsArgs
>("lead/importLeads", async (args, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("file", args.file);

    const response = await axios.post(
      `http://localhost:3000/leads/${args.userId}/importLeads`,
      formData
    );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as any).response.data);
  }
});

export const updateLead = createAsyncThunk<[Lead, number], UpdateLeadArgs>(
  "course/updateLead",
  async (args, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/leads/${args.userId}/getLeads/${args.leadId}`,
        args
      );
      return [response.data, args.userId];
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const getLeads = createAsyncThunk<LeadsDetails, GetLeadsArgs>(
  "user/getLeads",
  async (args, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/leads/${args.userId}/getLeads`,
        {
          params: {
            limit: args.limit,
            offset: args.offset,
            order: args.order,
            orderBy: args.orderBy,
            fullName: args.fullName,
            email: args.email,
            status: args.status,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response.data);
    }
  }
);

export const getNotifications = createAsyncThunk<
  NotificationsDetails,
  GetNotificationsArgs
>("user/getNotifications", async (args, thunkAPI) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/notifications/${args.userId}`,
      {
        params: {
          limit: args.limit,
          offset: args.offset,
        },
      }
    );

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as any).response.data);
  }
});

export const getNotSeenNotifications = createAsyncThunk<
  NotificationsDetails,
  GetNotificationsArgs
>("user/getNotSeenNotifications", async (args, thunkAPI) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/notifications/${args.userId}`,
      {
        params: {
          limit: args.limit,
          offset: args.offset,
          notSeen: args.notSeen,
        },
      }
    );

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as any).response.data);
  }
});

export const seeNotifications = createAsyncThunk<
  NotificationsDetails,
  UpdateNotificationsArgs
>("notifications/seeNotifications", async (args, thunkAPI) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/notifications/${args.userId}/seeNotifications`,
      args
    );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as any).response.data);
  }
});
