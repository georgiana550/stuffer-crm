export type SortOrder = "asc" | "desc";

export enum PageModes {
  VIEW = "view",
  EDIT = "edit",
  CREATE = "create",
  DELETE = "delete",
  INITIAL = "initial",
  CLONE = "clone",
}

export enum FileTypes {
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  PDF = "application/pdf",
  WORD = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  TXT = "text/plain",
  JPEG = "image/jpeg",
  POWERPOINT = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}

export const AvailbaleImportLeadsFilesTypes = [
  Object.keys(FileTypes).filter((type) => type === "XLSX"),
];

export type Pagination = {
  limit: number;
  offset: number;
  order: "ASC" | "DESC";
  orderBy: string;
};

export type PaginationNotifications = {
  limit: number;
  offset: number;
};

export type FiltersLeads = {
  fullName: string | null;
  email: string | null;
  status: string | null;
};

export type FiltersCourses = {
  name: string | null;
  universityName: string | null;
  location: string | null;
};

export const INITIAL_PAGINATION: Pagination = {
  limit: 10,
  offset: 0,
  order: "DESC",
  orderBy: "created_at",
};

export const getTypeName = (typeName: string) => {
  // TO DO: make this search prettier
  const result = Object.entries(FileTypes).find((type) => {
    return typeName === type[1];
  });

  if (result) return result[0];
  return undefined;
};

export enum ActionStatus {
  INITIAL = "initial",
  SUCCESS = "success",
  FAILURE = "failure",
  PENDING = "pending",
}

export enum LeadStatusNames {
  NEW = "New",
  ATTEMPTED = "Attempted to contact",
  OPEN = "Open",
  UNQUALIFIED = "Unqualified",
  WAITING = "Waiting",
}

export enum LeadStatusCodes {
  NEW = "new",
  ATTEMPTED = "attemptedToContact",
  OPEN = "open",
  UNQUALIFIED = "unqualified",
  WAITING = "waiting",
}

export type LevelType = "success" | "warning" | "error" | "info" | "initial";

export type UserDetails = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active?: boolean;
  dialing_code?: string;
  phone_number: string;
  email_verified?: boolean;
  verification_code?: string;
};

export type ErrorDetails = {
  code: number;
  message: string;
};

export type NotificationDetails = {
  level: LevelType;
  message: string;
};

export type PostRegisterArgs = {
  first_name: string;
  last_name: string;
  email: string;
  dialing_code?: string | null;
  phone_number: string;
  password: string;
};

export type UserArgs = {
  userId: number;
};

export type GetCourseArgs = UserArgs & {
  courseId: number;
};
export type GetCoursesArgs = UserArgs & Pagination & FiltersCourses;

export type GetLeadsArgs = UserArgs & Pagination & FiltersLeads;

export type GetNotificationsArgs = UserArgs &
  PaginationNotifications & { notSeen?: boolean };

export type UpdateNotificationsArgs = UserArgs & { notificationsIds: number[] };

export type GetUserArgs = UserArgs & {
  userIdToSearch: number;
};

export type PutUserArgs = UserArgs & {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

export type PostCourseArgs = UserArgs & Course;
export type UpdateCourseArgs = PostCourseArgs & { courseId: number };

export type PostLoginArgs = {
  email: string;
  password: string;
};

export type PostLogoutArgs = {
  email: string;
};

export type Course = {
  id?: number;
  name: string;
  description: string;
  location: string;
  leads: Lead[] | [];
  universityName: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  additionalInformation: string | undefined;
};

export type CoursesDetails = {
  coursesCount: number;
  courses: Course[];
};

export type UsersDetails = {
  usersCount: number;
  users: UserDetails[];
};

export type Lead = {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  asigneeEmail: string;
  asigneeId: number;
  createdBy: string;
  courses: Course[];
  status: string;
  refereeName?: string | undefined;
  dateOfBirth?: Date | undefined;
  language?: string | undefined;
  citizenship?: string | undefined;
  source?: string | undefined;
  submittedDate?: Date | undefined;
  additionalColumns?: object;
};

export type CourseLead = {
  fullName: string;
  email: string;
  phone: string;
  asigneeEmail: string;
  asigneeId: number;
  createdBy: string;
  courses: Course[];
  refereeName?: string | undefined;
  dateOfBirth?: Date | undefined;
  language?: string | undefined;
  citizenship?: string | undefined;
};

export type ImportLeadsResponseDto = {
  createdLeads: Lead[];
  importedLeadsCount: number;
  errorLines: number[];
  duplicateLines: number[];
  filename: string;
};

export type PostLead = {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  asigneeId?: number;
  asigneeEmail?: string;
  coursesIds: number[];
  refereeName?: string | undefined;
  dateOfBirth?: Date | undefined;
  language?: string | undefined;
  citizenship?: string | undefined;
};

export type PostImportLeads = {
  file: File;
};

export type LeadsDetails = {
  leadsCount: number;
  leads: Lead[];
};

export type Notification = {
  id: number;
  message: string;
  seen: boolean;
  created_at: Date;
};

export type NotificationsDetails = {
  notificationsCount: number;
  notifications: Notification[];
  totalUserNotSeenNotifications: number;
  totalUserNotifications: number;
};

export type GetLeadArgs = UserArgs & {
  leadId: number;
};

export type PostLeadArgs = UserArgs & PostLead;
export type PostImportLeadsArgs = UserArgs & PostImportLeads;

export type UpdateLeadArgs = PostLeadArgs & { leadId: number };
