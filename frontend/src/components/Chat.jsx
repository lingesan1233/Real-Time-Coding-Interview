import { useState, useEffect } from "react";

export default function Chat({ socket, roomId }) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

  }, [socket]);

  const sendMessage = () => {

    if (!message) return;

    const msgData = {
      roomId,
      user: user.name,
      message
    };

    socket.emit("send-message", msgData);

    setMessages((prev) => [...prev, msgData]);

    setMessage("");
  };

  return (
    <div style={styles.chatBox}>

      <h3>Chat</h3>

      <div style={styles.messages}>

        {messages.map((msg, index) => (
          <div key={index}>
            <b>{msg.user}:</b> {msg.message}
          </div>
        ))}

      </div>

      <div style={styles.inputArea}>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          style={styles.input}
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>

      </div>

    </div>
  );
}

const styles = {
  chatBox: {
    width: "300px",
    border: "1px solid #ccc",
    padding: "10px"
  },
  messages: {
    height: "200px",
    overflowY: "scroll",
    marginBottom: "10px"
  },
  inputArea: {
    display: "flex"
  },
  input: {
    flex: 1,
    padding: "5px"
  },
  button: {
    padding: "5px 10px"
  }
};