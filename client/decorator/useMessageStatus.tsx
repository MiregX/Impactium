import { MessageTypes } from "../dto/MessateTypes.dto";

export const useMessageStatus = (num: number): MessageTypes => between(num, 200, 299)
  ? 'ok'
  : (between(num, 300, 499)
    ? 'warning'
    : 'error'
  );

export const between = (num: number, min: number, max: number) => num >= min && num <= max