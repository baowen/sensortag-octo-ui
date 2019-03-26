import React, { useState, useEffect } from 'react';
import Gauge from 'react-svg-gauge';
import Thermometer from 'react-thermometer-ecotropy';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SafeAccelerationGauge from './SafeAccelerationGauge.js';
import determineDrivingConditions from './determineDrivingConditions.js';
import './App.css';

const io = require('socket.io-client');
const socket = io('http://localhost:3000');

function App() {
  const [connected, setConnection] = useState(false);
  const [sensorId, setSensorId] = useState('');
  const [gyroscopeX, setGyroscopeX] = useState(0);
  const [gyroscopeY, setGyroscopeY] = useState(0);
  const [gyroscopeZ, setGyroscopeZ] = useState(0);
  const [magnetometerX, setMagnetometerX] = useState(0);
  const [magnetometerY, setMagnetometerY] = useState(0);
  const [magnetometerZ, setMagnetometerZ] = useState(0);
  const [elapsed, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(Date.now);
  const [combinedAcceleration, setCombinedAcceleration] = useState(0);
  const [objectTemp, setObjectTemp] = useState(0);
  const [ambientTemp, setAmbientTemp] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [drivingConditions, setDrivingConditions] = useState(0);

  let r = Math.floor(combinedAcceleration * 25.5);
  let g = Math.floor(255 - combinedAcceleration * 25.5);
  let b = 0;
  let colorHex = '#' + getHexColor(r) + getHexColor(g) + getHexColor(b);

  function getHexColor(number) {
    let string = number.toString(16);
    return string.length === 1 ? '0' + string : string;
  }

  /**
   * Returns the combined acceleration sqrt(x^2 + y^2 + z^2).
   *
   * @return the acceleration of all three axes combined
   */
  function getCombinedAcceleration(x, y, z) {
    var combinedAcceleration = Math.sqrt(x * x + y * y + z * z).toFixed(2);
    return combinedAcceleration;
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
    if (combinedAcceleration == 0) {
      setInitialTime(Date.now);
    }
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
      setAcceleration(payload.car_acc);
    });
  }, [acceleration]); //only re-run the effect if new message comes in

  useEffect(() => {
    socket.on('GYROSCOPE_CHANGE', payload => {
      setGyroscopeX(payload.x);
      setGyroscopeY(payload.y);
      setGyroscopeZ(payload.z);
    });
  }, [gyroscopeX, gyroscopeY, gyroscopeZ]); //only re-run the effect if new message comes in

  useEffect(() => {
    socket.on('MAGNETOMETER_CHANGE', payload => {
      setMagnetometerX(payload.x);
      setMagnetometerY(payload.y);
      setMagnetometerZ(payload.z);
    });
  }, [magnetometerX, magnetometerY, magnetometerZ]); //only re-run the effect if new message comes in

  useEffect(() => {
    socket.on('TEMPERATURE_CHANGE', payload => {
      setObjectTemp(payload.objectTemp);
      setAmbientTemp(payload.ambientTemp);
    });
  }, [objectTemp, ambientTemp]); //only re-run the effect if new message comes in

  useEffect(() => {
    socket.on('HUMIDITY_CHANGE', payload => {
      setTemperature(payload.temp);
      setHumidity(payload.humidity);
    });
  }, [temperature, humidity]); //only re-run the effect if new message comes in

  useEffect(() => {
    setDrivingConditions(determineDrivingConditions(ambientTemp));
  }, [ambientTemp]);

  function displayConnectedMessage() {
    const connectedMessage = 'You have connected to the socket';
    if (connected) {
      return connectedMessage;
    }
  }

  function displayRiskOfIce() {
    if (drivingConditions === 'poor') {
      return 'Risk of ice';
    }
  }

  const handleConnection = () => {
    connected ? setConnection(false) : setConnection(true);
  };

  console.log(drivingConditions);

  return (
    <React.Fragment>
      <div className="App">
        <header className="App-header">
          <br />
          <Container>
            {drivingConditions === 'poor' ? (
              <Alert key="alert" variant="danger">
                Dangerous driving conditions detected!
              </Alert>
            ) : (
              <div />
            )}
            <Row>
              <Col>
                {' '}
                <SafeAccelerationGauge
                  value={acceleration}
                  width={400}
                  height={320}
                  max={10}
                  drivingConditions={drivingConditions}
                />
              </Col>
              <Col>
                <div style={{ width: '80%', paddingLeft: '50px' }}>
                  <p>Humidity</p>
                  <CircularProgressbar
                    percentage={humidity}
                    text={`${humidity}%`}
                  />
                </div>
              </Col>
              <Col>
                {' '}
                <Thermometer
                  theme="dark"
                  value={ambientTemp}
                  max="100"
                  steps="10"
                  format="°C"
                  size="large"
                  height="500"
                />
                <p style={{ paddingRight: '205px', paddingTop: '30px' }}>
                  {displayRiskOfIce()}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>Event logs:</Col>
              <Col>Speed:</Col>
            </Row>
          </Container>

          <p>{displayConnectedMessage()}</p>
          <p>
            Gyroscope - x: {gyroscopeX}, y: {gyroscopeY}, z: {gyroscopeZ}
          </p>
          <p>
            Magnetometer - x: {magnetometerX}, y: {magnetometerY}, z:{' '}
            {magnetometerZ}
          </p>
          <p>
            Temp - obj: {objectTemp}°C, ambient: {ambientTemp}°C
          </p>
          <p>
            Humidity - temp: {temperature}°C, humidity: {humidity}%
          </p>
          <p>{sensorId}</p>
          <button onClick={() => handleConnection()}>
            {connected && `End Connection`}
            {!connected && `Start Connection`}
          </button>
        </header>
      </div>
    </React.Fragment>
  );
}

export default App;
