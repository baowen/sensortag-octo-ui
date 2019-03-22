import React, { useState, useEffect } from 'react';
import bluecar from './BlueCar.png';

import './App.css';

const io = require('socket.io-client');
const socket = io('http://localhost:3000');

function App() {
  const [connected, setConnection] = useState(false);
  const [sensorId, setSensorId] = useState('');
  const [accelerometerX, setAccelerometerX] = useState(0);
  const [accelerometerY, setAccelerometerY] = useState(0);
  const [accelerometerZ, setAccelerometerZ] = useState(0);
  const [gyroscopeX, setGyroscopeX] = useState(0);
  const [gyroscopeY, setGyroscopeY] = useState(0);
  const [gyroscopeZ, setGyroscopeZ] = useState(0);
  const [elapsed, setTime] = useState(0);
  const [initialTime] = useState(Date.now);

  /**
   * Returns the combined acceleration sqrt(x^2 + y^2 + z^2).
   *
   * @return the acceleration of all three axes combined
   */
  function getCombinedAccelleration(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z).toFixed(2);
  }

  //distance = (0.5 * acceleration) * (time * time)
  function calculateDistanceByAccelleration(acceleration) {
    var elapsedSeconds = Math.floor(elapsed / 1000);
    var meters = (
      0.5 *
      acceleration *
      (elapsedSeconds * elapsedSeconds)
    ).toFixed(2);
    function metersToMiles(meters) {
      //mi =m * 0.00062137
      return ((meters * 0.00062137) / 60).toFixed(2);
    }
    //console.log('Initial: ' + initialTime + ' ' + elapsed);
    //return metersToMiles(meters);
    return meters;
  }

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
    setTime(Date.now() - initialTime);
  }); //only re-run the effect if new message comes in

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

  function moveCar(acceleration) {}

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', justifyContent: 'center' }} />
        <img
          src={bluecar}
          style={{
            width: '15%',
            height: '15%',
            marginLeft: moveCar(
              getCombinedAccelleration(
                accelerometerX,
                accelerometerY,
                accelerometerZ
              )
            ),
          }}
          className="App-logo"
          alt="logo"
        />
        <p>{displayConnectedMessage()}</p>
        <p>
          Accelerometer - x: {accelerometerX}, y: {accelerometerY}, z:
          {accelerometerZ}
        </p>
        <p>
          Gyroscope - x: {gyroscopeX}, y: {gyroscopeY}, z: {gyroscopeZ}
        </p>
        <p>
          Combined Acceleration:
          {getCombinedAccelleration(
            accelerometerX,
            accelerometerY,
            accelerometerZ
          )}
        </p>
        <p>
          Distance Travelled:
          {calculateDistanceByAccelleration(
            getCombinedAccelleration(
              accelerometerX,
              accelerometerY,
              accelerometerZ
            )
          )}
          m/h
        </p>

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
