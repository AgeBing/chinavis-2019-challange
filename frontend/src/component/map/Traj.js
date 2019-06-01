import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as Config from './Config'

import { API_Traj,API_Uid_ByCluster }  from '../../api/index'



class Traj extends Component {
  constructor(props) {
    super(props);
    this.state = {
        trajs: [],   // 当前轨迹数据  用于重绘
        canvasHideFlag:false
    };
    this.canvas = React.createRef()
    this.canvasHigh = React.createRef()
  }

  componentWillMount(){

  }

  componentDidMount(){
      this.requestNewTrajs()
  }
  componentWillUnmount(){
  }

  componentWillReceiveProps(nextProps){
    //参数变化  
      // 体检改变
      if(this.props.selectTimeInterval.day != nextProps.selectTimeInterval.day ||
         this.props.selectTimeInterval.minites.toString() != nextProps.selectTimeInterval.minites.toString() ||
         this.props.rooms.toString() != nextProps.rooms.toString()){
        
        // 重新获取数据
        this.requestNewTrajs(nextProps) 
      }
      // 切换透明度
      if(this.props.opacity != nextProps.opacity){
        this.reDrawCurrentTrajs(nextProps)
      }
  }

  requestNewTrajs(nextProps){
    let { selectTimeInterval,stateNodeId,floor,rooms,opacity } = nextProps || this.props
    
    let startMiniter = selectTimeInterval.minites[0],
        endMiniter = selectTimeInterval.minites[1],
        day = selectTimeInterval.day ,
        self = this

    this.clearCanvas(0)

    API_Traj({ startMiniter,endMiniter,floor,day,rids:rooms}).then((res)=>{
        res.forEach((traj)=>{
          self.drawTraj(0, traj,opacity)
        })
  
        self.setState({ trajs:res })
    })
  }
  reDrawCurrentTrajs(nextProps){
    let { opacity } = nextProps || this.props
    let { trajs } = this.state
    let self = this

    this.clearCanvas(0)

    trajs.forEach((traj)=>{
      self.drawTraj(0, traj,opacity)
    })

  }

  highLightSomeTajs(nextProps){

    let { trajs } = this.state
    let { opacity } = nextProps || this.props

    let self = this

    API_Uid_ByCluster({ clusterNum:nextProps.clusterNum })
      .then((uids)=>{
        let someTrajs = trajs.filter((traj)=>{
            let id = traj[0].id
            return (uids.indexOf(id) != -1)
        })

        someTrajs.forEach((traj)=>{
          this.drawTraj(1, traj , opacity)
        })

        this.clearCanvas(1)
        this.hideCanvas(0)
      })


  }
  unHighLightSomeTrajs(){
    this.showCanvas()
    this.clearCanvas(1)
  }


  // 绘制一条轨迹 
  drawTraj(layer , points,opacity){    
    let { rectWidth,rectHeight } = Config
    let { width ,height }  = this.props
    
    // layer = 0 表示底层， layer = 1表示上层(highlight)
    const canvas = layer == 0 ?  this.canvas.current : this.canvasHigh.current

    if (canvas && canvas.getContext) {
        let ctx = canvas.getContext("2d");
        ctx.globalAlpha = opacity;


        // 封装绘制函数
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


        ctx.strokeStyle =  layer == 0 ?  "rgba(234, 111, 90, 0.15)" : "rgba(250, 207, 90, 0.15)"
        ctx.lineWidth =  layer == 0 ?   1  : 1

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
    let { canvasHideFlag } = this.state
    return (
      <div className='traj-container'  style={{ 
              width : this.props.width,
              height: this.props.height
      }} >
         <canvas  className={canvasHideFlag?'traj-canvas traj-canvas-hide':'traj-canvas' } ref={this.canvas}
          width={this.props.width} height={this.props.height} >
        </canvas>
        <canvas  className='traj-canvas-highlight' ref={this.canvasHigh}
          width={this.props.width} height={this.props.height} >
        </canvas>
      </div>
    );
  }

  clearCanvas(layer){
    let { width ,height }  = this.props
    const canvas =  layer == 0 ? this.canvas.current  : this.canvasHigh.current
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height)
  }
  hideCanvas(layer){
    this.setState({
      canvasHideFlag : true
    })
  }
  showCanvas(layer){
    this.setState({
      canvasHideFlag : false
    })
  }
}


const mapStateToProps = (state) => {
  return {
    selectTimeInterval: state.selectTimeInterval,
    stateNodeId : state.stateNodeId,
    rooms:state.rooms,
    opacity:state.opacityTraj,
  }
}


export default connect(mapStateToProps)(Traj)