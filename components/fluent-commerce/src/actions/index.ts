import customerActions from "./customers";
import genericRequestActions from "./genericRequest";
import getCurrentUserActions from "./getCurrentUser";
import productActions from "./products";

export default {
  ...customerActions,
  ...genericRequestActions,
  ...getCurrentUserActions,
  ...productActions,
};
