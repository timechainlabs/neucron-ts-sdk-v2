import { memberListSchema } from './schema';
import { MemberList } from './types';

export default class Validator {
    memberList(member: MemberList): void {
        memberListSchema.parse(member);
    }
}
