import { Connection } from "@prismatic-io/spectral";
export interface ClientProps {
  awsRegion: string;
  awsConnection: Connection;
}
