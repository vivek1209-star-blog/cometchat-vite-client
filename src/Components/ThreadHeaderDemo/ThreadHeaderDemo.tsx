import React from "react";
import { CometChatThreadHeader } from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export function ThreadHeaderDemo() {
  const [parentMessage, setParentMessage] = React.useState<CometChat.BaseMessage>();
  const [chatWithUser, setChatWithUser] = React.useState<CometChat.User>();

  React.useEffect(() => {
    // Replace "uid" with actual user id and "Parent Message Id" with actual id
    CometChat.getUser("uid").then((user) => setChatWithUser(user));
    CometChat.getMessageDetails("Parent Message Id").then((msg) => setParentMessage(msg));
  }, []);

  // Custom bubble view
  const messageBubbleView = () => {
    return <div style={{ padding: "4px 8px", color: "#333" }}>✨ Custom bubble view</div>;
  };

  return chatWithUser && parentMessage ? (
    <CometChatThreadHeader
      parentMessage={parentMessage}
      messageBubbleView={messageBubbleView()}
    />
  ) : null;
}
