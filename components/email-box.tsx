"use client";

import { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import { Mail, RefreshCw, Trash2, Edit, QrCode, Copy, Check, CheckCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { QRCodeModal } from "./qr-code-modal";
import { cn } from "@/lib/utils";
import { MessageModal } from "./message-modal";
import { ErrorPopup } from "./error-popup";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { ShareDropdown } from "./ShareDropdown";
import { AnimatePresence, motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const DOMAINS = [
  "saleis.live",
  "arrangewith.me",
  "areueally.info",
  "ditapi.info",
  "ditcloud.info",
  "ditdrive.info",
  "ditgame.info",
  "ditlearn.info",
  "ditpay.info",
  "ditplay.info",
  "ditube.info",
  "junkstopper.info",
  "whatsyour.info"];

function generateRandomEmail(domain: string = DOMAINS[0]): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const length = 6; // Define the desired length of the email prefix
  let prefix = "";

  for (let i = 0; i < length; i++) {
    prefix += chars[Math.floor(Math.random() * chars.length)];
  }

  return `${prefix}@${domain}`;
}

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
}

export function EmailBox() {
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [emailHistory, setEmailHistory] = useState<string[]>([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: "email" | "message"; id?: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [oldEmailUsed, setOldEmailUsed] = useState(false);
  const [blockButtons, setBlockButtons] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]); // Default to the first domain
  const [primaryDomain, setPrimaryDomain] = useState<string | null>(null);
  const [discoveredUpdates, setDiscoveredUpdates] = useState({
    newDomains: false
  });

  useEffect(() => {
    const initializeEmailBox = async () => {
      // Check for stored token or fetch a new one
      const storedToken = getCookie("authToken") as string | undefined;
      if (storedToken) {
        setToken(storedToken);
      } else {
        await fetchToken(); // Fetches and sets token in state
      }

      // Generate a random email after ensuring the token is set
      if (typeof window !== 'undefined') {
        // randomize domain selection too
        let domain = localStorage.getItem('primaryDomain') as string
        setPrimaryDomain(domain || null);

        if (!domain && !(DOMAINS.includes(domain))) {
          domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
        }
        const newEmail = generateRandomEmail(domain);
        setEmail(newEmail);
        setSelectedDomain(domain); // Set the selected domain to the random one

        // Load updates from localStorage
        const updates = localStorage.getItem('discoveredUpdates');
        if (updates) {
          setDiscoveredUpdates(JSON.parse(updates));
        } else {
          localStorage.setItem('discoveredUpdates', JSON.stringify({ newDomains: false }));
        }
      }
    };

    initializeEmailBox();
  }, []);

  useEffect(() => {
    if (email && token) {
      refreshInbox(); // Initial inbox load

      const mailboxName = email.split("@")[0];
      const socket = new WebSocket(`wss://ws.junkstopper.info/?mailbox=${mailboxName}`);

      socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      socket.onmessage = () => {
        // const data = JSON.parse(event.data);

        // Option 1: Automatically refresh full inbox
        refreshInbox();

        // Option 2: Append message if structure is known
        // setMessages((prev) => [data.message, ...prev]);
      };

      return () => {
        socket.close(); // Cleanup on component unmount or email change
      };
    }
  }, [email, token, oldEmailUsed]); // Add WebSocket dependencies


  // eslint-disable-next-line react-hooks/exhaustive-deps

  // 1. Load history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedHistory = localStorage.getItem('emailHistory');
      if (storedHistory) {
        setEmailHistory(JSON.parse(storedHistory));
      }
    }
  }, []);

  // 2. Update history when email changes and not editing
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      email &&
      !isEditing
    ) {
      const updatedHistory = [email, ...emailHistory.filter(e => e !== email)].slice(0, 5);
      setEmailHistory(updatedHistory);
      localStorage.setItem('emailHistory', JSON.stringify(updatedHistory));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, isEditing]);


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
      setError(`Error fetching token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };


  const refreshInbox = async () => {
    if (!token) {
      setError('Not authenticated');
      return;
    }
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/mailbox?mailbox=${email.split('@')[0]}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const typedData = data as { success: boolean; data: Message[]; message?: string };
      if (typedData.success && Array.isArray(typedData.data)) {
        setMessages(typedData.data);
      } else {
        throw new Error(typedData.message || 'Failed to fetch messages');
      }
    } catch (error) {
      setError(`Error fetching inbox: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const changeEmail = () => {
    if (isEditing) {
      const [prefix] = email.split('@')
      if (prefix && prefix.length > 0) {
        const newEmail = `${prefix}@${selectedDomain}`
        setEmail(newEmail)
        setIsEditing(false)

      } else {
        setError('Please enter a valid email prefix')
      }
      if (prefix && token) {
        refreshInbox(); // Refresh inbox only when both email and token are available
        const updatedHistory = [email, ...emailHistory.filter(e => e !== email)].slice(0, 5)
        setEmailHistory(updatedHistory)
        if (typeof window !== 'undefined') {

          localStorage.setItem('emailHistory', JSON.stringify(updatedHistory))
        }
      }
    } else {
      setIsEditing(true)

    }
  }

  const deleteEmail = () => {
    setItemToDelete({ type: 'email' })
    setIsDeleteModalOpen(true)
  }

  const deleteMessage = (messageId: string) => {
    setItemToDelete({ type: 'message', id: messageId })
    setIsDeleteModalOpen(true)
  }

  const viewMessage = async (message: Message) => {
    setSelectedMessage(message)
    setIsMessageModalOpen(true)
  }

  const handleDeleteConfirmation = async () => {
    if (itemToDelete?.type === 'email') {
      let domain = localStorage.getItem('primaryDomain') as string
      if (!domain && !(DOMAINS.includes(domain))) {
        domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
      }
      const newEmail = generateRandomEmail(domain);
      setEmail(newEmail);
      setSelectedDomain(domain); // Set the selected domain to the random one
      setMessages([])
      if (email && token) {
        refreshInbox(); // Refresh inbox only when both email and token are available
      }

    } else if (itemToDelete?.type === 'message' && itemToDelete.id) {
      try {
        const response = await fetch(`/api/mailbox?mailbox=${email.split('@')[0]}&messageId=${itemToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        const typedData = data as { success: boolean; message?: string };
        if (typedData.success) {
          setMessages(messages.filter(m => m.id !== itemToDelete.id))
        } else {
          throw new Error(typedData.message || 'Failed to delete message');
        }
      } catch (error) {
        setError(`Error deleting message: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }

  const handleEmailInputChage = (newPrefix: string) => {
    // only small aplhabets allowed if upper then change to lower
    newPrefix = newPrefix.toLowerCase()
    // Allow characters valid in email prefixes (alphanumeric, dots, underscores, and hyphens)
    newPrefix = newPrefix.replace(/[^a-z0-9._-]/g, '');
    setEmail(`${newPrefix}@${selectedDomain}`);
    if (newPrefix.length === 0) {
      setBlockButtons(true);
    } else {
      setBlockButtons(false);
    }
  }
  const handleDomainChange = (newDomain: string) => {
    setSelectedDomain(newDomain);
    const prefix = email.split("@")[0];
    setEmail(`${prefix}@${newDomain}`);
  };

  const handleNewDomainUpdates = () => {
    setDiscoveredUpdates({ newDomains: true });
    localStorage.setItem('discoveredUpdates', JSON.stringify({ newDomains: true }));
  }

  const handlePrimaryDomainChange = (domain: string) => {
    const current = localStorage.getItem('primaryDomain');

    if (current === domain) {
      // Remove from localStorage and clear state
      localStorage.removeItem('primaryDomain');
      setPrimaryDomain('');
    } else {
      // Set new primary domain
      localStorage.setItem('primaryDomain', domain);
      setPrimaryDomain(domain);
    }
  };


  return (
    <Card className="border-dashed">

      <CardContent className="space-y-4 pt-10">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex flex-1 items-center gap-2">
              <Input
                value={email.split('@')[0]}
                onChange={(e) => handleEmailInputChage(e.target.value)}
                className="flex-1 r"
                placeholder="username"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild >
                  <Button variant="outline" className="w-1/2 truncate">
                    {selectedDomain || 'Select Domain'}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-[min(100%,14rem)] max-h-[60vh] overflow-y-auto p-1 rounded-md bg-white dark:bg-zinc-900 shadow-lg border border-muted z-50 custom-scrollbar"
                >
                  {DOMAINS.map((domain, i) => (
                    <DropdownMenuItem
                      key={i}
                      onSelect={() => handleDomainChange(domain)}
                      className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-muted dark:hover:bg-zinc-800"
                    >
                      <span className={primaryDomain === domain ? 'font-semibold text-yellow-600 dark:text-yellow-400' : ''}>
                        {domain}
                      </span>
                      <Button
                        title={primaryDomain === domain ? 'Unset primary' : 'Set as primary'}

                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrimaryDomainChange(domain);
                        }}
                        aria-label={`Set ${domain} as primary`}
                        className="hover:bg-transparent"
                      >
                        <Star
                          className={`h-4 w-4 ${primaryDomain === domain
                            ? 'fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400'
                            : 'text-muted-foreground'
                            }`}
                        />
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex-1 rounded-md bg-muted p-2">
              {email || 'Loading...'}
            </div>
          )}
          <div className="flex gap-2" role="group" aria-label="Email actions">
            <Button
              variant="secondary"
              size="icon"
              onClick={copyEmail}
              className="relative"
              disabled={blockButtons}
              aria-label="Copy email address"
              title="Copy email address"
            >
              <Copy className={cn(
                "h-4 w-4 transition-all",
                copied ? "opacity-0" : "opacity-100"
              )} />
              <span className={cn(
                "absolute inset-0 flex items-center justify-center transition-all",
                copied ? "opacity-100" : "opacity-0"
              )}>
                <Check className="h-4 w-4 transition-all" />
              </span>
            </Button>
            <Button
              className="hidden xs:flex"
              variant="secondary"
              size="icon"
              onClick={() => setIsQRModalOpen(true)}
              disabled={blockButtons}
              title="Show QR code"
              aria-label="Show QR code"
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <ShareDropdown />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Email management actions">
          <Button
            disabled={blockButtons || isRefreshing}
            variant="outline"
            className="flex-1"
            onClick={refreshInbox}
            aria-label={isRefreshing ? "Refreshing inbox" : "Refresh inbox"}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing' : 'Refresh'}</span>
          </Button>
          <Button
            disabled={blockButtons}
            variant="outline"
            className="flex-1"
            onClick={() => {
              changeEmail();
              handleNewDomainUpdates(); // Call this to update the discovered updates state
            }}
            aria-label={isEditing ? "Save email changes" : "Change email"}
          >
            {!isEditing ? <Edit className="mr-2 h-4 w-4" /> : <CheckCheck className="mr-2 h-4 w-4" />}
            <span className="hidden sm:inline">{isEditing ? 'Save' : 'Change'}</span>
            <AnimatePresence>
              {!discoveredUpdates.newDomains && (
                <motion.span
                  key="new-badge"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-[10px] bg-black text-white rounded-full px-1.5"
                >
                  new
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
          <Button
            disabled={blockButtons}
            variant="outline"
            className="flex-1"
            onClick={deleteEmail}
            aria-label="Delete email address"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SENDER</TableHead>
              <TableHead>SUBJECT</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <div className="py-12">
                    <div className="mb-4 flex justify-center">
                      <Mail className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="text-lg font-medium">Your inbox is empty</div>
                    <div className="text-sm text-muted-foreground">Waiting for incoming emails. No need to refresh.</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {messages.map((message, index) => (
                  <TableRow key={message.id} className={index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}>
                    <TableCell>{message.from}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>{new Date(message.date).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="link" onClick={() => viewMessage(message)}>View</Button>
                      <Button variant="link" onClick={() => deleteMessage(message.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {messages.length < 5 &&
                  Array.from({ length: 5 - messages.length }).map((_, index) => (
                    <TableRow key={`blank-${index}`} >
                      <TableCell colSpan={4}>&nbsp;</TableCell>
                    </TableRow>
                  ))
                }
              </>
            )}
          </TableBody>

        </Table>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Email History</h3>
          <ul className="space-y-2">
            {emailHistory.map((historyEmail, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{historyEmail}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEmail(historyEmail);
                    setOldEmailUsed(!oldEmailUsed);
                  }}
                >
                  Use
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardHeader>
        <h2 className="text-xl font-semibold">Your Best Temporary Email Address</h2>
        <p className="text-sm text-muted-foreground">
          Forget about spam, advertising mailings, hacking and attacking robots. Keep your real mailbox clean and secure.
        </p>
      </CardHeader>
      <QRCodeModal
        email={email}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
      <MessageModal
        message={selectedMessage}
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
      />
      {error && (
        <ErrorPopup
          message={error}
          onClose={() => setError(null)}
        />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmation}
        itemToDelete={itemToDelete?.type === 'email' ? 'email address' : 'message'}
      />
    </Card>
  )
}
