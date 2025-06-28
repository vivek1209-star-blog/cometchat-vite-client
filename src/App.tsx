import { useEffect, useState } from "react";
import {
  CometChatMessageComposer,
  CometChatMessageList,
  CometChatUIKit,
  UIKitSettingsBuilder,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatSelector } from "./Components/CometChatSelector/CometChatSelector";
import "./App.css";
import '@cometchat/chat-uikit-react/css-variables.css';
import CustomTypingIndicator from "./Components/CustomTypingIndicator/CustomTypingIndicator.tsx";
import { MessageHeaderDemo } from "./Components/MessageHeaderDemo/MessageHeaderDemo.tsx";
import { ThreadHeaderDemo } from "./Components/ThreadHeaderDemo/ThreadHeaderDemo.tsx";

const COMETCHAT_CONSTANTS = {
  APP_ID: import.meta.env.VITE_COMETCHAT_APP_ID,
  REGION: import.meta.env.VITE_COMETCHAT_REGION,
  AUTH_KEY: import.meta.env.VITE_COMETCHAT_AUTH_KEY,
  UID: import.meta.env.VITE_COMETCHAT_UID,
};

function App() {
  const [isReady, setIsReady] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CometChat.User>();
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group>();
  const [selectedCall, setSelectedCall] = useState<CometChat.Call>();

  useEffect(() => {
    const init = async () => {
      const settings = new UIKitSettingsBuilder()
        .setAppId(COMETCHAT_CONSTANTS.APP_ID)
        .setRegion(COMETCHAT_CONSTANTS.REGION)
        .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
        .subscribePresenceForAllUsers()
        .build();

      try {
        await CometChatUIKit.init(settings);
        console.log("CometChat initialized");

        await CometChatUIKit.login(COMETCHAT_CONSTANTS.UID);
        console.log("User logged in");

        CometChat.addUserListener(
          "USER_PRESENCE_LISTENER",
          new CometChat.UserListener({
            onUserOnline: (user: CometChat.User) => console.log(`${user.getName()} is online`),
            onUserOffline: (user: CometChat.User) => console.log(`${user.getName()} is offline`)
          })
        );

        setIsReady(true);
      } catch (error) {
        console.error("Initialization/Login failed", error);
      }
    };

    init();

    return () => {
      CometChat.removeUserListener("USER_PRESENCE_LISTENER");
    };
  }, []);

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
