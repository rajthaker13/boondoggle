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

const categorizeConversations = (conversations) => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;

  const categories = {
    today: [],
    yesterday: [],
    thisWeek: [],
    thisMonth: [],
    older: [],
  };

  conversations.forEach((conversation) => {
    const elapsedTime = now - conversation.date;
    if (elapsedTime < oneDay) {
      categories.today.push(conversation);
    } else if (elapsedTime < 2 * oneDay) {
      categories.yesterday.push(conversation);
    } else if (elapsedTime < oneWeek) {
      categories.thisWeek.push(conversation);
    } else if (elapsedTime < oneMonth) {
      categories.thisMonth.push(conversation);
    } else {
      categories.older.push(conversation);
    }
  });

  return categories;
};

const renderCategory = (
  title,
  conversations,
  onSelectConversation,
  selectedConversationId
) => {
  if (conversations.length === 0) {
    return null;
  }

  return (
    <div key={title}>
      <h3 className="text-sm text-gray-500 font-semibold">{title}</h3>
      <ul className="space-y-2">
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
  );
};

const Sidebar = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
  onNewConversation,
}) => {
  const sortedConversations = [...conversations].sort(
    (a, b) => b.date - a.date
  );
  const categorizedConversations = categorizeConversations(sortedConversations);

  return (
    <div className="w-1/5 h-full flex flex-col bg-white-200 p-4 border-r border-gray-300">
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          <h2 className="text-lg font-bold">Past Conversations</h2>
          {renderCategory(
            "Today",
            categorizedConversations.today,
            onSelectConversation,
            selectedConversationId
          )}
          {renderCategory(
            "Yesterday",
            categorizedConversations.yesterday,
            onSelectConversation,
            selectedConversationId
          )}
          {renderCategory(
            "This Week",
            categorizedConversations.thisWeek,
            onSelectConversation,
            selectedConversationId
          )}
          {renderCategory(
            "This Month",
            categorizedConversations.thisMonth,
            onSelectConversation,
            selectedConversationId
          )}
          {renderCategory(
            "Older Conversations",
            categorizedConversations.older,
            onSelectConversation,
            selectedConversationId
          )}
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
