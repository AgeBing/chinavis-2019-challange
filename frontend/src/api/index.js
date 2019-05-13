
import { request,requestSync }   from './request.js'

export let API_Rooms = (data,url = '/api/rooms' ,method = 'POST') =>  request({ url , data ,method})

export let API_Sensors1 = () => request({ url:'/api/grids1'})
export let API_Sensors2 = () => request({ url:'/api/grids2'})


export let API_Heatmap_Grids = (data,url = '/api/Heatmap_grids' ,method = 'POST') =>  request({ url , data ,method})





export let API_Traj = (data,url = '/api/trajs_uid' ,method = 'POST') =>  request({ url , data ,method})


export let API_SYNC_Rooms = (data,url = '/api/rooms' ,method = 'POST') =>  requestSync({ url , data ,method})

export let API_Track = () => request({ url:'/api/track'})