import { User, Conversation, UserSummary } from './types';
export declare function userLogin(username: string): Promise<User>;
export declare function createConversation(user1Id: number, user2Id: number): Promise<Conversation>;
export declare function getConversationsByUserId(userId: number): Promise<Conversation[]>;
export declare function findUserByUsername(username: string): Promise<UserSummary | null>;
//# sourceMappingURL=api.d.ts.map