import { User, Conversation } from './types';
export declare function userLogin(username: string): Promise<User>;
export declare function createConversation(user1Id: number, user2Id: number): Promise<Conversation>;
export declare function getConversationsByUserId(userId: number): Promise<Conversation[]>;
//# sourceMappingURL=api.d.ts.map