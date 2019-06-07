
// 实现一个桑基图布局算法



let nodeConfig = {
	// 各种间距配置
	height : 100,
	width  : 28,
	xGap   : 50,
	yGap   : 5,
	heightPerCount : 0.5,
	lineGap:1
}


export function sankeyLayout(data) {
	if(data == null) return null
	let { nodes,links,rooms,times }  = data
	
	let maxValue = 5000

	let perCount  = nodeConfig.height / maxValue
	perCount = +perCount.toFixed(8)
	nodeConfig.heightPerCount = perCount
	console.log(perCount)

	// console.log(maxValue,perCount)

	let _nodes = [],
		_links = [],
		subNodes = []


	nodes.forEach((node)=>{
		_nodes.push( nodePosition(node) )
	})

	links.forEach((link)=>{
		_links.push( linkPosition(_nodes,link) )
	})

	_nodes.forEach((node)=>{
		subNodes.push( changeNodeHeight(node) )
	})

	return {
		nodes : _nodes,
		links : _links,
		rooms : rooms,
		times : times,
		subNodes
	}
}



// 第一步 计算各节点位置
// depth: 第几排
// height: 某一排的第几个
function nodePosition({depth , height, index,time}){

	let x0 = depth * (nodeConfig.xGap + nodeConfig.width),
		x1 = x0 + nodeConfig.width,
		y1 = height *(nodeConfig.yGap + nodeConfig.height),
		y0 = y1 + nodeConfig.height,
		x = [x0,x1,x1,x0],
		y = [y0,y0,y1,y1]
	 /* points
	 * 3---2
	 * |   |
	 * 0---1
	 */

	return {
		depth,
		height,
		x0,x1,
		y0,y1,
		x,y,
		index,
		time,
		useHeight:{}
	}
}


// 第二步 计算各边位置
// 从两个结点中找位置
function linkPosition(_nodes , link){
	let { source,target,value,ids,index } = link


	let lineHeight  = value * nodeConfig.heightPerCount + nodeConfig.lineGap

	let sourceNode = _nodes[source],
		targetNode = _nodes[target]

	sourceNode.useHeight.right = 
		 (sourceNode.useHeight.right == undefined ? lineHeight : ( sourceNode.useHeight.right + lineHeight) )
	targetNode.useHeight.left =  
			(targetNode.useHeight.left == undefined ? lineHeight : ( targetNode.useHeight.left + lineHeight) )

	 /* points
     * 1-------3
	 * |       |
	 * 0-------2 
	 */

	// let x0 = sourceNode.x1 + nodeConfig.width ,
	// 	y0 = sourceNode.useHeight + sourceNode.y1,
	// 	x1 = x0,
	// 	y1 = y0 - lineHeight,
	// 	x2 = targetNode.x0 ,
	// 	y2 = targetNode.useHeight + targetNode.y1,
	// 	x3 = x2,
	// 	y3 = y2 - lineHeight

	// let x = [ x0_,x1_,x2_,x3_],
	// 	y = [ y0,y1,y2,y3 ] 


	let insideLength = 0,
		insideHeight = 0
	let x1 = sourceNode.x1  - insideLength,
		y0 = sourceNode.y0 -  sourceNode.useHeight.right - insideHeight,
		x0 = x1,
		y1 = y0 + lineHeight,
		x3 = targetNode.x0 + insideLength ,
		y2 = targetNode.y0 - targetNode.useHeight.left - insideHeight,
		x2 = x3,
		y3 = y2 + lineHeight

	let x = [ x0,x1,x2,x3],
		y = [ y0,y1,y2,y3 ] 




	return { x,y,
		ids,index,
		source:sourceNode['height'],target:targetNode['height'],
		sourceNodeIndex:source,targetNodeIndex:target,
		width:lineHeight,value }
}



function changeNodeHeight(_node){

	let node = JSON.parse(JSON.stringify(_node))
	
	// console.log(_node,node)

	let h_l = node.useHeight.letf || 0,
		h_r = node.useHeight.right || 0,
		h =  (h_l >= h_r ? h_l : h_r) ,
		y0 = node.y0,    // 上
		y1 = y0 - h

		node.y1 = y1
		node.y  = [y0,y0,y1,y1]
		
		return node
}


export function m2s(minute){
	let h = Math.floor(minute/60),
		m = minute - h * 60
	
	h =  h <10 ? '0'+h : ''+h
	m =  m <10 ? '0'+m : ''+m

	return h+':'+m
}