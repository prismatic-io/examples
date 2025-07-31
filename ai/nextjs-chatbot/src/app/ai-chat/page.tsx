"use client";

import { useChat } from "@ai-sdk/react";
import { Send, Bot, User, Wrench, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface Tool {
  description: string;
  parameters: {
    jsonSchema: {
      type: string;
      properties: Record<string, unknown>;
      additionalProperties: boolean;
    };
  };
}

interface ToolsResponse {
  [key: string]: Tool;
}

export default function AIChatBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const [tools, setTools] = useState<ToolsResponse>({});
  const [showTools, setShowTools] = useState(false);
  const [loadingTools, setLoadingTools] = useState(false);

  useEffect(() => {
    const fetchTools = async () => {
      setLoadingTools(true);
      try {
        const response = await fetch("/api/tools");
        if (response.ok) {
          const toolsData = await response.json();
          setTools(toolsData);
        }
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      } finally {
        setLoadingTools(false);
      }
    };

    fetchTools();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">
              Acme AI Assistant
            </h1>
            <p className="text-sm text-zinc-400">Ask me anything</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-zinc-400 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <p className="text-lg font-medium text-zinc-200">Welcome!</p>
            <p className="text-sm text-zinc-500">
              Start a conversation by typing a message below.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.role === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" ? "bg-zinc-700" : "bg-zinc-800"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-zinc-300" />
                ) : (
                  <Bot className="w-4 h-4 text-zinc-400" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`px-4 py-2 rounded-2xl ${
                  message.role === "user"
                    ? "bg-zinc-700 text-zinc-100"
                    : "bg-zinc-800 text-zinc-100 border border-zinc-700"
                }`}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="whitespace-pre-wrap text-sm leading-relaxed"
                        >
                          {part.text}
                        </div>
                      );
                  }
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="px-4 py-2 rounded-2xl bg-zinc-800 border border-zinc-700">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tools Section */}
      <div className="border-t border-zinc-800 bg-zinc-900">
        <button
          onClick={() => setShowTools(!showTools)}
          className="w-full px-4 py-3 flex items-center justify-between text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4" />
            <span className="font-medium">Available Tools</span>
            <span className="text-xs bg-zinc-700 px-2 py-1 rounded-full">
              {Object.keys(tools).length}
            </span>
          </div>
          {showTools ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showTools && (
          <div className="px-4 pb-4">
            {loadingTools ? (
              <div className="flex items-center justify-center py-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(tools).map(([toolName, tool]) => (
                  <div
                    key={toolName}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 hover:bg-zinc-750 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-zinc-200 mb-1">
                          {toolName}
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
                {Object.keys(tools).length === 0 && !loadingTools && (
                  <div className="text-center py-4 text-zinc-500 text-sm">
                    No tools available
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-zinc-800 bg-zinc-900 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            className="flex-1 px-4 py-3 border border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent bg-zinc-800 text-zinc-100 placeholder-zinc-500"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-zinc-700 text-zinc-100 rounded-full hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
