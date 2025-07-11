"use client"

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getCookie, setCookie } from "cookies-next"
import { Loader } from 'lucide-react'

interface Message {
  id: string
  from: string
  to: string
  subject: string
  date: string
  body?: string
  html?: string
}

interface MessageModalProps {
  message: Message | null
  isOpen: boolean
  onClose: () => void
}

export function MessageModal({ message, isOpen, onClose }: MessageModalProps) {
  const [fullMessage, setFullMessage] = useState<Message | null>(null)
  const [token, setToken] = useState<string | undefined>(undefined)

  useEffect(() => {
    const storedToken = getCookie("authToken") as string | undefined;
    if (storedToken) {
      console.log("Using stored token:", storedToken);
      setToken(storedToken);
    } else {
      fetchToken();
    }
  }, []);

  const fetchToken = async () => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as { token?: string };
      if (data.token) {
        setToken(data.token);
        setCookie("authToken", data.token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 3600, // 1 hour in seconds
        });
      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error("Failed to fetch token:", error);
    }
  };

  const fetchFullMessage = useCallback(
    async (messageId: string) => {
      try {
        const response = await fetch(`/api/mailbox?mailbox=${message?.to.split('@')[0]}&messageId=${messageId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json() as { success: boolean; data: Message; message?: string };
        if (data.success) {
          setFullMessage(data.data);
        } else {
          console.error('Failed to fetch full message:', data.message);
        }
      } catch (error) {
        console.error('Error fetching full message:', error);
      }
    },
    [message, token]
  );

  useEffect(() => {
    if (message && isOpen) {
      setFullMessage(null); // Reset fullMessage when a new message is opened
      fetchFullMessage(message.id);
    }
  }, [message, isOpen, fetchFullMessage]);

  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-w-full max-h-full overflow-y-scroll ">
        <DialogHeader>
          <DialogTitle>{message.subject}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p><strong>From:</strong> {message.from}</p>
          <p><strong>To:</strong> {message.to}</p>
          <p><strong>Date:</strong> {new Date(message.date).toLocaleString()}</p>
        </div>
        <div className="mt-4 bg-gray-100 p-4 rounded-md">
          {!fullMessage ? (
            <pre className="whitespace-pre-wrap"><Loader className='animate-spin ' /></pre>
          ) : fullMessage.html && typeof fullMessage.html === "string" ? (
            <div dangerouslySetInnerHTML={{ __html: fullMessage.html }} />
          ) : fullMessage.body && typeof fullMessage.body === "string" ? (
            <pre className="whitespace-pre-wrap">{fullMessage.body}</pre>
          ) : (
            <pre className="whitespace-pre-wrap">No content</pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
