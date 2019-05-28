export const nodeRectWidth = 150
export const nodeRectHeight = 100

export const padding = 20

export const panelWidth = 620
export const panelHeight = 930

export const initalNodeX = 100
export const initalNodeY = 80

export const linkOffsetY = nodeRectHeight
export const linkOffsetX = 15

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



	// 将 panel 分成 n*m 的格子
	let n = Math.floor(panelWidth / (nodeRectWidth + padding)),
		m = Math.floor(panelHeight /(nodeRectHeight +padding)),
		grids = [1]

	let doms = document.getElementsByClassName('node-rect')

	if(doms.length > 0){
		for(let i = 0;i < doms.length;i++){
		let dom = doms[i]
			let h = dom.offsetTop,
				w = dom.offsetLeft,
				n_ = Math.floor(w / nodeRectWidth ),
				m_ = Math.floor(h / nodeRectHeight ),
				n__ = Math.floor( (w + nodeRectWidth) / nodeRectWidth ),
				m__ = Math.floor( (h +nodeRectHeight) / nodeRectHeight)
				
				grids[n_ + m_* n] = 1
				grids[n__ + m_* n] = 1
				grids[n_ + m__* n] = 1

		}
	}

	console.log(grids)
	for(let i = 0;i < m;i++){
		for(let j = 0;j < n;j++){
			if(!grids[i*n + j]){
				return {
					x : j * ( nodeRectWidth + padding),
					y : i * (nodeRectHeight + padding)
				}
			}
		}
	}
	// return {
	// 	x : x,
	// 	y : y + nodeRectHeight +  20
	// }
	return {
		x : 100,
		y : 200 + nodeRectHeight +  20
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
