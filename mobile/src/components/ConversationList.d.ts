import { ConversationPreview } from "@/types/chat";
interface ConversationListProps {
    conversations: ConversationPreview[];
    activeConversationId?: string;
    onSelectConversation: (conversationId: string) => void;
}
export declare function ConversationList({ conversations, activeConversationId, onSelectConversation }: ConversationListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ConversationList.d.ts.map