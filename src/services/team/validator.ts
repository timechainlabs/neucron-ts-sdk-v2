import { memberListSchema } from './schema.js';
import type { MemberList } from './types.js';

export default class Validator {
    memberList(member: MemberList): void {
        memberListSchema.parse(member);
    }
}
