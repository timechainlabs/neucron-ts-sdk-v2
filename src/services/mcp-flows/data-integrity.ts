import type { McpFlowServices } from './types.js';
import type {
    NeucronInscribeDocumentOptions,
    NeucronInscribeTextOptions,
    NeucronInscribeTextArrayOptions,
} from './types.js';

/**
 * Inscribe a file on-chain for immutable proof of existence.
 * MCP Tool: `neucron_inscribe_document`
 */
export async function neucron_inscribe_document(services: McpFlowServices, options: NeucronInscribeDocumentOptions) {
    const inscription = await services.dataIntegrity.fileUpload(options);
    return { inscription: inscription.data };
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
 * Inscribe multiple text entries on-chain in a single transaction.
 * MCP Tool: `neucron_inscribe_text_array`
 */
export async function neucron_inscribe_text_array(services: McpFlowServices, options: NeucronInscribeTextArrayOptions) {
    const inscription = await services.dataIntegrity.textArrayUpload(options);
    return { inscription: inscription.data };
}
