"use client";

import {
  getNotifications,
  markNotificationsAsRead,
} from "@/actions/notification.action";
import { NotificationsSkeleton } from "@/components/NotificationSkeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  HeartIcon,
  MessageCircleIcon,
  UserPlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Tipo baseado no retorno da API
interface Notification {
  id: string;
  type: string;
  read: boolean;
  createdAt: Date;
  creator: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  post?: {
    id: string;
    content: string | null;
    image: string | null;
  } | null;
  comment?: {
    id: string;
    content: string | null;
    createdAt: Date;
  } | null;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="size-4 text-red-500" />;
    case "COMMENT":
      return <MessageCircleIcon className="size-4 text-blue-500" />;
    case "FOLLOW":
      return <UserPlusIcon className="size-4 text-green-500" />;
    default:
      return null;
  }
};

const getNotificationMessage = (type: string, creatorName: string) => {
  switch (type) {
    case "FOLLOW":
      return `${creatorName} começou a seguir você`;
    case "LIKE":
      return `${creatorName} curtiu sua publicação`;
    case "COMMENT":
      return `${creatorName} comentou na sua publicação`;
    default:
      return `${creatorName} interagiu com você`;
  }
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const result = await getNotifications();
        
        // Verifica se a resposta foi bem-sucedida e extrai os dados
        if (result.success && Array.isArray(result.data)) {
          setNotifications(result.data);
          
          // Marca as não lidas como lidas
          const unreadIds = result.data
            .filter((n: Notification) => !n.read)
            .map((n: Notification) => n.id);
            
          if (unreadIds.length > 0) {
            await markNotificationsAsRead(unreadIds);
          }
        } else {
          setNotifications([]);
          toast.error(result.error || "Falha ao carregar notificações");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Falha ao carregar notificações");
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Calcula o número de notificações não lidas
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) return <NotificationsSkeleton />;

  return (
    <div className="relative w-full min-h-screen">
      {/* Fundo com imagem e camada branca translúcida */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/images/raphapsi.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
      </div>

      {/* Conteúdo principal */}
      <div className="space-y-4 p-6 relative z-10">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Notificações</CardTitle>
              <span className="text-sm text-muted-foreground">
                {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhuma notificação ainda
                </div>
              ) : (
                notifications.map((notification) => {
                  const creatorName = notification.creator.name ?? 
                    notification.creator.username ?? 
                    'Usuário';
                  
                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                        !notification.read ? "bg-muted/50" : ""
                      }`}
                    >
                      <Avatar className="mt-1">
                        <AvatarImage
                          src={notification.creator.image ?? "/avatar.png"}
                        />
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {getNotificationIcon(notification.type)}
                          <span className="text-sm">
                            {getNotificationMessage(notification.type, creatorName)}
                          </span>
                        </div>

                        {notification.post &&
                          (notification.type === "LIKE" ||
                            notification.type === "COMMENT") && (
                            <div className="pl-6 space-y-2">
                              <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                                <p className="line-clamp-2">{notification.post.content}</p>
                                {notification.post.image && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={notification.post.image}
                                    alt="Conteúdo da publicação"
                                    className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                                  />
                                )}
                              </div>

                              {notification.type === "COMMENT" &&
                                notification.comment && (
                                  <div className="text-sm p-2 bg-accent/50 rounded-md">
                                    {notification.comment.content}
                                  </div>
                                )}
                            </div>
                          )}

                        <p className="text-sm text-muted-foreground pl-6">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            { 
                              addSuffix: true,
                              locale: ptBR 
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NotificationsPage;