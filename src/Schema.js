import * as yup from "yup";

export const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required("Senha é obrigatória"),
});
