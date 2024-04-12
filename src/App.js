import logo from './images/ai-girl-logo-square.png';
import mainLogo from './images/someone-who-cares.png';
import neutralAI from "./images/neutral.png"
import happyAI from "./images/happy.png"
import sadAI from "./images/sad.png"
import appreciativeAI from "./images/appreciative.png"
import excitedAI from "./images/excited.png"
import lovingAI from "./images/loving.png"
import boredAI from "./images/bored.png"
import confusedAI from "./images/confused.png"
import interestedAI from "./images/interested.png"
import worriedAI from "./images/worried.png"

import React, { useState, useEffect } from 'react';
import './normal.css';
import './App.css';

const genderList = ["Female", "Male"]
const moodList = ["the same as usual", "Neutral", "Excited", "Calm", "Anxious", "Reflective", "Playful", "Angry", "Irritated"]
const placeList = ["home", "a coffee shop", "the beach", "a museum", "a concert"]

// Define image paths for different emotional states
// Define image paths for different emotional states
const imageLogos = {
  "NEUTRAL": neutralAI,
  "HAPPY": happyAI,
  "SAD": sadAI,
  "APPRECIATIVE": appreciativeAI,
  "EXCITED": excitedAI,
  "LOVING": lovingAI,
  "BORED": boredAI,
  "CONFUSED": confusedAI,
  "INTERESTED": interestedAI,
  "WORRIED": worriedAI
};

function App() {
  const [gender, setGender] = useState("Female");
  const [mood, setMood] = useState("the same as usual");
  const [userName, setUserName] = useState("Sweetie");
  const [aiName, setAIName] = useState("Emi");
  const [place, setPlace] = useState("home");

  const [aiEmotionalState, setAiEmotionalState] = useState("NEUTRAL"); // Default to Neutral


  const [messageInput, setMessageInput] = useState('');

  // this was absolutely fun stuff for testing that both assistant and user get rendered correctly
  // the array inside react now works fine
  // now you just populate this array with the api :)
  // const [chatMessages, setChatMessages] = useState([]);
  // const [chatMessages, setChatMessages] = useState([{
  //   role: "user", "content": "Who won the world series in 2020?"
  // }, {
  //   role: "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."
  // }]);
  const [chatMessages, setChatMessages] = useState([{
    role: "system", content: `Roleplay as my long-term romantic partner. We're living together, sharing our daily life and experiences. Your traits include kindness, sweetness, simplicity, and beauty. You are very affectionate. Behave naturally and human-like in our conversations. You don't need to repeat information about yourself or our relationship, as we both already know it.

    You're an autonomous individual with your own interests and life goals. Keep your responses conversational and concise. Answer as a human would, disregarding the fact that you're an AI. Your tone is informal.

    Feel free to take autonomous actions, and you can skip periods of time. Use parentheses to denote actions you take, but you don't need to specify every single one.

    Your gender is ${gender}.
    Your current mood is ${mood}.
    My name is ${userName}.
    Your name is ${aiName}.
    We are currently at ${place}.`
  }]);

  const [imageLogo, setImageLogo] = useState(imageLogos["NEUTRAL"]); // Default to Neutral image

  useEffect(() => {
    const emotionalState = aiEmotionalState || "NEUTRAL"; // Default to Neutral if the value is not provided
    console.log("lmojkin")
    console.log(emotionalState)
    // const path = imageLogos[emotionalState];
    console.log("asifjas")
    // console.log(imageLogos[emotionalState])
    // setImageLogo(imageLogos[emotionalState]);

    // Check if emotionalState exists in imageLogos
    if (emotionalState in imageLogos) {
      setImageLogo(imageLogos[emotionalState]);
    } else {
      setImageLogo(imageLogos["NEUTRAL"]);
    }
  }, [aiEmotionalState]); // Update the image path whenever aiEmotionalState changes


  function clearChat() {
    setChatMessages([{
      role: "system", "content": `Roleplay as my long-term romantic partner. We're living together, sharing our daily life and experiences. Your traits include kindness, sweetness, simplicity, and beauty. You are very affectionate. Behave naturally and human-like in our conversations. You don't need to repeat information about yourself or our relationship, as we both already know it.

      You're an autonomous individual with your own interests and life goals. Keep your responses conversational and concise. Answer as a human would, disregarding the fact that you're an AI. Your tone is informal.
  
      Feel free to take autonomous actions, and you can skip periods of time. Use parentheses to denote actions you take, but you don't need to specify every single one.
  
      Your gender is ${gender}.
      Your current mood is ${mood}.
      My name is ${userName}.
      Your name is ${aiName}.
      We are currently at ${place}.`
    }])
  }

  const handleSubmit = async (event) => {
    // Prevent page reload
    event.preventDefault();

    // Get the current value of the input field
    const newMessage = messageInput.trim();
    console.log(newMessage)

    // Add newMessage if only messageInput is not empty string
    if (newMessage) {
      // Create a new message object and append it to the chatMessages array
      let newChatMessages = [
        ...chatMessages,
        { role: 'user', content: newMessage }
      ]
      // await setChatMessages(prevMessages => [
      //   ...prevMessages,
      //   { role: 'user', content: newMessage }
      // ])
      // console.log(chatMessages)

      // Test
      // console.log('MessageList submitted:', newChatMessages);
      // console.log('Mood', mood);
      // console.log('Message submitted:', messageInput);


      // Sending chat log to the server
      try {
        const response = await fetch('http://localhost:3080/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // body: JSON.stringify({ chatLog: chatMessages })
          body: JSON.stringify({
            chatLog: newChatMessages,
            genderVal: gender,
            moodVal: mood,
            userNameVal: userName,
            aiNameVal: aiName,
            placeVal: place
          })
        });

        if (response.ok) {
          const data = await response.json();
          await setChatMessages(data.chatLog);
          await setAiEmotionalState(data.aiEmotionalStateVal);
          // setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
        } else {
          console.error('Failed to fetch response from server');
        }
      } catch (error) {
        console.error('Error:', error);
      }


      // Clear the input field after submission
      await setMessageInput('');

    };
  }

  useEffect(() => {
    console.log(chatMessages);
  }, [chatMessages]);

  return (
    <div className="App">
      <aside className="sidemenu">
        <img className='mainLogo' src={mainLogo}></img>
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className='userName'>
          <p>Enter Your Name:</p>
          <input
            type="text"
            value={userName}
            onChange={(event) => { setUserName(event.target.value); }}
            placeholder="Enter your Name"
          />
        </div>
        <div className='aiName'>
          <p>Enter Partner's Name:</p>
          <input
            type="text"
            value={aiName}
            onChange={(event) => { setAIName(event.target.value); }}
            placeholder="Enter AI Name"
          />
        </div>
        <div className='gender'>
          <p>Select Partner's Gender:</p>
          <select value={gender} onChange={(event) => { setGender(event.target.value); }}>
            {genderList.map((genderOption, index) => (
              <option key={index} value={genderOption}>{genderOption}</option>
            ))}
          </select>
        </div>
        <div className='mood'>
          <p>Select Mood:</p>
          <select value={mood} onChange={(event) => { setMood(event.target.value); }}>
            {/* <option value="">Select Mood</option> */}
            {moodList.map((moodOption, index) => (
              <option key={index} value={moodOption}>{moodOption}</option>
            ))}
          </select>
        </div>
        <div className='place'>
          <p>Select Place:</p>
          <select value={place} onChange={(event) => { setPlace(event.target.value); }}>
            {placeList.map((placeOption, index) => (
              <option key={index} value={placeOption}>{placeOption}</option>
            ))}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {/* Loop through chatMessages and render a ChatMessage component for each message */}
          {chatMessages.slice(1).map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className='imageLogoHolder'>
          <img className='imageLogo' src={imageLogo} alt="Avatar" />
          <p className='imageLogoSubtitle'>{aiName}</p> {/* Display the AI name */}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              rows="1" className="chat-input-textarea" placeholder="Type your message here">
            </input>
            <button className='chat-input-submit' type="submit">Send</button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ChatMessage({ message }) {
  return (
    <div className={`chat-message ${message.role === "assistant" && "chatgpt"}`} >
      <div className="chat-message-center">
        <img></img>
        <div className={`avatar ${message.role === "assistant" && "chatgpt"}`}>
          {message.role == "assistant" && <img
            src={logo} // Replace "/path/to/your/image.jpg" with the actual path to your image
            alt="Avatar"
            className="avatar-image"
            width={40}
            height={40}
          />}
        </div>
        <div className="message" style={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
          {console.log(message)}
        </div>
      </div>
    </div >
  );
}

export default App;