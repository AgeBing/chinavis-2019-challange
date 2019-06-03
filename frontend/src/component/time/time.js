import React, { Component } from "react";
import * as d3 from "d3";
import './time.css'
import { connect } from 'react-redux'

import { m2h,m2m,m2t,t2m } from './util.js'

const width = 1160;
const height = 36;



const mapStateToProps = (state) => {
  return {
    timeInterval: state.timeInterval,
    mode : state.mode
  }
}

class TimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    this.svg = React.createRef()
  }

  componentWillMount(){
    this.updateScale()
  }

  componentWillReceiveProps(nextProps){
      if(this.props.timeInterval.minites.toString() != nextProps.timeInterval.minites.toString() ){

            this.props.changeGlobalTime({
              day : nextProps.timeInterval.day,
              minites: nextProps.timeInterval.minites,
              times:[]
             })

          let newtimScale =  this.updateScale(nextProps)

          this.setAxis( {timeScale:newtimScale} )
          if( nextProps.mode == 'heat'){
            this.updateCursor(nextProps)
          }
      }
      if(this.props.mode != nextProps.mode){
          this.updateWidgets( {mode:nextProps.mode} )
      }
  }


  updateScale(nextProps){
    let timeScale = d3.scaleTime().range([0, width]),
        timeScale2 = d3.scaleTime().range([0, width])  
    
    let { timeInterval }  = nextProps || this.props,
        { day,minites } = timeInterval

    let range = [ new Date(2000, 0, 1,  m2h(minites[0]) , m2m(minites[0]) ),
                  new Date(2000, 0, 1,  m2h(minites[1]) , m2m(minites[1]) ) ]
    
    timeScale.domain(range)
    timeScale2.domain(range)
    
    this.setState({
      timeScale,timeScale2,
      selectTimeInterval : [].concat(minites)
    })

    return timeScale
  }
  componentDidMount(){

    this.setAxis()
      // this.setZoom(
    // this.setBrush()
    // this.setCursor()
    this.updateWidgets()
  }

  updateWidgets(_mode){
    let { mode } = _mode ||  this.props

    if(mode == 'traj'){
      this.setZoom()
      d3.select(this.svg.current).select('.cursor').remove()
    }else{
      this.setCursor()
      d3.select(this.svg.current).select('.zoom').remove()
    }
  }

  setAxis(newtimScale){
    let { timeScale } = newtimScale || this.state
    
    let axisFunc =  d3.axisBottom(timeScale)
    axisFunc.ticks(10)  //显示的个数
      .tickFormat(  d3.timeFormat("%H:%M")  )
    let topAxis =  d3.select(this.svg.current)
                .call(axisFunc);
    // 更新时间轴
    this.syncAsixFunc = function(){
      topAxis.call(axisFunc)
    }
  }
  setZoom(){
    let self = this
    let zoomFunc = d3.zoom()
      .scaleExtent([1, 100])  //缩放比例
      .translateExtent([[0, 0], [width,height] ])
      .on('zoom',()=>{
        self.func_zoomed()  //缩放、拖动
      })
      d3.select(this.svg.current)
        .append('rect')
        .attr('class','zoom')
        .attr('width',width)
        .attr('height',height)
          .call(zoomFunc)
  }
  setBrush(){
   let  brushFunc = d3.brushX()
        .extent([[0, 0], [width,height]])
        // .extent([[0, 0], [w * 0.9, Config.vRectHeight]])
        .on("start", ()=>{
          // console.log('start')
          // brushStyle()
        })
        .on("brush",()=>{
          // s = d3.event.selection
          // brushStyle()
          console.log('brush')
        })
        .on("end",()=>{
          console.log('end')
        });

    d3.select(this.svg.current)
          .append('g')
          .attr('class','brush')
          .call(brushFunc)
          .call(brushFunc.move, [30,40]); //拖动框
  }

  setCursor(){
      let { timeScale } = this.state
      let { timeInterval } =  this.props

      let cursorMinite = timeInterval.minites[0]

      let self =  this
      let cursorWidth = 20
      let cursor =  d3.select(this.svg.current)
                      .append('rect')
                      .attr('class','cursor')
                      .attr('x',0)
                      .attr('y',0)
                      .attr('width',cursorWidth)
                      .attr('height',height)
                      .call(d3.drag()
        .on("drag", dragged))

      this.setState({
        cursorMinite
      })

    function dragged(d) {
      d3.select(this).attr("x",()=>{
        let x = d3.event.x
        x = x < 0 ? 0 : x
        x = x > (width - cursorWidth) ? (width- cursorWidth) : x
        return x
      });

      self.setCursorTime()
    }
  }
  updateCursor(nextProps){
      let minite = nextProps.timeInterval.minites[0]
      d3.select(this.svg.current).select('.cursor')
          .attr('x',0)
      this.props.changeGlobalCursorTimeIm(minite)
  }
  setCursorTime(){
      let { timeScale } = this.state
      let x = +d3.select(this.svg.current).select('.cursor').attr('x'),
          time = timeScale.invert(x),
          minite =  t2m(time.getHours(),time.getMinutes())

      this.props.changeGlobalCursorTime(minite)
      // console.log(m2t(minite))
      this.setState({
        cursorMinite : minite
      })
  }


  // 频繁触发
  func_zoomed(){
    let s = []
    let { timeScale,timeScale2 }  =  this.state
    let t = d3.event.transform

    //更新 timeScale
    timeScale.domain(t.rescaleX(timeScale2).domain())   //  timeScal2 不变

    //更新时间轴
    this.syncAsixFunc() 

    let t_s = timeScale.invert(0),
        t_e =  timeScale.invert(width),
        interval = [ 
            t2m(t_s.getHours(),t_s.getMinutes()),
            t2m(t_e.getHours(),t_e.getMinutes())
        ],
        times = [
            m2t(interval[0]),
            m2t(interval[1]), 
        ]



    this.setState({
      selectTimeInterval : interval
    })

    // 同时触发全局时间状态的更新
    this.props.changeGlobalTime({
        day : this.props.timeInterval.day,
        minites: interval,
        times:times
    })
}

  render() {
    let { selectTimeInterval,cursorMinite } = this.state
    let { timeInterval }  = this.props

    return (
      <div className='time-container'>
        <div className='time-info'>
          <span className='time-info-day'> Day {timeInterval['day']}</span>
          <span className='time-info-time'>
          { this.props.mode == 'traj' ? 
            (
              m2t(selectTimeInterval[0]) + '-' + m2t(selectTimeInterval[1])
            ) : 
            (
              m2t(cursorMinite)
            )
          }

          </span> 
        </div>
        <svg width={width} height={height} ref={this.svg} className='time-svg'>
        </svg>
      </div>
    );
  }
}




const mapDispatchToProps = dispatch => {
  var timer,
    delay = 1000;

  return {
    changeGlobalTime: (interval) => {
      let type = 'CHANGE_SELECT_TIME'
      clearTimeout( timer )
      timer = setTimeout( function(){
          dispatch({ type, timeInterval:interval });
      } , delay )
    },
    changeGlobalCursorTime: (minite) => {
      let type = 'CHANGE_CURSOR_TIME'
      clearTimeout( timer )
      timer = setTimeout( function(){
          dispatch({ type, cursorTime:minite });
      } , delay )
    },
    changeGlobalCursorTimeIm:(minite)=>{
      let type = 'CHANGE_CURSOR_TIME'
          dispatch({ type, cursorTime:minite });
    }
    ,
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TimeLine)