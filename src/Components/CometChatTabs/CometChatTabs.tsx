import { useState } from "react";
import chatsIcon from "../../assets/chats.svg";
import callsIcon from "../../assets/AudioCall.svg";
import usersIcon from "../../assets/users.svg";
import groupsIcon from "../../assets/groups.svg";
import "./CometChatTabs.css";

export const CometChatTabs = (props: {
    onTabClicked?: (tabItem: { name: string; icon?: string; }) => void;
    activeTab?: string;
}) => {

    const {
        onTabClicked = () => { },
        activeTab
    } = props;

    const [hoverTab, setHoverTab] = useState("");

    const tabItems = [
        {
            "name": "CHATS",
            "icon": chatsIcon
        },
        {
            "name": "CALLS",
            "icon": callsIcon
        },
        {
            "name": "USERS",
            "icon": usersIcon
        },
        {
            "name": "GROUPS",
            "icon": groupsIcon
        }
    ]

    return (
        <div className="cometchat-tab-component">
            {
                tabItems.map((tabItem) => (
                    <div
                        key={tabItem.name}
                        className="cometchat-tab-component__tab"
                        onClick={() => onTabClicked(tabItem)}
                    >
                        <div
                            className={(activeTab === tabItem.name.toLowerCase() || hoverTab === tabItem.name.toLowerCase()) ? "cometchat-tab-component__tab-icon cometchat-tab-component__tab-icon-active" : "cometchat-tab-component__tab-icon"}
                            style={tabItem.icon ? {
                                WebkitMaskImage: `url("${tabItem.icon}")`,
                                maskImage: `url("${tabItem.icon}")`,
                            } : undefined}
                            onMouseEnter={() => setHoverTab(tabItem.name.toLowerCase())}
                            onMouseLeave={() => setHoverTab("")}
                        />
                        <div
                            className={(activeTab === tabItem.name.toLowerCase() || hoverTab === tabItem.name.toLowerCase()) ? "cometchat-tab-component__tab-text cometchat-tab-component__tab-text-active" : "cometchat-tab-component__tab-text"}
                            onMouseEnter={() => setHoverTab(tabItem.name.toLowerCase())}
                            onMouseLeave={() => setHoverTab("")}
                        >
                            {tabItem.name}
                        </div>
                    </div>
                ))
            }
        </div>
    )

}