import React from "react";

import DataSet from "@antv/data-set";
import { connect } from 'react-redux'

import { List, Typography } from 'antd';

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

class UserList extends React.Component {
   constructor() {
    super(...arguments)
    this.state = {
    }
  }
  render() {

    return (
      <div>
           <List
		      size="small"
		      bordered
		      dataSource={this.props.uids}
		      renderItem={item => <List.Item>{item}</List.Item>}
		    />
		</div>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    uids : state.selectIdsGlobal
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeSelectCluster: (clusterNum) => {
      let type = 'CHANGE_CLUSTERNUM'
      dispatch({ type, clusterNum });
    },
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(UserList);