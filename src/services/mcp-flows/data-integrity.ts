import { NeucronError } from '../../utils/errors/sdk-error.js';
import type { McpFlowServices } from './types.js';
import type {
    NeucronInscribeDocumentOptions,
    NeucronInscribeTextOptions,
    NeucronSignDataOptions,
    NeucronEncryptDataOptions,
} from './types.js';

/**
 * Upload a document and inscribe it for immutable proof of existence.
 * MCP Tool: `neucron_inscribe_document`
 */
export async function neucron_inscribe_document(services: McpFlowServices, options: NeucronInscribeDocumentOptions) {
    const uploaded = await services.blob.uploadDocument(options.document);

    let inscription: unknown;
    if (options.inscribe) {
        const inscribeResponse = await services.dataIntegrity.fileUpload(options.inscribe);
        inscription = inscribeResponse.data;
    }

    return {
        document: uploaded.data,
        inscription,
    };
}

/**
 * Inscribe plain text on-chain for immutable proof of existence.
 * MCP Tool: `neucron_inscribe_text`
 */
export async function neucron_inscribe_text(services: McpFlowServices, options: NeucronInscribeTextOptions) {
    const inscription = await services.dataIntegrity.textUpload(options);
    return { inscription: inscription.data };
}

/**
 * Cryptographically sign data using the user's wallet keys.
 * MCP Tool: `neucron_sign_data`
 */
export async function neucron_sign_data(services: McpFlowServices, options: NeucronSignDataOptions) {
    void services;
    void options;
    throw new NeucronError(
        'Data signing (POST /integrity/sign) is not yet exposed on the Data Integrity SDK service.',
        new Error('signData not implemented'),
        { type: 'internal' }
    );
}

/**
 * Encrypt data for secure storage or transmission.
 * MCP Tool: `neucron_encrypt_data`
 */
export async function neucron_encrypt_data(services: McpFlowServices, options: NeucronEncryptDataOptions) {
    void services;
    void options;
    throw new NeucronError(
        'Data encryption (POST /integrity/encrypt) is not yet exposed on the Data Integrity SDK service.',
        new Error('encryptData not implemented'),
        { type: 'internal' }
    );
}
