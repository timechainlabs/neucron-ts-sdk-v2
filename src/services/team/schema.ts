import z from 'zod';

const identifierEnum = z.enum(['ASSETYZER', 'NEUCRON']);
const memberRoleEnum = z
    .string()
    .transform((val) => val.toUpperCase() as 'EDITOR' | 'OWNER' | 'VIEWER' | 'ADMINISTRATOR');
const nonEmptyString = z.string().min(1);
const messageResponseSchema = z.object({
    message: nonEmptyString,
});

export const acceptInviteSchema = z.object({
    'X-Neucron-Team-ID': z.string().min(1),
});

export const acceptInviteResponseSchema = messageResponseSchema;

export const invitesListResponseSchema = z.array(
    z.object({
        user_id: nonEmptyString,
        team_id: nonEmptyString,
        role: memberRoleEnum,
    })
);

export const createInviteSchema = z.object({
    'X-Neucron-Team-ID': nonEmptyString,
    'X-Identifier': identifierEnum,
    role: memberRoleEnum,
    emails: z.array(z.string().email()),
});

export const createInviteResponseSchema = messageResponseSchema;

export const pendingInviteSchema = z.object({
    'X-Neucron-Team-ID': nonEmptyString,
});

export const pendingInvitesResponseSchema = z.array(
    z.object({
        email: z.string().email(),
        role: memberRoleEnum,
        user_name: nonEmptyString,
    })
);

export const teamListResponseSchema = z.array(
    z.object({
        business_id: nonEmptyString,
        description: nonEmptyString,
        is_owner: z.boolean(),
        owner_id: nonEmptyString,
        role: memberRoleEnum,
        team_id: nonEmptyString,
        team_name: nonEmptyString,
    })
);

export const memberListSchema = z.object({
    'X-Neucron-Team-ID': nonEmptyString,
    memberName: nonEmptyString.optional(),
    role: memberRoleEnum.optional(),
    pageNumber: z.number().min(1).default(1),
    limit: z.number().min(1).default(20),
});

export const memberListResponseSchema = z.object({
    list: z.array(
        z.object({
            email: z.string().email(),
            full_name: nonEmptyString,
            is_owner: z.boolean(),
            joined_at: nonEmptyString,
            role: memberRoleEnum,
            team_id: nonEmptyString,
            user_id: nonEmptyString,
        })
    ),
    page_meta: z.object({
        page: z.number(),
        limit: z.number(),
        next_page: z.number(),
        total_pages: z.number(),
    }),
});

export const updateMemberRoleSchema = z.object({
    'X-Neucron-Team-ID': nonEmptyString,
    memberID: nonEmptyString,
    role: memberRoleEnum,
});

export const updateMemberRoleResponseSchema = messageResponseSchema;

export const removeMemberSchema = z.object({
    'X-Neucron-Team-ID': nonEmptyString,
    memberID: nonEmptyString,
});

export const removeMemberResponseSchema = messageResponseSchema;
