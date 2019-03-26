import React from 'react';
import Gauge from 'react-svg-gauge';

// Props:
//    value: number (acceleration m/s)
//    width: pixels
//    height: pixels
//    max: maximum value for Gauge
//    drivingConditions: string ('poor' or 'good')
export default function SafeAccelerationGauge(props) {
  var maxSafeAcceleration = 0;
  // Calculate safe levels of acceleration based on weather conditions
  if (props.drivingConditions === 'poor') {
    maxSafeAcceleration = 5;
  } else {
    maxSafeAcceleration = 7;
  }

  var safe = props.value > maxSafeAcceleration ? false : true;
  return (
    <div>
      <Gauge
        value={props.value}
        width={props.width}
        height={props.height}
        max={props.max}
        color={safe ? '#00ff00' : '#ff0000'}
        label={'Acceleration m/s'}
      />
    </div>
  );
}
