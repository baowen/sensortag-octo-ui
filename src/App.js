import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const io = require('socket.io-client');
const socket = io('http://localhost:3000');

function App() {
  const [connected, setConnection] = useState(false);
  const [sensorId, setSensorId] = useState('');
  const [accelerometerX, setAccelerometerX] = useState(null);
  const [accelerometerY, setAccelerometerY] = useState(null);
  const [accelerometerZ, setAccelerometerZ] = useState(null);
  const [gyroscopeX, setGyroscopeX] = useState(null);
  const [gyroscopeY, setGyroscopeY] = useState(null);
  const [gyroscopeZ, setGyroscopeZ] = useState(null);

  useEffect(() => {
    if (connected) {
      console.log('joining socket');
      socket.emit('test-send', 'PING!');
    }

    return () => {
      if (connected) {
        console.log('leaving socket');
        socket.emit('test-send', 'MOO');
      }
    };
  });

  useEffect(() => {
    //waits for a button press to set sensorId
    socket.on('BUTTON_PRESS', payload => {
      setSensorId(payload);
    });
    //clean up code
    return () => {
      if (sensorId !== '') {
        socket.close();
      }
    };
  }, [sensorId]); //only re-run the effect if new message comes in

  useEffect(() => {
    socket.on('ACCELEROMETER_CHANGE', payload => {
      setAccelerometerX(payload.x);
      setAccelerometerY(payload.y);
      setAccelerometerZ(payload.z);
    });
  }, [accelerometerX, accelerometerY, accelerometerZ]); //only re-run the effect if new message comes in

  useEffect(() => {
    socket.on('GYROSCOPE_CHANGE', payload => {
      setGyroscopeX(payload.x);
      setGyroscopeY(payload.y);
      setGyroscopeZ(payload.z);
    });
  }, [gyroscopeX, gyroscopeY, gyroscopeZ]); //only re-run the effect if new message comes in

  function displayConnectedMessage() {
    const connectedMessage = 'You have connected to the socket';
    if (connected) {
      return connectedMessage;
    }
  }

  const handleConnection = () => {
    connected ? setConnection(false) : setConnection(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
          {displayConnectedMessage()}
        </p>
        <p>
          Accelerometer - x: {accelerometerX}, y: {accelerometerY}, z:
          {accelerometerZ}
        </p>
        <p>
          Gyroscope - x: {gyroscopeX}, y: {gyroscopeY}, z: {gyroscopeZ}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{sensorId}</p>

        <button onClick={() => handleConnection()}>
          {connected && `End Connection`}
          {!connected && `Start Connection`}
        </button>
      </header>
    </div>
  );
}

export default App;
