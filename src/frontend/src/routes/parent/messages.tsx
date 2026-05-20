import { ParentLayout } from "@/components/portals/ParentLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useParentData } from "@/hooks/useParentData";
import type { Message } from "@/hooks/useParentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MessageCircle, Reply, Send, User } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/parent/messages")({
  component: ParentMessages,
});

function ParentMessages() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    messages,
    markMessageRead,
    sendReply,
    unreadNotices,
    unreadMessages,
  } = useParentData();
  const [selected, setSelected] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role !== "parent")
      navigate({ to: "/login" });
  }, [currentUser, navigate]);

  const handleSelect = (msg: Message) => {
    setSelected(msg);
    setReplyText("");
    setReplySent(false);
    markMessageRead(msg.id);
  };

  const handleSendReply = () => {
    if (!selected || !replyText.trim()) return;
    sendReply(selected.id, replyText.trim());
    setReplyText("");
    setReplySent(true);
    setTimeout(() => setReplySent(false), 3000);
  };

  return (
    <ParentLayout unreadNotices={unreadNotices} unreadMessages={unreadMessages}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Messages</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {unreadMessages} unread message{unreadMessages !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          {/* Message List */}
          <div className="md:col-span-1 bg-card rounded-xl border border-border overflow-y-auto">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">
                Inbox ({messages.length})
              </p>
            </div>
            {messages.length === 0 ? (
              <div
                data-ocid="parent.messages.empty_state"
                className="text-center py-12"
              >
                <MessageCircle
                  size={32}
                  className="mx-auto text-muted-foreground/40 mb-2"
                />
                <p className="text-sm text-muted-foreground">No messages</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {messages.map((msg, i) => (
                  <button
                    key={msg.id}
                    type="button"
                    data-ocid={`parent.messages.item.${i + 1}`}
                    onClick={() => handleSelect(msg)}
                    className={
                      selected?.id === msg.id
                        ? "w-full text-left px-4 py-3 bg-blue-50 border-r-2 border-[#1e3a5f] hover:bg-muted/30 transition-colors"
                        : "w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors"
                    }
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User size={14} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={
                              !msg.isRead
                                ? "text-xs font-semibold truncate text-foreground"
                                : "text-xs font-semibold truncate text-muted-foreground"
                            }
                          >
                            {msg.from}
                          </p>
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        <p
                          className={
                            !msg.isRead
                              ? "text-xs truncate mt-0.5 font-medium text-foreground"
                              : "text-xs truncate mt-0.5 text-muted-foreground"
                          }
                        >
                          {msg.subject}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {msg.date}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="md:col-span-2 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
            {selected ? (
              <>
                {/* Header */}
                <div className="px-5 py-4 border-b border-border bg-muted/20">
                  <h3 className="font-semibold text-foreground">
                    {selected.subject}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-foreground">
                      {selected.from}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {selected.fromRole}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {selected.date} · {selected.time}
                    </span>
                  </div>
                </div>

                {/* Thread */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {selected.content}
                    </p>
                  </div>

                  {selected.thread?.map((reply) => (
                    <div
                      key={reply.id}
                      data-ocid={`parent.messages.reply.${reply.id}`}
                      className="ml-6 bg-blue-50 border border-blue-100 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Reply size={12} className="text-blue-500" />
                        <span className="text-xs font-semibold text-blue-800">
                          {reply.from}
                        </span>
                        <span className="ml-auto text-xs text-blue-600">
                          {reply.date} · {reply.time}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}

                  {replySent && (
                    <div
                      data-ocid="parent.messages.success_state"
                      className="text-center py-2"
                    >
                      <span className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-medium">
                        ✓ Reply sent successfully
                      </span>
                    </div>
                  )}
                </div>

                {/* Reply Box */}
                <div className="px-5 py-4 border-t border-border bg-muted/10">
                  <Textarea
                    data-ocid="parent.messages.reply_input"
                    placeholder="Type your reply to the teacher..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    className="resize-none text-sm mb-3"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      data-ocid="parent.messages.send_reply_button"
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="bg-[#1e3a5f] hover:bg-blue-900 text-white font-semibold"
                    >
                      <Send size={15} className="mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div
                data-ocid="parent.messages.empty_state"
                className="flex-1 flex flex-col items-center justify-center text-center p-8"
              >
                <MessageCircle
                  size={48}
                  className="text-muted-foreground/30 mb-4"
                />
                <p className="font-medium text-muted-foreground">
                  Select a message
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Choose a message from the inbox to read and reply
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
