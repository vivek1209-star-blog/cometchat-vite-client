import { useEffect, useState } from "react";
import {
  CometChatMessageComposer,
  CometChatMessageList,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatSelector } from "./Components/CometChatSelector/CometChatSelector";
import "./App.css";
import '@cometchat/chat-uikit-react/css-variables.css';
import CustomTypingIndicator from "./Components/CustomTypingIndicator/CustomTypingIndicator.tsx";
import { MessageHeaderDemo } from "./Components/MessageHeaderDemo/MessageHeaderDemo.tsx";
import { ThreadHeaderDemo } from "./Components/ThreadHeaderDemo/ThreadHeaderDemo.tsx";
import { useAppDispatch, useAppSelector } from './hooks/index.ts';
import { initCometChat } from './features/chat/chatSlice';

function App() {
  const dispatch = useAppDispatch();
  const isReady = useAppSelector(state => state.chat.isReady);

  const [selectedUser, setSelectedUser] = useState<CometChat.User>();
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group>();
  const [selectedCall, setSelectedCall] = useState<CometChat.Call>();

  useEffect(() => {
    dispatch(initCometChat());
  }, [dispatch]);

  if (!isReady) {
    return <div className="loading">Initializing Chat...</div>;
  }

  return (
    <div className="conversations-with-messages">
      <div className="conversations-wrapper">
        <CometChatSelector
          onSelectorItemClicked={item => {
            let target = item;
            if (item instanceof CometChat.Conversation) {
              target = item.getConversationWith();
            }
            if (target instanceof CometChat.User) {
              setSelectedUser(target);
              setSelectedGroup(undefined);
              setSelectedCall(undefined);
            } else if (target instanceof CometChat.Group) {
              setSelectedGroup(target);
              setSelectedUser(undefined);
              setSelectedCall(undefined);
            } else if (target instanceof CometChat.Call) {
              setSelectedCall(target);
              setSelectedUser(undefined);
              setSelectedGroup(undefined);
            }
          }}
        />
      </div>

      {selectedUser || selectedGroup || selectedCall ? (
        <div className="messages-wrapper">
          {selectedUser && <MessageHeaderDemo user={selectedUser} />}
          <ThreadHeaderDemo />
          <CustomTypingIndicator user={selectedUser} group={selectedGroup} />
          <CometChatMessageList user={selectedUser} group={selectedGroup} />
          <CometChatMessageComposer user={selectedUser} group={selectedGroup} />
        </div>
      ) : (
        <div className="empty-conversation">Select Conversation to start</div>
      )}
    </div>
  );
}

export default App;
