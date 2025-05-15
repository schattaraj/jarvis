import React, { useState, useEffect } from "react";

function ChatBot() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

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
      const res =
        "We're actively working to enhance our chatbot experience. Stay tuned — exciting improvements are on the way!";
      // await fetch(
      //   "https://openaiservices-dfamawfaeacmhhax.canadacentral-01.azurewebsites.net/leftbrainchat",
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ query: thisQuestion }),
      //   }
      // );

      // if (!res.body) throw new Error("No response body");

      // const reader = res.body.getReader();
      // const decoder = new TextDecoder("utf-8");
      // let fullResponse = "";

      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) break;

      //   const chunk = decoder.decode(value, { stream: true });
      //   fullResponse += chunk;
      //   setResponse((prev) => prev + chunk);
      // }

      // Set new currentChat after receiving response
      setResponse(res); // it will be removed later
      setCurrentChat({ question: thisQuestion, answer: res });
    } catch (err) {
      console.error(err);
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
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
              <p className="live-response">{response}</p>
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
                {entry.answer}
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
    </>
  );
}

export default ChatBot;
