import { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client"

// Assets
import person from '../assets/person.svg'
import send from '../assets/send.svg'

// Socket
const socket = io('ws://localhost:3030')

const Messages = ({ account, messages, currentChannel }) => {
  const [message, setMessage] = useState('');

  const messagesEndRef = useRef(null);
  const sendMessage = async (e) => {
    e.preventDefault();

    const messageObject = {
      channel: currentChannel.id.toString(),
      account: account,
      text: message
    }
    if(message !== '') {
      socket.emit('new message', messageObject);
    }
    setMessage('');
  }

  const scrollHandler = () => {
    setTimeout(() => {  
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500)
  }

  useEffect(() => {
    scrollHandler();
  })

  return (
    <div className="text">
      <div className="messages">
        {currentChannel && messages.filter(message => message.channel === currentChannel.id.toString()).map((message, index) => (
          <div className="message" key={index}>
            <img src={person} alt="person" />
            <div className="message_content">
              <h3>{message.account.slice(0, 6) + '...' + message.account.slice(-4)}</h3>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage}>
        {currentChannel && account ? (
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${currentChannel.name}`}
          />
        ) : (
          <input
            type="text"
            disabled
            placeholder="Connect your wallet and join a channel to send messages"
          />
        )}
        <input type="text" onChange={(e) => setMessage(e.target.value)}></input>
        <button type="submit">
          <img src={send} alt="Send Message" />
        </button>
      </form>
    </div>
  );
}

export default Messages;