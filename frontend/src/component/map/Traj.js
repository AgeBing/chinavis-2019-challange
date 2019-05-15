import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as Config from './Config'

import { API_Traj }  from '../../api/index'



class Traj extends Component {
  constructor(props) {
    super(props);
    this.state = {
        trajs: [],
        timer:0,
    };
    this.canvas = React.createRef()
  }

  componentWillMount(){

  }

  componentDidMount(){
    this.requestNewTrajs()
  }
  componentWillUnmount(){
  }

  componentWillReceiveProps(nextProps){
      if(this.props.stateNodeId != nextProps.stateNodeId){
        this.requestNewTrajs(nextProps)
      }
      if(this.props.opacity != nextProps.opacity){
        this.reDrawCurrentTrajs(nextProps)
      }
  }

  requestNewTrajs(nextProps){
    let { width ,height }  = this.props
    const canvas = this.canvas.current
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height)

   let { timeInterval,stateNodeId,floor,rooms,opacity } = nextProps || this.props
   let startMiniter = timeInterval.minites[0],
        endMiniter = timeInterval.minites[1],
        day = timeInterval.day ,
        self = this

    // let trajs = this.getStotage(stateNodeId)

    // if(trajs){
    //     trajs.forEach((traj)=>{
    //       self.drawTraj(traj)
    //     })
    // }else{
      // API_Traj({ startMiniter,endMiniter,floor,day}).then((res)=>{
        // this.saveToStorage(res,stateNodeId)
        // res.forEach((traj)=>{
          // self.drawTraj(traj)
        // })
      // })
    // }

    API_Traj({ startMiniter,endMiniter,floor,day,rids:rooms}).then((res)=>{
        console.log('轨迹条数',res.length)
        res.forEach((traj)=>{
          self.drawTraj(traj,opacity)
        })
        self.setState({ trajs:res })
    })
  }
  reDrawCurrentTrajs(nextProps){
   let { opacity } = nextProps || this.props
   let { trajs } = this.state
   let self = this
    let { width ,height }  = this.props
    const canvas = this.canvas.current
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height)

   console.log(opacity)
   trajs.forEach((traj)=>{
    self.drawTraj(traj,opacity)
   })

  }
  getStotage(stateNodeId){
    let { floor } = this.props
    let storage=window.localStorage
    let data = localStorage.getItem(stateNodeId+';'+floor)
    if(!data)  return JSON.parse(data)
    return null
  }

  saveToStorage(data,stateNodeId){
    let { floor } = this.props
    let storage=window.localStorage
    let dataStr = JSON.stringify(data)
    let maxSize = 5 * 1024 * 1024  // 最大 5M
    if(dataStr.length > maxSize ) console.log('超出存储限制')
    storage.setItem(stateNodeId + ';' +floor , dataStr);

  }

  drawTraj(points,opacity){
    let { rectWidth,rectHeight } = Config
    let { width ,height }  = this.props
    const canvas = this.canvas.current
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.globalAlpha = opacity;
        (function () {
            Object.getPrototypeOf(ctx).line = function (x, y, x1, y1) {
                this.save();
                this.beginPath();
                this.moveTo(x, y);
                this.lineTo(x1, y1);
                this.stroke();
                this.restore();
            }
        })();

        // ctx.clearRect(0,0,width,height)

        ctx.strokeStyle = "rgba(234, 111, 90, 0.15)";
        ctx.lineWidth = 1

        for(let i =1;i < points.length;i++){
          let p1 = { 
                x: points[i].x1 ,
                y: points[i].y1 ,
              },
              p2 = { 
                x: points[i].x2 ,
                y: points[i].y2 ,
              }

            let { p1_offset,p2_offset} =  Config.getRandOffset(p1,p2)

            ctx.moveTo( p1_offset.x , p1_offset.y  )

            ctx.line( p1_offset.x , p1_offset.y ,
                    p2_offset.x , p2_offset.y  )
        }
    }

  }
  render() {
    return (
      <canvas  className='traj-canvas' ref={this.canvas}
        width={this.props.width} height={this.props.height} >
      </canvas>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    timeInterval: state.timeInterval,
    stateNodeId : state.stateNodeId,
    rooms:state.rooms,
    opacity:state.opacity
  }
}


export default connect(mapStateToProps)(Traj)