import React from "react";
import { Button } from "@tremor/react";

const ConversationItem = ({ id, title, onSelect, isSelected }) => {
  return (
    <li
      className={`cursor-pointer p-2 py-3 rounded-md ${
        isSelected ? "bg-gray-200" : "bg-white"
      } hover:bg-gray-200`}
      onClick={onSelect}
    >
      <p className="font-medium text-sm truncate">
        {title ? title : `Conversation ${id}`}
      </p>
    </li>
  );
};

const Sidebar = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
  onNewConversation,
}) => {
  return (
    <div className="w-1/5 h-full flex flex-col bg-white-200 p-4 border-r border-gray-300">
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          <h2 className="text-lg font-bold">Past Conversations</h2>
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              id={conversation.id}
              title={conversation.title}
              onSelect={() => onSelectConversation(conversation.id)}
              isSelected={conversation.id === selectedConversationId}
            />
          ))}
        </ul>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={onNewConversation}
          tooltip="Start a new chat"
          className="mt-6 py-3"
          style={{ width: "80%", marginBottom: ".65rem" }}
        >
          New Chat
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
