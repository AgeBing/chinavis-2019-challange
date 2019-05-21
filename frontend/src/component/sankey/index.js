import React from 'react'



import { API_Sankey }  from '../../api/index'


class Sankey extends React.Component{
  constructor() {
    super(...arguments)
    this.state = {

    }
  }

  componentWillMount(){
  	let day = 1,
  		cluster = 4, 
  		timeStart = 480, 
  		timeEnd = 960, 
  		limit  = 5000000

  	API_Sankey({
  		day, cluster, timeStart, timeEnd, limit
  	}).then((res)=>{
  		console.log(res)
  	})
  }
  

  getMainRoomPerInterval(records){
  	let obj 
  	records.forEach(()=>{

  	})

  }
  
  render(){


    return (
      <div>

      </div>

    )
  }

}




export default Sankey
