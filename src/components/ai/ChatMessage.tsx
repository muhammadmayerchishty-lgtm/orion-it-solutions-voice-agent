import { RotateCcw } from 'lucide-react';
import type { ChatMessage as ChatMessageModel } from '../../types/ai';

interface ChatMessageProps {
  message: ChatMessageModel;
  onRetry?: (messageId: string) => void;
}

function formatMessageTime(isoTimestamp: string): string {
  try {
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
}

export function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const timeLabel = formatMessageTime(message.timestamp);

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 font-body text-[14px] leading-[1.6] break-words [overflow-wrap:anywhere] ${
          isUser
            ? 'text-[#F5F7FF] shadow-[0_8px_24px_rgba(47,107,255,0.28)]'
            : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#F5F7FF]'
        }`}
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, #2F6BFF 0%, #7B4DFF 100%)',
              }
            : undefined
        }
      >
        <p className="m-0 whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* Timestamp & Error Retry Row */}
      <div className="mt-1.5 px-1 flex items-center gap-2">
        {timeLabel && (
          <span className="font-mono-label text-[10px] text-[#8B93B7] tracking-[0.08em]">
            {timeLabel}
          </span>
        )}

        {isUser && message.status === 'error' && onRetry && (
          <button
            type="button"
            onClick={() => onRetry(message.id)}
            className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[#FCA5A5] hover:text-[#F5F7FF] underline underline-offset-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] rounded"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Failed to send. Retry</span>
          </button>
        )}
      </div>
    </div>
  );
}
export default ChatMessage;
