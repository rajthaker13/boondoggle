import React from "react";

const ConversationItem = ({ conversation, onSelect }) => {
  return (
    <li
      className="cursor-pointer p-2 bg-white shadow-md rounded-md hover:bg-gray-100"
      onClick={onSelect}
    >
      <p className="font-medium">
        {conversation.title || `Conversation ${conversation.id}`}
      </p>
    </li>
  );
};

const Sidebar = ({ conversations, onSelectConversation }) => {
  return (
    <div className="w-1/6 h-full bg-white-200 p-4 overflow-y-auto border-r border-gray-300">
      <h2 className="text-lg font-bold mb-4">Past Conversations</h2>
      <ul className="space-y-2">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onSelect={() => onSelectConversation(conversation.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
