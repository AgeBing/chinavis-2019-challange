import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Label,
  Legend,
} from 'bizcharts';

import { API_Heatmap_Grids } from '../../api/index'


import { connect } from 'react-redux'



const mapStateToProps = (state) => {
  return {
    heatmap_time: state.heatmap_time,
  }
}


let Config = {
  1 : {
     x_num: 30,
     y_num: 15,
     width: 640,
     height: 368
  },
  2 : {
     x_num: 12,
     y_num: 15,
     width: 280,
     height: 368
  }
}

class Heatmap extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        data : [],
        config:Config[1],
    };
  }
  componentWillMount(){

    let { floor } = this.props

    let config = Config[floor]
    this.setState({ 
      config
    })



    let { heatmap_time } = this.props
    let startHour = Math.floor(heatmap_time[0] / 60) ,
        endHour = Math.floor(heatmap_time[1] / 60)
    console.log(startHour,endHour ) 
    let data  = { 
      startHour ,
      endHour ,
      day:1,
      floor:floor
    }
    this.requestData(data)

  }

  requestData(data){
    let self = this

    API_Heatmap_Grids(data).then((res)=>{
      // console.log(res)
      for(let i =0; i < res.length;i++){
        res[i]['y_reverse'] = 15 - res[i]['y']
      }

      self.setState({
        data : res
      })
    })
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps)
    let { heatmap_time,floor } = nextProps
    let startHour = Math.floor(heatmap_time[0] / 60) ,
        endHour = Math.floor(heatmap_time[1] / 60)

    let data  = { 
      startHour ,
      endHour ,
      day:1,
      floor:floor
    }

    console.log(startHour,endHour ) 

    this.requestData(data)
  }


  render() {
    let { config } = this.state

    let x_values = [],
        y_values =[]
    for(let i =0;i < config.x_num;i++){
      x_values.push(i)
    }
    for(let i = config.y_num;i >= 0;i--){
      y_values.push(i)
    }
    const cols = {
      x : {
        type : 'cat',
        values: x_values
      },
      y : {
        type : 'cat',
        values: y_values
      },
      y_reverse:{
        type : 'cat',
        values: y_values
      }
    }


    return (
      <div style={{ 'display':'inline-block', 'width':config.width , 'height':config.height  }}>
        <Chart
          width={config.width}
          height={config.height - 9 + 70}
          data={this.state.data}
          scale={cols}
          padding={[ 20, 20, 90, 20]}
        >
          <Axis
            name="x"
            grid={{
              align: 'center',
              lineStyle: {
                lineWidth: 1,
                lineDash: null,
                stroke: '#f0f0f0',
              },
              showFirstLine: true,
            }}
          />
          <Axis
            name="y"
            grid={{
              align: 'center',
              lineStyle: {
                lineWidth: 1,
                lineDash: null,
                stroke: '#f0f0f0',
              },
              showFirstLine: true,
            }}
          />
          <Tooltip title="位置:人数"/>
          <Legend name='count' sizeType="circle" offsetY={-15}/>
          <Geom
            type="polygon"
            position="x*y_reverse"
            color={['count', '#BAE7FF-#1890FF-#0050B3']}
            style={{
              stroke: '#fff',
              lineWidth: 1,
              opacity: 0.3
            }}

             tooltip={['x*y*count', (x, y,count) => {
                return {
                  //自定义 tooltip 上显示的 title 显示内容等。
                  name: `(${x},${y})`,
                  value: count
                };
              }]}
          >
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Heatmap)
