import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  user_id: string;
  display_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const MessagesPanel = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.receiver_id === currentUser?.id || newMsg.sender_id === currentUser?.id) {
            setMessages(prev => [...prev, newMsg]);
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    // Group messages by conversation partner
    const conversationMap = new Map<string, Conversation>();
    
    for (const msg of data || []) {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      
      if (!conversationMap.has(partnerId)) {
        // Fetch partner profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', partnerId)
          .single();

        conversationMap.set(partnerId, {
          user_id: partnerId,
          display_name: profile?.display_name || 'Usuário',
          last_message: msg.message,
          last_message_time: msg.created_at,
          unread_count: 0
        });
      }

      if (msg.receiver_id === user.id && !msg.read) {
        const conv = conversationMap.get(partnerId)!;
        conv.unread_count++;
      }
    }

    setConversations(Array.from(conversationMap.values()));
  };

  const fetchMessages = async (userId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);

    // Mark received messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', user.id)
      .eq('sender_id', userId)
      .eq('read', false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || !currentUser) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        receiver_id: selectedUserId,
        message: newMessage.trim()
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
    fetchConversations();
  };

  if (!selectedUserId) {
    return (
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-4 px-4 pt-4">
          <MessageSquare className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Mensagens</h3>
        </div>

        <ScrollArea className="h-[400px]">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
              <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhuma conversa</p>
            </div>
          ) : (
            <div className="space-y-2 px-4 pb-4">
              {conversations.map((conv) => (
                <div
                  key={conv.user_id}
                  className="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md hover:bg-accent"
                  onClick={() => setSelectedUserId(conv.user_id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {conv.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {conv.display_name}
                        </h4>
                        {conv.unread_count > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.last_message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(conv.last_message_time), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

  const selectedConv = conversations.find(c => c.user_id === selectedUserId);

  return (
    <div className="w-full max-w-md flex flex-col h-[500px]">
      <div className="flex items-center gap-2 p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedUserId(null)}
        >
          ←
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {selectedConv?.display_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold">{selectedConv?.display_name}</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((msg) => {
            const isOwn = msg.sender_id === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {formatDistanceToNow(new Date(msg.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPanel;