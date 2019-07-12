import * as d3Sankey from 'd3-sankey'
import * as d3 from 'd3'
var CircularJSON = require('circular-json');

// 取数组的交集
function inter(a,b){
	let aSet = new Set(a)
	let bSet = new Set(b)
	let intersection = Array.from(new Set(a.filter(v => bSet.has(v))))
	return intersection
}

// 取数组的并集
function union(a,b){
	return 	Array.from(new Set(a.concat(b)))
}

// 比较两数组是否相等
function equel(a, b) {
	let as = new Set(a)
	let bs = new Set(b)
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}



//  手动计算 node 位置 ， d3-sankey 算的就不要了
//  再手动计算 link 的 width , update 一些
//  根据widith 自适应
function updateNodes(nodes,links,d3sankey,width,height){
	let wordPadding = {
		x : 50,
		y : 20
	}

	let nodePadding = 10,
		nodeWidth = 20,
		nodeHeight =  (height + nodePadding - wordPadding.y  ) / (d3.max(nodes.map((n)=>n.h)) + 1) - nodePadding,
		linkPadding = (width + nodeWidth - 5 - wordPadding.x ) / ( d3.max(nodes.map((n)=>n.d)) + 1) - nodeWidth,
		maxCount   = 3000,
		ky    = nodeHeight / maxCount   //link 每个count 的宽度

	nodes.forEach(node => {
		node.x0 = node.d * (nodeWidth + linkPadding) + wordPadding.x
		node.x1 = node.x0 + nodeWidth
		node.y0 = node.h * (nodeHeight + nodePadding) + wordPadding.y
		node.value = 0
		for (const link of node.sourceLinks) {
		  node.value += link.value
          link.width = link.value * ky
        }
		node.y1 = node.y0 + nodeHeight
		node.width = node.value * ky
	})
   	return d3sankey.update({ nodes:nodes,links:links })
}


/*
	魔改 d3-sankey
	自定义桑基图，在d3-sankey上再封装一层
	使 ndoe 位置 按照 depth 和 height 预定义
*/
export default class sankey{
	constructor(data,width,height){
		//拷贝一份 node 的 depth 和 height  因为 d3-sankey 会为node添加这两个参数，为了不被改掉就自己存下来
		this.getNodeHeightAndDepth(data.nodes)


		this.width = width
		this.height = height

		let d3sankey = d3Sankey.sankey()
	      .extent([[0, 0], [width - 5, height - 5]])
	    const  { nodes,links } = d3sankey( data )
	   	let graph = updateNodes(nodes,links,d3sankey,width,height)

	   	this.nodes = graph.nodes
	   	this.links = graph.links
	   	this.y     = data.times
	   	this.x     = data.rooms
	}
	getNodeHeightAndDepth(nodes){
		nodes.forEach((node)=>{
			node.d = node.depth
			node.h = node.height
		})
		// 备份
		this.subNodes = JSON.parse(CircularJSON.stringify(nodes))
	}

	renderNodes(el){
		let self = this
		el.append("g")
			.attr('stroke-width',0.5)
			.attr("stroke", "#000")
			.attr('stroke-dasharray',1)
		    .selectAll("rect")
		    .data(this.nodes)
		    .join("rect")
		      .attr("x", d => d.x0)
		      .attr("y", d => d.y0)
		      .attr("height", d => d.y1 - d.y0)
		      .attr("width", d => d.x1 - d.x0)
		      .attr("fill", "none")

		let x_axis = []
		this.x.forEach((_x,_i)=>{
			for(let i =0;i < this.nodes.length;i++){
				if(this.nodes[i].h == _i){
					x_axis.push({
						y: (this.nodes[i].y0 + this.nodes[i].y1) / 2,
						text  : _x,
						index : _i
					})
					break
				}
			}	
		})

		let y_axis = []

		this.y.forEach((_y,_i)=>{
			for(let i =0;i < this.nodes.length;i++){
				if(this.nodes[i].d == _i){
					y_axis.push({
						x: (this.nodes[i].x0 + 2),
						text  : _y
					})
					break
				}
			}	
		})

		let textPosition = {
			x : 10,
			y : 10
		}

		el.append("g")
		    .selectAll("text")
		    .data(x_axis)
		    .join("text")
		      .style('opacity',0.5)
		      .attr("x", textPosition.x)
		      .attr("y", d => d.y)
		      .text(d=>d.text)
		       .append("title")
				.text(d => d.text);

		el.append("g")
		    .selectAll("text")
		    .data(y_axis)
		    .join("text")
		      .attr("x", d=> d.x)
		      .attr("y", textPosition.y)
		      .text(d=>d.text)


		el.append("g")
		    .selectAll("rect")
		    .data(this.nodes)
		    .join("rect")
		   	.attr("opacity", 0.3)
		      .attr("x", d => d.x0)
		      .attr("y", d => d.y0)
		      .attr("height", d => d.width)
		      .attr("width", d => d.x1 - d.x0)
		      .attr("fill", "red")
		      .on("mouseover",function(d){
		      	if(self.selectIds) return 

		      	let ids = []

		      	d.sourceLinks.forEach((link)=>{
		      		ids = union(ids,link.ids)
		      	})
		      	d.targetLinks.forEach((link)=>{
		      		ids = union(ids,link.ids)
		      	})

		      	self.getSubLinks(ids)
		      }) 
		      .on("mouseout",function(d){
		      	if(self.selectIds) return 
		      	self.removeSubLinks()
		      })
		      .on('mousedown',function(d){
	    	 	let ids = []
		      	d.sourceLinks.forEach((link)=>{
		      		ids = union(ids,link.ids)
		      	})
		      	d.targetLinks.forEach((link)=>{
		      		ids = union(ids,link.ids)
		      	})

		      	// 之前未选中  或者 和这次选的不是同一个
		    	if(!self.selectIds){  
		    	 	self.getSubLinks(ids)
		    	 	self.selectIds = ids
		    	 }else if(!equel(self.selectIds, ids)){
					self.removeSubLinks()
		    	 	self.getSubLinks(ids)
		    	 	self.selectIds = ids
		    	 }else{
		    	 	self.removeSubLinks()
		    	 	self.selectIds = null
		    	 }
		      })


		this.el = el
	}
	renderLinks(el){
		let self = this
		let link = el.append("g")
			  .attr('class','links')
		      .attr("fill", "none")
		      .attr("stroke-opacity", 0.4)
			    .selectAll("g")
			    .data(this.links)
			    .join("g")
			      .style("mix-blend-mode", "multiply")

	      link.append("path")
		      .attr("d", d3Sankey.sankeyLinkHorizontal())
		      .attr("stroke", "red")
		      .attr("stroke-width", d => Math.max(1, d.width))
		      .on("mouseover",function(d){
		      	if(self.selectIds) return 

		      	let ids = d.ids
		      	self.getSubLinks(ids)
		      })
		      .on("mouseout",function(d){
		      	if(self.selectIds) return 
		      	self.removeSubLinks()
		      })
		      .on('mousedown',function(d){
		      	let ids = d.ids
		      	// 之前未选中  或者 和这次选的不是同一个
		    	if(!self.selectIds){  
		    	 	self.getSubLinks(ids)
		    	 	self.selectIds = ids
		    	 	if(self.selectEvent){
		    	 		self.selectEvent(ids)
		    	 	}
		    	 }else if(!equel(self.selectIds, ids)){
					self.removeSubLinks()
		    	 	self.getSubLinks(ids)
		    	 	self.selectIds = ids
		    	 	if(self.selectEvent){
		    	 		self.selectEvent(ids)
		    	 	}
		    	 }else{
		    	 	self.removeSubLinks()
		    	 	self.selectIds = null
		    	 	if(self.unSelectEvent){
		    	 		self.unSelectEvent(ids)
		    	 	}
		    	 }
		      })
	}
	print(){
		console.log("nodes" , this.nodes)
		console.log("links" , this.links)
	}
	getSubLinks(ids){
		let subLinks = []
		this.links.forEach((link)=>{
			let interIds = inter(ids , link.ids)
			if(interIds.length > 0){
				subLinks.push( {
					source : link.source.index,
					target : link.target.index,
					value  : interIds.length
				})
			}
		})
		let d3Subsankey = d3Sankey.sankey()
	      .extent([[0, 0], [this.width - 5, this.height - 5]])
	    const  { nodes,links } = d3Subsankey({ nodes: this.subNodes , links: subLinks})

	    let graph = updateNodes(nodes,links,d3Subsankey,this.width,this.height)

	    this.subLinks = graph.links
	    this.renderSubLinks()
	}
	removeSubLinks(){
		if(!this.el) return

		this.el.selectAll('.links')
 			.attr("stroke-opacity", 0.4)

		this.el.select('.sub-links').remove()
		this.el.select('.sub-nodes').remove()
	}
	renderSubLinks(){
 		let el = this.el

 		el.selectAll('.links')
 			.attr("stroke-opacity", 0.1)


		let link = el.append("g")
			  .attr('class','sub-links')
			  .style('pointer-events','none')
		      .attr("fill", "none")
		      .attr("stroke-opacity", 1)
			    .selectAll("g")
			    .data(this.subLinks)
			    .join("g")
			      .style("mix-blend-mode", "multiply")



		link.append("path")
		  .attr("d", d3Sankey.sankeyLinkHorizontal())
		  .attr("stroke", "red")
		  .attr("stroke-width", d => Math.max(1, d.width))

		el.append("g")
			.attr('class','sub-nodes')
		    .selectAll("rect")
		    .data(this.subNodes)
		    .join("rect")
			  .style('pointer-events','none')
		      .attr("x", d => d.x0)
		      .attr("y", d => d.y0)
		      .attr("height", d => d.width)
		      .attr("width", d => d.x1 - d.x0)
		      .attr("fill", "red")
	}
	registerEvent(selectEvent , unSelectEvent){
		this.selectEvent = selectEvent
		this.unSelectEvent = unSelectEvent
	}
}