import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeader } from "@/lib/auth";

const MessageList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const { data: messages, isLoading, error } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: number; isRead: boolean }) => {
      const response = await apiRequest(
        "PUT", 
        `/api/messages/${id}/read`, 
        { isRead }, 
        getAuthHeader()
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message status updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(
        "DELETE", 
        `/api/messages/${id}`, 
        undefined, 
        getAuthHeader()
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setSelectedMessage(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    },
  });

  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    
    // If message is not read, mark it as read
    if (!message.isRead) {
      markAsReadMutation.mutate({ id: message.id, isRead: true });
    }
  };

  const closeDialog = () => {
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(id);
    }
  };

  const toggleReadStatus = (message: Message) => {
    markAsReadMutation.mutate({ 
      id: message.id, 
      isRead: !message.isRead 
    });
  };

  // Format date to readable string
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Messages</CardTitle>
        <CardDescription>View and manage inquiries from potential customers.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-10">Loading messages...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error loading messages</div>
        ) : messages && messages.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id} className={!message.isRead ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.interest}</TableCell>
                  <TableCell>{formatDate(message.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={message.isRead ? "secondary" : "default"}>
                      {message.isRead ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => viewMessage(message)}>
                        View
                      </Button>
                      <Button 
                        variant={message.isRead ? "outline" : "secondary"} 
                        size="sm"
                        onClick={() => toggleReadStatus(message)}
                      >
                        {message.isRead ? "Mark Unread" : "Mark Read"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No messages found
          </div>
        )}

        {/* Message Details Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={closeDialog}>
          <DialogContent className="max-w-3xl">
            {selectedMessage && (
              <>
                <DialogHeader>
                  <DialogTitle>Message from {selectedMessage.name}</DialogTitle>
                  <DialogDescription>
                    Received on {formatDate(selectedMessage.createdAt)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <h4 className="text-sm font-medium">Contact Information</h4>
                    <p className="text-sm">Email: {selectedMessage.email}</p>
                    <p className="text-sm">Phone: {selectedMessage.phone}</p>
                    <p className="text-sm">Interest: {selectedMessage.interest}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Message</h4>
                    <p className="text-sm whitespace-pre-wrap mt-1">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                  >
                    Delete
                  </Button>
                  <Button variant="outline" onClick={closeDialog}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MessageList;
