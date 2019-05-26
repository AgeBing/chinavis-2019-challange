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
            links.map( (link,i)=>{
                let { source,target } = link
                let sourceids = Object.keys(source),
                    targetids = Object.keys(target),
                    ida = sourceids[0],
                    idb = sourceids[1],
                    idt = targetids[0]

                return (
                <g>
                  <line   
                    key={i+'a'}
                    x1={source[ida].x + nodeRectWidth } 
                    y1={source[ida].y - nodeRectHeight/ 2}

                    x2={source[idb].x + nodeRectWidth} 
                    y2={source[idb].y - nodeRectHeight/ 2}>
                  </line> 
                  <line   
                    key={i+'b'}
                    x1={(source[ida].x +source[idb].x) /2 + nodeRectWidth} 
                    y1={(source[ida].y + source[idb].y)/2 - nodeRectHeight/ 2}

                    x2={target[idt].x + nodeRectWidth} 
                    y2={target[idt].y - nodeRectHeight/ 2}>
                  </line> 
                </g>                   
                )

          })
        }
      </svg>
    )
  }
}


export default Links


