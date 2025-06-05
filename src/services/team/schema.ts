import z from 'zod';

export const memberListSchema = z.object({
    XNeucronTeamID: z.string().min(1),
    memberName: z.string().optional(),
    role: z.string().optional(),
    pageNumber: z.number().optional(),
    limit: z.number().optional(),
});
