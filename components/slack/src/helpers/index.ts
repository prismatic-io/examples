import { ERROR_DESCRIPTIONS } from "../constants";

export const getErrorDescription = (error: string) => {
  return ERROR_DESCRIPTIONS[error] || "";
};
