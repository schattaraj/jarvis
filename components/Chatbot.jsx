import React, { useState, useEffect, useContext } from "react";
import { Context } from "../contexts/Context";

function ChatBot() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const context = useContext(Context);

  useEffect(() => {
    // Load history from sessionStorage
    const stored = sessionStorage.getItem("chatHistory");
    if (stored) {
      setChatHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // Save history on every update
    sessionStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // If there's a previous chat in currentChat, move it to chat history
    if (currentChat) {
      const updatedHistory = [currentChat, ...chatHistory];
      setChatHistory(updatedHistory);
      sessionStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    }

    setLoading(true);
    setResponse("");
    const thisQuestion = input;
    setInput(""); // clear textarea

    try {
      const res = await fetch(
        "https://openaiservices-dfamawfaeacmhhax.canadacentral-01.azurewebsites.net/portfolio/query-stream",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table_data: context.formattedBotData,
            question: thisQuestion,
          }),
        }
      );

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        // Format each chunk as it comes in
        setResponse((prev) => prev + chunk);
      }

      // Set new currentChat after receiving response
      const formattedChunk = formatResponse(fullResponse);
      setCurrentChat({ question: thisQuestion, answer: formattedChunk });
    } catch (err) {
      console.error(err);
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format the response
  const formatResponse = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    let formatted = "";
    let inList = false;
    let isNested = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const isLast = index === lines.length - 1;
      const isBullet = /^[-•*]\s+/.test(trimmed);
      const isNestedBullet = /^\s{2,}[-•*]\s+/.test(line);

      // First paragraph
      if (index === 0 && !isBullet) {
        formatted += `<div class="response-paragraph">${trimmed}</div>`;
        return;
      }

      // Nested bullet point
      if (isNestedBullet) {
        const clean = line.replace(/^\s{2,}[-•*]\s+/, "");
        formatted += `<div class="nested-bullet-point">${clean}</div>`;
        return;
      }

      // Top-level bullet point
      if (isBullet) {
        const clean = trimmed.replace(/^[-•*]\s+/, "");
        formatted += `<div class="bullet-point">${clean}</div>`;
        return;
      }

      // Final summary paragraph
      if (isLast) {
        formatted += `<div class="response-paragraph">${trimmed}</div>`;
        return;
      }

      // If none of the above
      formatted += `<div class="response-line">${trimmed}</div>`;
    });

    return formatted;
  };

  return (
    <>
      <div
        className="chatbot-toggle-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {!isOpen ? (
          <img src="/assets/images/bot.jpg" alt="Chatbot" width={40} />
        ) : (
          <img src="/assets/images/cross.png" alt="Close" width={30} />
        )}
      </div>

      <div className={`chatbot-popup ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <h2>Ask Jarvis</h2>
        </div>
        <div
          className={`chatbot-history ${
            response ? "visible" : chatHistory.length > 0 ? "visible" : ""
          }`}
        >
          {currentChat && (
            <div className="chatbot-history-entry live">
              <p
                className="live-response"
                // dangerouslySetInnerHTML={{ __html: response }}
              >
                <pre>{response}</pre>
              </p>
            </div>
          )}

          {chatHistory.map((entry, idx) => (
            <div className="chatbot-history-entry history" key={idx}>
              <p className="question">
                <div className="question-bubble">
                  <strong>You:</strong> {entry.question}
                </div>
              </p>
              <p className="answer">
                <div className="answer-icon">
                  <img src="/assets/images/bot.jpg" alt="Bot" width={20} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: entry.answer }} />
              </p>
            </div>
          ))}
        </div>

        <div className="chatbot-input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about Jarvis..."
          />
        </div>

        <div className="submit-button">
          <button onClick={handleSend} disabled={loading}>
            {loading ? "Thinking..." : "Submit"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .bullet-point {
          margin-left: 20px;
          position: relative;
          padding-left: 15px;
        }
        .bullet-point:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #666;
        }
        .nested-bullet-point {
          margin-left: 40px;
          position: relative;
          padding-left: 15px;
        }
        .nested-bullet-point:before {
          content: "◦";
          position: absolute;
          left: 0;
          color: #666;
        }
        .response-paragraph {
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .response-line {
          margin-bottom: 5px;
        }
      `}</style>
    </>
  );
}

export default ChatBot;
