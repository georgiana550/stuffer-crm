import * as yup from "yup";

const courseSchema = yup.object().shape({
  name: yup.string().max(255).required("Name is required"),
  description: yup.string().max(6500).required("Description is required"),
  startDate: yup.date().nullable().notRequired(),
  endDate: yup.date().nullable().notRequired(),
  location: yup.string().max(255).required("Location is required"),
});

export default courseSchema;
