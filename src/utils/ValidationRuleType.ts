import { ValidationEnum } from "./ValidationEnum";

export interface ValidationRuleType {
  rule: ValidationEnum;
  errorMessage: string;
  min?: number;
  max?: number;
}