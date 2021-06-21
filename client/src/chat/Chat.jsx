import React, { useState, useEffect } from "react";
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import Badge from '@material-ui/core/Badge';
import EmojiPicker from 'emoji-picker-react'
import { usePubNub } from "pubnub-react";
import {
    ChannelList,
    Chat,
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
const channelData = allChannelIds.map((channel, i) => (
    { [channel]: false }
))

const PickerAdapter = (props) => {
    // handling method should call onSelect with an object exposing a "native" property
    
    const handleEmoji = (e, emoji) => {
        if (props.onSelect) props.onSelect({ native });
    };
    // onEmojiClick is a method in emoji-picker-react used to handle emoji picking
    return <EmojiPicker onEmojiClick={handleEmoji} />;
};

export default function SimpleChat() {
    const pubnub = usePubNub(); //usePubNub is only used here to get current user info (as it's randomly selected)
    const [theme, setTheme] = useState("light");
    const [showMembers, setShowMembers] = useState(false);
    const [showChannels, setShowChannels] = useState(true);
    const [currentChannel, setCurrentChannel] = useState(directChannelList[0]);
    const [channelOnline, setChannelOnline] = useState(channelData)

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
                            channelRenderer={(props) => customChannelRenderer(props, setCurrentChannel)}
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
                        reactionsPicker={<PickerAdapter />}
                        messageRenderer={customMessageRenderer}

                    >
                        <TypingIndicator />
                    </MessageList>
                    <MessageInput typingIndicator emojiPicker={<PickerAdapter />} />
                </div>
            </Chat>
        </div>
    );
}

const customMessageRenderer = (props) => {
    console.log(props)
    return (
        <div className="pn-msg pn-msg--own" style={{ width: "100%", display: "flex", alignItems: "flex-start" }}>
            <Avatar aria-label="recipe" style={{ backgroundColor: red[500], width: 30, height: 30, marginRight: 10, fontSize: 15 }}>{props.user?.initials}{" "}</Avatar>
            <div className="pn-msg__main">
                <div className="pn-msg__content">
                    <div className="pn-msg__title">
                        <span className="pn-msg__author">{props.user?.name}</span>
                        <span className="pn-msg__time">{props.time}</span>
                    </div>
                    <div className="pn-msg__bubble">{props.message.message.text}</div>
                </div>
                <div className="pn-msg__extras">
                    <div className="pn-msg__reactions">
                        {props.message?.data?.reaction && Object.keys(props.message.data.reaction).map((reaction, index) => (
                            <div className="pn-msg__reaction pn-msg__reaction--active">
                                {reaction + " " + props.message.data.reaction[reaction].length}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const customChannelRenderer = (props, setCurrentChannel) => {
    const [presenceData] = usePresence(); // usePresence is one of the custom hooks provided by Chat Components
    const [active, setActive] = useState(false)

    Object.keys(presenceData).map((channel, index) => {
        let channelPresence = presenceData[channel]
        console.log(channelPresence)
        if (props.id === channel && channelPresence.occupancy > 1) {
            setActive(true)
        }
    })

    return (
        <div className="pn-channel " onClick={() => setCurrentChannel(props)}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                <Badge variant="dot" color={active ? "default" : "error"} disabled={!active} badgeContent=" " overlap="circle">
                    <Avatar aria-label="recipe" style={{ backgroundColor: red[500], width: 30, height: 30, fontSize: 15 }}>{props.initials}</Avatar>
                </Badge>
                <p className="pn-channel__name" style={{ color: "#585858", marginLeft: 10 }}>{props.name}</p>
            </div>
        </div>
    )
}


