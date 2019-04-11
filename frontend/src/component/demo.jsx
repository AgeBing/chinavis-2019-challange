import React, { Component } from 'react';
import * as axios  from 'axios'

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getUserProfile()
  }


  getUserProfile = () => {

          fetch('/api/profile/')
      .then(r => r.json())
      .then(response => {
        // this.setState({userData: response.user_data})
        console.log(response)
      })
  };

  render() {
    return (
      <div>
          <h1>Demo 1</h1>
      </div>
    );
  }
}
