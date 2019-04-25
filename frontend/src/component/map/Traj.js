import React, { Component } from 'react';
import { connect } from 'react-redux'


class Traj extends Component {
  constructor(props) {
    super(props);
    this.state = {
        trajs: [],
        rectWidth:35,
        rectHeight:35,
        timer:0,
    };
    this.canvas = React.createRef()
  }

  componentDidMount(){
    this.changeMyProps()
  }
  componentWillUnmount(){
  }

  componentWillReceiveProps(nextProps){
    this.changeMyProps(nextProps)
  }

  changeMyProps(nextProps){
    let self = this
    let { startHour,endHour,day,floor } = nextProps || this.props
    let data = { startHour , endHour ,day,floor }
    fetch('/api/trajs',{
          body: JSON.stringify(data), // must match 'Content-Type' header
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
          // this.setState({userData: response.user_data})
          console.log(response)
          self.drawTrajs(response)
        })
  }

  drawTrajs(trajs){
    let { rectWidth,rectHeight } = this.state 
    let { width ,height }  = this.props
        const canvas = this.canvas.current

        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
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

            ctx.clearRect(0,0,width,height)

            ctx.strokeStyle = "rgba(234, 111, 90, 0.6)";
            ctx.lineWidth = 6

            // ctx.line(90, 130, 320, 210);
            for(let i =1;i < trajs.length;i++){
              let p1 = { 
                    x: trajs[i].x1 ,
                    y: trajs[i].y1 ,
                  },
                  p2 = { 
                    x: trajs[i].x2 ,
                    y: trajs[i].y2 ,
                  }

              for(let j=0;j < trajs[i].count;j++){
                ctx.moveTo( (p1.x + 1.5)* rectWidth , (p1.y + 1.5)* rectHeight  )

                ctx.line( (p1.x + 1.5)* rectWidth , (p1.y + 1.5)* rectHeight ,
                        (p2.x + 1.5)* rectWidth , (p2.y + 1.5)* rectHeight   )
              }
            }
        }

  }
  render() {
    let { trajs } = this.state 
    return (
      <canvas  className='traj-canvas' ref={this.canvas}
        width={this.props.width} height={this.props.height} >
      </canvas>
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


export default connect(mapStateToProps)(Traj)