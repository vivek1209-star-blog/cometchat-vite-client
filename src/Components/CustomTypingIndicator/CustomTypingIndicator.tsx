import { useEffect, useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

// Define the props type
interface CustomTypingIndicatorProps {
  user?: CometChat.User;
  group?: CometChat.Group;
}

const CustomTypingIndicator: React.FC<CustomTypingIndicatorProps> = ({ user, group }) => {
  const [isTyping, setIsTyping] = useState<boolean>(false);

useEffect(() => {
  if (!user && !group) return;

  const listenerID = "TYPING_LISTENER_" + (user?.getUid() || group?.getGuid());

  CometChat.addMessageListener(
    listenerID,
    new CometChat.MessageListener({
      onTypingStarted: (typingIndicator: CometChat.TypingIndicator) => {
        const receiverType = typingIndicator.getReceiverType();
        const receiverId = typingIndicator.getReceiverId();
        const sender = typingIndicator.getSender(); // returns a User

        if (
          (user && receiverType === "user" && sender.getUid() === user.getUid()) ||
          (group && receiverType === "group" && receiverId === group.getGuid())
        ) {
          setIsTyping(true);
        }
      },
      onTypingEnded: (typingIndicator: CometChat.TypingIndicator) => {
        const receiverType = typingIndicator.getReceiverType();
        const receiverId = typingIndicator.getReceiverId();
        const sender = typingIndicator.getSender();

        if (
          (user && receiverType === "user" && sender.getUid() === user.getUid()) ||
          (group && receiverType === "group" && receiverId === group.getGuid())
        ) {
          setIsTyping(false);
        }
      }
    })
  );

  return () => {
    CometChat.removeMessageListener(listenerID);
  };
}, [user, group]);


  if (!isTyping) return null;

  return <div className="typing-indicator">User is typing...</div>;
};

export default CustomTypingIndicator;
