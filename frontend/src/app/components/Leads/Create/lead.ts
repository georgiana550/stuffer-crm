import * as yup from "yup";

const leadSchema = yup.object().shape({
  fullName: yup.string().max(255).required("Full name is required"),
  coursesIds: yup
    .array()
    .of(yup.number().required("Course ID is required"))
    .required("Course/s are required"),
  asigneeId: yup.number().notRequired(),
  email: yup.string().email().max(60).required("Email is required"),
  phone: yup.string().max(20).required("Phone is required"),
  citizenship: yup.string().max(20).notRequired(),
  dateOfBirth: yup.date().nullable().notRequired(),
  language: yup.string().max(20).notRequired(),
  refereeName: yup.string().max(20).notRequired(),
});

export default leadSchema;
