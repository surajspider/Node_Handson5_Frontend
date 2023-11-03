import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function Test() {
    const socket = io("https://chatapplicationbackend-8h4m.onrender.com"); //https://chatapplicationbackend-8h4m.onrender.com
    const [state, setState] = useState({ uname: "", nametoggle: true });
    const [text, setText] = useState({ curtext: "" });
    const [chatMessages, setChatMessages] = useState([]);
    const [participants, setParticipants] = useState([]);

    const handleChange = (e) => {
        setState({ ...state, uname: e.target.value });
    };

    const handleChanged = (e) => {
        setText({ curtext: e.target.value });
    };

    const nameSubmit = () => {
        setState({ ...state, nametoggle: false });
        setParticipants([...participants, state.uname]);
    };

    const sendMessage = () => {
        const message = { sender: state.uname, text: text.curtext };

        socket.emit("broadCast", message);

        setChatMessages([...chatMessages, message]);

        setText({ curtext: "" });
    };

    useEffect(() => {
        socket.on("broadCast", (data) => {
            setChatMessages([...chatMessages, data]);
        });
    }, [socket, chatMessages]);

    return (
        <div>
            <h1>Group Message</h1>
            <h2>Chat Application</h2>
            {state.nametoggle ? (
                <div>
                    <input id="uname" className="inpbox" name="uname" placeholder="Enter your name" value={state.uname} onChange={handleChange} />
                    <button onClick={nameSubmit}>Submit</button>
                    <br />
                    <hr />
                </div>
            ) : null}

            <div className="boundary">
                <div className="participants-list">
                    <h3>Participants:</h3>
                    {participants.map((participant, index) => (
                        <h2 key={index}>{participant}</h2>
                    ))}
                </div>
                <div className="chat-messages">
                    {chatMessages.map((message, index) => (
                        <div key={index} className={message.sender === state.uname ? 'sent' : 'received'}>
                            <p className="sender">{message.sender}:</p>
                            <p className="message">{message.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <input id="inp1" className="inpbox" name="text" placeholder="Enter Message" value={text.curtext} onChange={handleChanged} />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
}

export default Test;
