import React, { Component } from 'react';

import Link from './Link.js'

export default class Links extends Component {
  constructor(props) {
    super(props);
    this.state = {
        links : []
    };
  }
  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){
    let { links } = nextProps
    let { x,y,width,height } = this.treedom.getBoundingClientRect()

    let _links = []
    links.forEach((link)=>{
        _links.push({
          source:{
            x: link.source.x - x,
            y: link.source.y - y
          },
          target:{
            x: link.target.x - x,
            y: link.target.y - y
          }
        })
    })
    this.setState({
      links:_links
    })
  }

  render() {
    let { links } = this.state

    return (
      <svg className='links'
        width={this.props.width} height={this.props.height} 
        ref={dom => {this.treedom = dom}} >
        {
          links.map((link)=>(
            <Link source={link.source}  target={link.target} key={link.id}/>
          ))

        }
      </svg>
    );
  }
}
