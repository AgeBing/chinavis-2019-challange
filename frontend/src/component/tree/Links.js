import React from 'react'

import { panelWidth,panelHeight,
      nodeRectWidth,nodeRectHeight } from './Config'


class Links extends React.Component{
  constructor() {
    super(...arguments)
    this.state = {
    }
  }



  render(){
    let { links } = this.props
    
    return (
     <svg className='panel-links' 
          width={panelWidth} 
          height={panelHeight}  >
         {
            links.map( (link,i)=>(
                <line   
                  key={i}
                  x1={link.source.x + nodeRectWidth / 2} 
                  y1={link.source.y + nodeRectHeight}

                  x2={link.target.x  + nodeRectWidth / 2} 
                  y2={link.target.y}>
                </line> 
          ))
        }
      </svg>
    )
  }
}


export default Links


