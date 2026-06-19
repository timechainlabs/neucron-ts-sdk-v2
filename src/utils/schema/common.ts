import { z } from 'zod';

export const nonEmptyString = z.string().min(1);

export const messageResponseSchema = z.object({
    message: nonEmptyString,
});

export const pageMetaSchema = z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    next_page: z.number().optional(),
    total_pages: z.number(),
});

export const businessIdSchema = z.object({
    businessId: nonEmptyString.optional(),
});

export const networkEnum = z.enum(['MAIN', 'TEST']);

/** React Native file object from DocumentPicker / ImagePicker */
export interface ReactNativeUploadFile {
    uri: string;
    name: string;
    type: string;
}

export const uploadableFileSchema = z.custom<Blob | File | ReactNativeUploadFile>(
    (value) => {
        if (value instanceof Blob) {
            return true;
        }

        if (typeof File !== 'undefined' && value instanceof File) {
            return true;
        }

        if (
            typeof value === 'object' &&
            value !== null &&
            'uri' in value &&
            typeof (value as ReactNativeUploadFile).uri === 'string' &&
            'name' in value &&
            typeof (value as ReactNativeUploadFile).name === 'string' &&
            'type' in value &&
            typeof (value as ReactNativeUploadFile).type === 'string'
        ) {
            return true;
        }

        return false;
    },
    { message: 'Expected a File, Blob, or React Native file object { uri, name, type }' }
);
