import React, { Component } from 'react';

import Stepseries from './ex/Stepseries'
import Groupedcolumn from './ex/Groupedcolumn'
import Twoline from './ex/Twoline'
import Brushinterval from './ex/Brushinterval'
import Brushline from './ex/Brushline'

import MyTrack from './MyTrack'

import { connect } from 'react-redux';

class Track extends Component {
    constructor () {
        super()
    }

    render() {
        return (
            <div>
                <MyTrack ></MyTrack>
            </div>
        );
    }
}
        
export default Track;