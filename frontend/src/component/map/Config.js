export let mapWidth 	= 640
export let mapHeight 	= 360
export let mapWidthHalf = 280


export let rectWidth  = 20
export let rectHeight = 20





// 让轨迹点在 方块内 随机分布 
function getRandSet(){
	// 正方形中心向外偏移
	// let randomSet = [ 0.3,0.4,0.5,0.6,0.7 ]
	// let randomSet = [ 0.4,0.45,0.5,0.55,0.6 ] 
	let randomSet = [ 0.1,0.3,0.5,0.7,0.9 ] 
	let i = Math.floor(Math.random()*10/2)
	return ( randomSet[i] || 0.5 ) 
}

let lastoffSet = {
	origin: {x:-1,y:-1},
	offset: {x:0,y:0}
}
export function getRandOffset(p1,p2){
	let p1_offset,p2_offset

	if(p1.x == lastoffSet.origin.x 
		&& p1.y == lastoffSet.origin.y){  // 是否与上一个相等

		p1_offset = Object.assign({},lastoffSet.offset)

	}else{
		p1_offset = {
			x : rectWidth*( p1.x  + 1 + getRandSet()),
			y : rectHeight*( p1.y + 1 + getRandSet())
		}
	}

	p2_offset = {
		x : rectWidth*( p2.x  + 1 + getRandSet()),
		y : rectHeight*( p2.y + 1 + getRandSet())
	}
	lastoffSet = {
		origin :  Object.assign({}, p2) , 
		offset :  Object.assign({}, p2_offset) 
	}

	return { p1_offset , p2_offset }
}