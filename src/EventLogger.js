import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
export default class EventLogger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsItem: [
        <ListGroup.Item variant="primary">Event Logger</ListGroup.Item>,
      ],
    };
  }

  arrayRemove(arr, value) {
    return arr.filter(function(ele) {
      return ele != value;
    });
  }

  getEvents() {
    var eventList = this.state.eventsItem;
    var tooHotPresent = false;
    var DangerousAcceleration = false;

    //var timeEventOccurred = '';
    for (let i = 0; i < eventList.length; i++) {
      if (eventList[i].props.children == 'Too Hot') {
        tooHotPresent = true;
      }
      if (eventList[i].props.children == 'Dangerous Acceleration') {
        DangerousAcceleration = true;
      }
    }
    if (this.props.objectTemp > 30 && !tooHotPresent) {
      //timeEventOccurred = Date.now();
      eventList.push(<ListGroup.Item variant="danger">Too Hot</ListGroup.Item>);
    }
    if (this.props.acceleration > 5 && !DangerousAcceleration) {
      eventList.push(
        <ListGroup.Item variant="danger">Dangerous Acceleration</ListGroup.Item>
      );
    }

    return eventList;
  }
  render() {
    return <ListGroup>{this.getEvents()}</ListGroup>;
  }
}

{
  /* <ListGroup>
  <ListGroup.Item>No style</ListGroup.Item>
  <ListGroup.Item variant="primary">Primary</ListGroup.Item>
  <ListGroup.Item action variant="secondary">
    Secondary
  </ListGroup.Item>
  <ListGroup.Item action variant="success">
    Success
  </ListGroup.Item>
  <ListGroup.Item action variant="danger">
    Danger
  </ListGroup.Item>
  <ListGroup.Item action variant="warning">
    Warning
  </ListGroup.Item>
  <ListGroup.Item action variant="info">
    Info
  </ListGroup.Item>
  <ListGroup.Item action variant="light">
    Light
  </ListGroup.Item>
  <ListGroup.Item action variant="dark">
    Dark
  </ListGroup.Item>
</ListGroup>; */
}
