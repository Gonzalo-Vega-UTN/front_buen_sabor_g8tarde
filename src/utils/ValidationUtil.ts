import { ValidationEnum } from "./ValidationEnum";

export interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export interface ValidationRequest {
    type: ValidationEnum;
    value: string;
    errorMessage: string;
    min?: number;
    max?: number;
}

export class ValidationUtil{
    static validateEmptyness(value: string) : boolean {
        return value.trim() !== "";
    }
    static validateMinLength(value: string, min? : number) : boolean {
        if(min == undefined) return false;
        return value.length >= min;
    }
    static validatePositive(value: string) : boolean {
        return value.length > 0;
    }

    static validate(validations: ValidationRequest[]) : Record<string, ValidationResult>{
        let results: Record<string, ValidationResult> = {};
        validations.forEach(validation =>{
            const { type, value, errorMessage, min, max} = validation;
            let isValid : boolean = false;
            switch(type){
                case ValidationEnum.Empty:
                    isValid = this.validateEmptyness(value)
                    break;
                case ValidationEnum.MinLength:
                    isValid = this.validateMinLength(value, min)
                    break;
                case ValidationEnum.Positive:
                    isValid = this.validatePositive(value)
                    break;
            }
            const key = ValidationEnum[type];

            if(!isValid){
                results[key] = { isValid, message: errorMessage};
            }else{
                results[key] = { isValid};
            }
        });

        return results;
    }


}