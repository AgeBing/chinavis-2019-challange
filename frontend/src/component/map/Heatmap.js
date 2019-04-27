import React, { Component } from 'react';
import { connect } from 'react-redux'

import Heatmap_grid from './Heatmap_grid'
import ReactDOM from 'react-dom'

class Heatmap extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Heatmap_grids: [],
        rectWidth:35,
        rectHeight:35,
        timer:0
    };
    this.svg = React.createRef()
  }
componentDidMount(){//挂载后调用
    this.getHeatmap_grids()
  }
  componentWillReceiveProps(nextProps){//接收父组件传入的props
      this.getHeatmap_grids(nextProps)
  }
  getHeatmap_grids(nextProps){
      let self = this
    let { startHour,endHour,day,floor } = nextProps || this.props
    let data = { startHour , endHour ,day,floor }
       fetch('/api/Heatmap_grids',{
        body: JSON.stringify(data),
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, same-origin, *omit
          headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
          },
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, cors, *same-origin
          redirect: 'follow', // manual, *follow, error
          referrer: 'no-referrer', // *client, no-referrer
       })
        .then(r => r.json())
        .then(response => {
          	console.log(response)
            self.drawHeatmap(response)
        })
  }
  drawHeatmap(data){
let { rectWidth,rectHeight } = this.state 
    let { width ,height }  = this.props
        const svg = this.svg.current
         if (svg) {
          svg.innerHTML=""
          let nodes=[]
          let max=0
          let min=0
          for(let i =1;i < data.length;i++){
            if(max<data[i].count)
              max=data[i].count
            if(min>data[i].count||min==0)
              min=data[i].count
          }
          let cha=max-min
          for(let i =1;i < data.length;i++){
            let color= "rgba(0,0,255,"+(data[i].count-min)/cha+")"
           nodes.push(<Heatmap_grid x={data[i].x} y={data[i].y} color={color}>hello!</Heatmap_grid>)
          }
          ReactDOM.render(nodes ,svg)
          
  }
    }
  render() {
    let { Heatmap_grids } = this.state 
    let max=0
    let min=0
    Heatmap_grids.map((Heatmap_grid)=>{
    	if(Heatmap_grid.count>max)
    		max=Heatmap_grid.count
    	if(Heatmap_grid.count<min ||min==0)
    		max=Heatmap_grid.count
    })
    let cha=max-min
    return (
      <svg  className='map-Heatmap_grids'  ref={this.svg}
        width={this.props.width} height={this.props.height} >
          
      </svg>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    startHour: state.startHour,
    endHour: state.endHour,
    day: state.day,
  }
}


export default connect(mapStateToProps)(Heatmap)