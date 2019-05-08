
/*
	 该文件 暂时测试对 Time 条件的过滤
*/

/*	
	进行深度优先遍历
	找到 isSelected:true 的节点
	将沿途的所有条件记录下来 
*/

// 测试数据
/*
let tree = {
 	path:[0],
 	children : [{
 		path:[0,0],
 		children:[{
 			path:[0,0,0],
 			children:[]
 		},{
 			path:[0,0,1],
 			children:[],
 		}]
 	},{
 		path:[0,1],
 		children:[],
 	},{
 		path:[0,2],
 		children:[{
 			path:[0,2,0],
 			children:[{
 				path:[0,2,0,0],
 				children:[],
 			}]
 		},{
 			path:[0,2,1],
 			children:[],
 			isSelected:true
 		}]
 	}]
}
*/


let conditions_queue = []

// 遍历时的 callback
function isSelected(node){ 
	if(node.isSelected){
		return false
	}
	else return true
}

// 深度优先遍历 
function depthFirstPreOrder(callback, node) {
	var i, childCount, keepGoing;
	
	keepGoing = callback.call(null, node);

	for (i = 0, childCount = node.childNum; i < childCount; i++) {
	  if (keepGoing === false) { //该节点为选中
		conditions_queue.unshift(node.condition) 
		// conditions_queue.unshift(node.path.join('*')) 
	    return false;
	  }
	  keepGoing = depthFirstPreOrder.call(null, callback, node.children[i]);
	}

	if (keepGoing === false) {  //该节点的子节点为选中状态
		conditions_queue.unshift(node.condition)
		// conditions_queue.unshift(node.path.join('*')) 
	}
	return keepGoing;
};


export  function findConditions(tree) {
 	conditions_queue = []
	depthFirstPreOrder(isSelected,tree)
	let obj = filterThroughConditions()
	return obj
}



function filterThroughConditions(){
	let final_condition = {}
	for(let i = 0;i < conditions_queue.length;i++){
		let condition = conditions_queue[i]
		for(let cond in condition){
             final_condition[cond] = condition[cond]  
         }
	}
	// 取叶子节点的所有条件
	return final_condition
}





