import { λParam } from "@impactium/pattern";

export interface Item {
  id: string;
  uid: string;
  imprint: λParam.Imprint;
  amount: number;
}
