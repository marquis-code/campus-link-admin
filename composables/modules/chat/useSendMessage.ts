import { useChatState } from './useChatState'

export const useSendMessage = () => {
  const { socket } = useChatState()

  const sendMessage = (data: { 
    conversationId: string; 
    type: 'text' | 'image' | 'video' | 'voice' | 'file'; 
    content?: string;
    mediaUrl?: string;
  }) => {
    socket?.emit('send_message', data)
  }

  const sendTyping = (conversationId: string, typing: boolean) => {
    socket?.emit('typing', { conversationId, isTyping: typing })
  }

  return { sendMessage, sendTyping }
}
