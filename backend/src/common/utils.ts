import { TransformFnParams } from 'class-transformer';

export const evaluateParamToBool = ({ value }: TransformFnParams): boolean => {
    return value === 'true' || value === true || value === 1 || value === '1';
};

export type ValueOf<T> = T[keyof T];
