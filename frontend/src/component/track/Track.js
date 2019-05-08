import React, { Component } from 'react';

import Stepseries from './ex/Stepseries'
import Groupedcolumn from './ex/Groupedcolumn'
import Twoline from './ex/Twoline'
import Brushinterval from './ex/Brushinterval'

import Graph from './Graph'
import MyTrack from './MyTrack'

import { connect } from 'react-redux';

class Track extends Component {
    constructor () {
        super()
    }

    render() {
        return (
            <div>
                <MyTrack lineShape='hv'></MyTrack>
                <Brushinterval></Brushinterval>
                {/* <Graph lineShape='hv'></Graph> */}
                {/* <Graph lineShape='line'></Graph> */}
            </div>
        );
    }
}
        
export default Track;