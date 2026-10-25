// Freelancer Messages — contract threads with clients (real-time via SSE)
import type { Route } from "./+types/messages";
import { ChatView } from "@/components/globals/chat/chat-view";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Messages — TalentHive" }];
}

export default function FreelancerMessages() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
      <ChatView />
    </div>
  );
}
