import  { useState } from "react";
import {
    CometChatMessageHeader,
    CometChatListItem,
    CometChatOutgoingCall,
    CometChatUIKitConstants,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import CallSvg from "../assets/AudioCall.svg";
import VideoCallSvg from "../assets/Video-call.svg"

const callIconURL = CallSvg;
const videoIconURL = VideoCallSvg;

type Props = {
    user?: CometChat.User;
};

export function MessageHeaderDemo({ user }: Props) {
    const [outgoingCall, setOutgoingCall] = useState<CometChat.Call | null>(null);

    if (!user) return null;

    const startCall = async (
        type: typeof CometChatUIKitConstants.MessageTypes.audio | typeof CometChatUIKitConstants.MessageTypes.video
    ) => {
        try {
            const uid = user.getUid();
            const callObject = new CometChat.Call(
                uid,
                type,
                CometChatUIKitConstants.MessageReceiverType.user
            );
            const initiatedCall = await CometChat.initiateCall(callObject);
            console.log(`${type === 'video' ? 'Video' : 'Audio'} call initiated:`, initiatedCall);
            setOutgoingCall(initiatedCall);
        } catch (error) {
            console.error("Failed to initiate call:", error);
        }
    };

    const handleEndCall = async () => {
        if (outgoingCall) {
            try {
                await CometChat.rejectCall(outgoingCall.getSessionId(), "cancelled");
                console.log("Call canceled");
            } catch (error) {
                console.error("Cancel call failed:", error);
            } finally {
                setOutgoingCall(null);
            }
        }
    };

    const customItemView = (
        <CometChatListItem
            avatarName={user.getName()}
            avatarURL={user.getAvatar()}
            title={user.getName()}
            subtitleView={user.getStatus()}
        />
    );

    // Two buttons: audio + video
    const customAuxiliaryView = (
        <div style={{ display: "flex", gap: "8px" }}>
            <button
                onClick={() => startCall(CometChatUIKitConstants.MessageTypes.audio)}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    width: "28px",
                    height: "28px",
                }}
            >
                <img src={callIconURL} alt="Audio Call" style={{ width: "100%", height: "100%" }} />
            </button>
            <button
                onClick={() => startCall(CometChatUIKitConstants.MessageTypes.video)}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    width: "28px",
                    height: "28px",
                }}
            >
                <img src={videoIconURL} alt="Video Call" style={{ width: "100%", height: "100%" }} />
            </button>
        </div>
    );

    return (
        <>
            <CometChatMessageHeader
                user={user}
                itemView={customItemView}
                auxiliaryButtonView={customAuxiliaryView}
                showBackButton={true}
            />

            {/* Modal when call starts */}
            {outgoingCall && (
                <div
                    style={{
                        position: "fixed",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.6)", // backdrop
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            background: "#fff",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                        }}
                    >
                        <CometChatOutgoingCall call={outgoingCall} />

                        {/* Close button */}
                        <button
                            onClick={handleEndCall}
                            style={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",
                                background: "#E31837",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                cursor: "pointer",
                                fontSize: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                transition: "background 0.3s"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#c9152f")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#E31837")}
                        >
                            ✕
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}
