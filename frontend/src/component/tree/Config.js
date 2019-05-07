export const nodeRectWidth = 150
export const nodeRectHeight = 100


export const panelWidth = 525
export const panelHeight = 790

export const initalNodeX = 100
export const initalNodeY = 80

let idCounts = 100,
	idArray = []
for(let i = 0;i < idCounts;i++){
	idArray[i] = i+1
}
idArray.sort(()=>(0.5 - Math.random()))

export function getRandId(){
	if(idArray.length <= 0){
		console.log('id not enough')
		return -1
	}
	return idArray.shift()
}


export function getNewPosition(x,y){

	return {
		x : x,
		y : y + nodeRectHeight +  20
	}
}


export function _M2T(mins) {
  let h = Math.floor(mins/60)
  let m = mins % 60
  return  `${h}:${m}`
}

export function _T2M(T) {
	let ts = T.split(':'),
		h = +ts[0] || 0,
		m = +ts[1] || 0
	return h * 60 + m
}
