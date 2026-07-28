import type { z } from 'zod';
import type { base64FileSchema, flowFileSchema, ReactNativeUploadFile } from '../../utils/schema/common.js';

/** File accepted by compound flows: native file object or base64 content for JSON clients. */
export type FlowFile = z.infer<typeof flowFileSchema>;
export type Base64FileContent = z.infer<typeof base64FileSchema>;
export type UploadableFile = Blob | File | ReactNativeUploadFile;

function isBase64File(file: FlowFile): file is Base64FileContent {
    return typeof file === 'object' && file !== null && 'fileBase64' in file;
}

function base64ToBytes(base64: string): Uint8Array {
    if (typeof Buffer !== 'undefined') {
        return new Uint8Array(Buffer.from(base64, 'base64'));
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/**
 * Normalize a flow file input to an uploadable file object.
 * Base64 content (from MCP/JSON clients) is converted to a File (or Blob fallback).
 */
export function resolveFlowFile(file: FlowFile): UploadableFile {
    if (!isBase64File(file)) {
        return file;
    }

    const bytes = base64ToBytes(file.fileBase64);
    const mimeType = file.mimeType ?? 'application/octet-stream';
    const fileName = file.fileName ?? 'upload.bin';

    if (typeof File !== 'undefined') {
        return new File([bytes], fileName, { type: mimeType });
    }
    return new Blob([bytes], { type: mimeType });
}

/** Resolve the `file` field of an upload options object ({ businessId?, file }) in place. */
export function resolveFlowUpload<T extends { file: FlowFile }>(upload: T): Omit<T, 'file'> & { file: UploadableFile } {
    return { ...upload, file: resolveFlowFile(upload.file) };
}
