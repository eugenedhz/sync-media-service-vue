export const getEnvironmentVariable = (key: string): string => {
    const environmentVariable = import.meta.env[key];
    if (environmentVariable === undefined) {
        throw new Error(`Environment variable ${key} is required`);
    }
    return environmentVariable;
};

export const __BASE_URL__ = getEnvironmentVariable('VITE_BASE_URL');
