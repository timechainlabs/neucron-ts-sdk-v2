import { z } from 'zod';
import { memberListSchema } from './schema';

export type TeamListResponse = {
    business_id: string;
    description: string;
    is_owner: boolean;
    owner_id: string;
    role: string;
    team_id: string;
    team_name: string;
}[];

export type MemberList = z.infer<typeof memberListSchema>;
export type MemberListResponse = {
    list: {
        email: string;
        full_name: string;
        is_owner: boolean;
        joined_at: string;
        role: string;
        team_id: string;
        user_id: string;
    }[];
    page_meta: {
        page: number;
        limit: number;
        total: number;
        next_page: number;
        total_pages: number;
    };
};
