import { File } from "buffer";
import { URL } from "url";

export interface QRCode {
  image: File;
  url: string;
  expires: number;
}