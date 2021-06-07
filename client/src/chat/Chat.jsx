import React, { useState, useEffect } from "react";
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import { Picker } from "emoji-mart";
import { usePubNub } from "pubnub-react";
import {
    ChannelList,
    Chat,
    MemberList,
    MessageInput,
    MessageList,
    TypingIndicator,
    usePresence,
} from "@pubnub/react-chat-components";

import "./simple-chat.scss";
import "emoji-mart/css/emoji-mart.css";
// import { ReactComponent as PeopleGroup } from "../people-group.svg";

/**
 * In this simple application, data about users, channels and sample welcome messages are
 * statically loaded from JSON files. In most cases users and channels data will be provided from an
 * external source or loaded from PubNub Objects storage with custom hooks included in the package.
 * Sample messages are fully optional.
 * */
import rawUsers from "./users.json";
// import socialChannels from "../../../data/channels-social.json";
import directChannels from "./channels-direct.json";
const users = rawUsers;
// const socialChannelList = socialChannels;
const directChannelList = directChannels;
const allChannelIds = [...directChannelList].map((c) => c.id);

export default function SimpleChat() {
    const pubnub = usePubNub(); //usePubNub is only used here to get current user info (as it's randomly selected)
    const [theme, setTheme] = useState("light");
    const [showMembers, setShowMembers] = useState(false);
    const [showChannels, setShowChannels] = useState(true);
    const [presenceData] = usePresence({ channels: allChannelIds }); // usePresnce is one of the custom hooks provided by Chat Components
    const [currentChannel, setCurrentChannel] = useState(directChannelList[0]);

    const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map((o) => o.uuid);
    const currentUser = users.find((u) => u.id === pubnub.getUUID());


    /** Rendered markup is a mixture of PubNub Chat Components (Chat, ChannelList, MessageList,
     * MessageInput, MemberList) and some elements to display additional information and to handle
     * custom behaviors (dark mode, showing/hiding panels, responsive design) */
    return (
        <div className={`app-simple ${theme}`}>
            {/* Be sure to wrap Chat component in PubNubProvider from pubnub-react package.
      In this case it's done in the index.tsx file */}
            <Chat theme={theme} users={users} currentChannel={currentChannel.id} channels={allChannelIds}>
                <div className={`channels ${showChannels && "shown"}`} style={{ width: 250 }}>
                    <div className="user" style={{ display: "flex", alignItems: "center" }}>
                        <Avatar aria-label="recipe" style={{ backgroundColor: red[500], margin: 20 }}>{currentUser?.initials}{" "}</Avatar>
                        <h4>
                            {currentUser?.name}{" "}
                        </h4>
                    </div>
                    <div>
                        <ChannelList
                            channels={directChannelList}
                            onChannelSwitched={(channel) => setCurrentChannel(channel)}
                        />
                    </div>
                </div>

                <div className="chat" style={{ width: 400 }}>
                    <div className="info">
                        <h4>{currentChannel.name}</h4>
                        <small>{currentChannel.description}</small>
                        <hr />
                    </div>
                    <MessageList
                        fetchMessages={100}
                        enableReactions
                        reactionsPicker={<Picker />}
                        messageRenderer={customMessageRenderer}

                    >
                        <TypingIndicator />
                    </MessageList>
                    <MessageInput typingIndicator emojiPicker={<Picker />} />
                </div>
            </Chat>
        </div>
    );
}

const customMessageRenderer = (props) => {
    console.log(props)
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Avatar aria-label="recipe" style={{ backgroundColor: red[500], width: 35, height: 35, margin: 5 }}>{props.user?.initials}{" "}</Avatar>
                <strong style={{ margin: 5 }}>{props.user?.name}</strong> {props.time}
            </div>
            <p>{props.message.message.text}</p>
        </div>
    )
}


