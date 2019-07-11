import * as d3Sankey from 'd3-sankey'
import * as d3 from 'd3'


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



const width = 1000
const height = 1000


//  手动计算 node 位置 ， d3-sankey 算的就不要了
//  再手动计算 link 的 width , update 一些
function updateNodes(nodes,links,d3sankey){
	let nodeWidth = 15,
		nodeHeight = 40,
		nodePadding = 10,
		linkPadding = 40,
		maxCount   = 3000,
		ky    = nodeHeight / maxCount   //link 每个count 的宽度

	nodes.forEach(node => {
		node.x0 = node.d * (nodeWidth + linkPadding)
		node.x1 = node.x0 + nodeWidth
		node.y0 = node.h * (nodeHeight + nodePadding)
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
	constructor(data){
		//拷贝一份 node 的 depth 和 height  因为 d3-sankey 会为node添加这两个参数，为了不被改掉就自己存下来
		this.getNodeHeightAndDepth(data.nodes)

		let d3sankey = d3Sankey.sankey()
	      .extent([[0, 0], [width - 5, height - 5]])
	    const  { nodes,links } = d3sankey( data )
	   	let graph = updateNodes(nodes,links,d3sankey)

	   	this.nodes = graph.nodes
	   	this.links = graph.links
	}
	getNodeHeightAndDepth(nodes){
		nodes.forEach((node)=>{
			node.d = node.depth
			node.h = node.height
		})
		// 备份
		this.subNodes = JSON.parse(JSON.stringify(nodes))
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
		      	self.removeSubLinks()
		      })

		this.el = el
	}
	renderLinks(el){
		let self = this
		let link = el.append("g")
		      .attr("fill", "none")
		      .attr("stroke-opacity", 0.3)
			    .selectAll("g")
			    .data(this.links)
			    .join("g")
			      .style("mix-blend-mode", "multiply")

	      link.append("path")
		      .attr("d", d3Sankey.sankeyLinkHorizontal())
		      .attr("stroke", "red")
		      .attr("stroke-width", d => Math.max(1, d.width))
		      .on("mouseover",function(d){
		      	let ids = d.ids
		      	self.getSubLinks(ids)
		      })
		      .on("mouseout",function(d){
		      	self.removeSubLinks()
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
	      .extent([[0, 0], [width - 5, height - 5]])
	    const  { nodes,links } = d3Subsankey({ nodes: this.subNodes , links: subLinks})

	    let graph = updateNodes(nodes,links,d3Subsankey)

	    this.subLinks = graph.links
	    this.renderSubLinks()
	}
	removeSubLinks(){
		if(!this.el) return
		this.el.select('.sub-links').remove()
		this.el.select('.sub-nodes').remove()
	}
	renderSubLinks(){
 		let el = this.el
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
}