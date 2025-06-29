import { useEffect } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useAppDispatch, useAppSelector } from "../../hooks/index";
import { setTyping } from "../../features/typing/typingSlice";

interface CustomTypingIndicatorProps {
  user?: CometChat.User;
  group?: CometChat.Group;
}

const CustomTypingIndicator: React.FC<CustomTypingIndicatorProps> = ({ user, group }) => {
  const dispatch = useAppDispatch();
  const isTyping = useAppSelector(state => state.typing.isTyping);

  useEffect(() => {
    if (!user && !group) return;

    const listenerID = "TYPING_LISTENER_" + (user?.getUid() || group?.getGuid());

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTypingStarted: (typingIndicator: CometChat.TypingIndicator) => {
          const receiverType = typingIndicator.getReceiverType();
          const receiverId = typingIndicator.getReceiverId();
          const sender = typingIndicator.getSender();

          if (
            (user && receiverType === "user" && sender.getUid() === user.getUid()) ||
            (group && receiverType === "group" && receiverId === group.getGuid())
          ) {
            dispatch(setTyping(true));
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
            dispatch(setTyping(false));
          }
        }
      })
    );

    return () => {
      CometChat.removeMessageListener(listenerID);
    };
  }, [user, group, dispatch]);

  if (!isTyping) return null;

  return <div className="typing-indicator">User is typing...</div>;
};

export default CustomTypingIndicator;
