
// 实现一个桑基图布局算法



let nodeConfig = {
	// 各种间距配置
	height : 50,
	width  : 10,
	xGap   : 400,
	yGap   : 10,
	heightPerCount : 0.5,
}


export function sankeyLayout(data) {
	if(data == null) return null
	let { nodes,links }  = data

	let _nodes = [],
		_links = []


	nodes.forEach((node)=>{
		_nodes.push( nodePosition(node) )
	})

	links.forEach((link)=>{
		_links.push( linkPosition(_nodes,link) )
	})

	return {
		nodes : _nodes,
		links : _links
	}
}



// 第一步 计算各节点位置
// depth: 第几排
// height: 某一排的第几个
function nodePosition({depth , height, name}){

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
		name
	}
}


// 第二步 计算各边位置
// 从两个结点中找位置
function linkPosition(_nodes , link){
	let { source,target,value,ids } = link

	let lineHeight  = value * nodeConfig.heightPerCount

	let sourceNode = _nodes[source],
		targetNode = _nodes[target]

	sourceNode.useHeight =  (sourceNode.useHeight) == undefined ? lineHeight : ( sourceNode.useHeight + lineHeight)
	targetNode.useHeight =  (targetNode.useHeight) == undefined ? lineHeight : ( targetNode.useHeight + lineHeight)

	 /* points
     * 1-------3
	 * |       |
	 * 0-------2 
	 */

	let x0 = sourceNode.x1 + nodeConfig.width ,
		y0 = sourceNode.useHeight + sourceNode.y1,
		x1 = x0,
		y1 = y0 - lineHeight,
		x2 = targetNode.x0 ,
		y2 = targetNode.useHeight + targetNode.y1,
		x3 = x2,
		y3 = y2 - lineHeight

	let x = [ x0,x1,x2,x3 ],
		y = [ y0,y1,y2,y3 ] 

	return { x,y,ids,source:sourceNode['height'],target:targetNode['height'],width:lineHeight,value }
}


