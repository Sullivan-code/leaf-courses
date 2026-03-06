"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { NotificationType } from "@prisma/client"; // Importe o enum do Prisma

export async function getNotifications() {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: true, data: [] };

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Failed to fetch notifications", data: [] };
  }
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false, error: "Failed to mark notifications as read" };
  }
}

export async function createNotification(data: {
  userId: string;
  creatorId: string;
  type: NotificationType;  // Agora usando o enum do Prisma
  postId?: string;
  commentId?: string;
}) {
  try {
    // Validação básica baseada no tipo
    if (data.type === 'LIKE' && !data.postId) {
      throw new Error("Like notification requires postId");
    }
    if (data.type === 'COMMENT' && !data.commentId) {
      throw new Error("Comment notification requires commentId");
    }
    if (data.type === 'FOLLOW' && (data.postId || data.commentId)) {
      // FOLLOW não deve ter postId ou commentId
      data.postId = undefined;
      data.commentId = undefined;
    }

    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        creatorId: data.creatorId,
        type: data.type,
        postId: data.postId,
        commentId: data.commentId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return { success: true, data: notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}

// Função utilitária para criar notificações específicas
export async function createLikeNotification(userId: string, creatorId: string, postId: string) {
  return createNotification({
    userId,
    creatorId,
    type: 'LIKE',
    postId,
  });
}

export async function createCommentNotification(userId: string, creatorId: string, postId: string, commentId: string) {
  return createNotification({
    userId,
    creatorId,
    type: 'COMMENT',
    postId,
    commentId,
  });
}

export async function createFollowNotification(userId: string, creatorId: string) {
  return createNotification({
    userId,
    creatorId,
    type: 'FOLLOW',
  });
}

export async function getUnreadCount() {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: true, count: 0 };

    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error getting unread count:", error);
    return { success: false, error: "Failed to get unread count", count: 0 };
  }
}

export async function markAllAsRead() {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, error: "User not found" };

    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking all as read:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}