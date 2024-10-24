import { ClientProps } from "./ClientProps";

export interface GetClientParamsProps extends ClientProps {
  validConnectionKeys: string[];
}
