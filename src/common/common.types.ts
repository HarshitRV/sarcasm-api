export const ERROR_TYPES = {
    404: "Not Found",
    400: 'Bad Request'
} as const;

export type ErrorTypes = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];