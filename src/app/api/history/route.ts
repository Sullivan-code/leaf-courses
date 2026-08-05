import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // @ts-ignore
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
          userId: userId,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: conversation.id,
        title: conversation.title,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      });
    }

    // @ts-ignore
    const conversations = await prisma.conversation.findMany({
      where: { 
        userId: userId 
      },
      orderBy: { 
        updatedAt: 'desc' 
      },
      include: {
        messages: {
          orderBy: { 
            createdAt: 'asc' 
          },
          take: 1,
        },
      },
    });

    const formattedConversations = conversations.map((conv: any) => ({
      id: conv.id,
      title: conv.title,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      messageCount: conv.messages.length,
      preview: conv.messages[0]?.content || '',
    }));

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error('History GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { conversationId, messages, title } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // @ts-ignore
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userId: userId,
      },
    });

    if (!existingConversation) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    const updateData: any = {
      title: title || existingConversation.title,
      updatedAt: new Date(),
    };

    if (messages && Array.isArray(messages) && messages.length > 0) {
      updateData.messages = {
        deleteMany: {},
        create: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt || new Date(),
        })),
      };
    }

    // @ts-ignore
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: updateData,
      include: {
        messages: true,
      },
    });

    return NextResponse.json({
      success: true,
      conversation: updatedConversation,
    });
  } catch (error) {
    console.error('History POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // @ts-ignore
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userId: userId,
      },
    });

    if (!existingConversation) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // @ts-ignore
    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('History DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}