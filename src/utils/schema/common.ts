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

/**
 * Optional business ID that tolerates empty strings from MCP/LLM clients.
 * An empty or whitespace-only string is normalized to `undefined` instead of
 * failing a `min(1)` check, since business context is genuinely optional on
 * most endpoints (the personal account is used instead).
 */
export const optionalBusinessId = z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().min(1).optional()
);

export const businessIdSchema = z.object({
    businessId: optionalBusinessId,
});

export const networkEnum = z.enum(['MAIN', 'TEST']);

/** JSON-friendly file content for clients (e.g. MCP tools) that cannot send File/Blob objects. */
export const base64FileSchema = z.object({
    fileBase64: z.string().min(1).describe('Base64-encoded file content.'),
    fileName: z.string().optional().describe('File name to use (defaults to "upload.bin").'),
    mimeType: z.string().optional().describe('MIME type of the file (defaults to application/octet-stream).'),
});

/** Free-form key/value metadata with primitive values (JSON-schema friendly; no z.unknown()). */
export const metadataSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));

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

/**
 * File accepted by compound MCP flows: a native File/Blob/React Native file
 * object, or base64-encoded content for JSON-only clients (MCP tools).
 */
export const flowFileSchema = z.union([uploadableFileSchema, base64FileSchema]);
