import { ComputedRef, computed, ref, watch } from 'vue';

type Validation<ValueToValidate extends unknown> = (value: ValueToValidate) => boolean | string;

type ValidationError = { 
    initialValue?: any,
    errors?: string[],
    isDirty?: boolean,
    isBlured?: boolean
};

export type Validations = Record<
    string, 
    { 
        value: any, 
        validations: Validation<any>[]
    }
>;

function validate<ValueToValidate>(
    value: ValueToValidate, 
    validators: Validation<ValueToValidate>[]
): string[] {
    const errors: string[] = [];

    for (const validator of validators) {
        const result = validator(value);
        
        if (typeof result === 'string') {
            errors.push(result);
        }
    }

    return errors;
}

const getInitialValue = (validations: Validations): Record<string, ValidationError> => {
    const initialValue: Record<string, ValidationError> = {};

    for (const [fieldName, validation] of Object.entries(validations)) {
        initialValue[fieldName] = {
            initialValue: validation.value,
            errors: [],
            isDirty: false,
            isBlured: false
        };
    }

    return initialValue;
};

export const useFormValidation = (
    validations: ComputedRef<Validations>
) => {
    const errors = ref<Record<string, ValidationError>>(getInitialValue(validations.value));

    watch(validations, (currentValidationState) => {
        for (const [fieldName, validation] of Object.entries(currentValidationState)) {
            const fieldErrors = validate(validation.value, validation.validations);
            
            errors.value[fieldName].errors = fieldErrors;
        }
    });

    const onChange = (fieldName: string) => {
        errors.value[fieldName].isDirty = true;
    };

    const onBlur = (fieldName: string) => {
        errors.value[fieldName].isBlured = true;
    };

    const onFocus = (fieldName: string) => {
        errors.value[fieldName].isBlured = false;
    };

    const isFormDirty = computed(() => Object.values(errors.value).every((value) => value.isDirty));
    const isFormValid = computed(() => Object.values(errors.value).every(
        (value) => value.errors?.length === 0 && value.isDirty)
    );

    return {
        errors,
        onBlur,
        onFocus,
        onChange,
        isFormDirty,
        isFormValid
    };
};