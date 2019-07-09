const sankey = require('../model/sankey');
const traj = require('../model/traj');

class SankeyController {
 async getSankeyData(ctx) {
        let { day, cluster, startMinutes, endMinutes,rids,limit,ids } = ctx.request.body; 
        console.log(day, cluster, startMinutes, endMinutes,rids,limit,ids)
        // rids = JSON.parse(rids)

        /*
          Step.1  准备工作
        */

        let timeStart = +startMinutes, // 有可能传进来的是字符串 ，转成数字
            timeEnd = +endMinutes,
            allrids = [],nodes = []

        // room 
        for(let i = 0;i < rids.length;i++){
            for(let j = 0 ;j < rids[i].length;j++){
              allrids.push( rids[i][j] )
            }
        }  
        let roomMap = await sankey.getRooms(),
            rooms   = rids.map((_rids)=>{
                let name = ''
                _rids.forEach((rid)=>{
                    for(let i=0;i<roomMap.length;i++){
                      if(roomMap[i].id == rid){
                        name +=  roomMap[i].name +';'
                        break;
                      }
                    }
                })
                return name
            })

        // 时间 
        const timeIntervalCount = 15  //固定间隔
        let   timeIntervalArr = getTimeIntervals(timeStart,timeEnd,timeIntervalCount),
              timeInterval = timeIntervalArr[1] - timeIntervalArr[0],
              times = timeIntervalArr.map((time)=> time)

        // nodes
        for(let i = 0;i < timeIntervalArr.length;i++){
          for(let j = 0;j < rids.length;j++){
            nodes.push({
              index :  i * rids.length + j,
              depth :  i,
              height:  j,
              time  :  times[i]
            })
          }
        }

        /*
          Step.2  查表
        */
        const room2TimeMap = {}
        /*
        room2TimeMap = {
            rid1  :  [t1 ,t2 ,t3 ,t4 ,tn],
            rid2  :  [t1 ,t2 ,t3 ,t4 ,tn]
            rid3  :  [t1 ,t2 ,t3 ,t4 ,tn]
        }
         t_i  = { [id1,id2,id3....] }  表示在时刻 t_i 在房间 rid_j  的人

         room2TimeMap 可能是个稀疏矩阵，表示有些时刻有的房间没人
        */
        // 初始化
        for(let j = 0;j < allrids.length ;j++){
            let _rid = allrids[j]
            room2TimeMap[_rid]  = []
            for(let i = 0;i < timeIntervalArr.length;i++){
              room2TimeMap[_rid][i] = []
            }
        }
        // 获取每个时刻下每个人的位置
        for(let i = 0;i < timeIntervalArr.length;i++){
          let t_s = timeIntervalArr[i],
            t_e = t_s + 1,
            res
          
          res = await traj.getTrajsByTimeIntervalAndRooms(t_s,t_e,day,allrids.join(',') , ids.join(','))
          res = filterSameIDs(res)
          res.forEach((o)=>{
            let { id,rid } = o
            room2TimeMap[rid][i].push(id)
          })
        }
        // console.log(room2TimeMap)
        
        /*
          Step.3 重新组装
        */
        let links = [],linkCount = 0
        
        for(let i = 0;i < timeIntervalArr.length - 1;i++){
          for(let j = 0;j < rids.length;j++){   // SOURCE
              let sourceTimeIndex = i,
                  sourcePeopleIds = []            

              for(let k = 0; k < rids[j].length;k++){
                  let _rid = rids[j][k]
                  let currRidPeoplesInSource = room2TimeMap[_rid][sourceTimeIndex]
                  currRidPeoplesInSource.forEach((id)=>{
                    if(sourcePeopleIds.indexOf(id)==-1) sourcePeopleIds.push(id)
                  })
              }
              for(let h = 0;h < rids.length;h++){  // TARGET
                let targetPeopleIds = [],
                    targetTimeIndex = i + 1,
                    link = []
                for(let k = 0; k < rids[h].length;k++){
                    let _rid = rids[h][k]
                    let currRidPeoplesInTarget = room2TimeMap[_rid][targetTimeIndex]
                    currRidPeoplesInTarget.forEach((id)=>{
                      if(targetPeopleIds.indexOf(id)==-1) targetPeopleIds.push(id)
                    })
                }

                for(let p = 0;p < targetPeopleIds.length;p++){
                  let _id = targetPeopleIds[p]
                  if(sourcePeopleIds.indexOf(_id)!= -1) link.push(_id)
                }
                if(link.length!=0){
                   links.push({
                        source : sourceTimeIndex * rids.length + j,
                        target : targetTimeIndex * rids.length + h,
                        value  : link.length,
                        ids    : link,
                        index  : linkCount
                   })
                   linkCount++
                   // console.log(i,j,h,link.length)
                }
            }
          }
        }

        ctx.body = { res : 0 ,times,rooms,nodes,links};
    }

}



// start , end ,c 
function getTimeIntervals(s,e,c){
    let interval = Math.floor( (e - s) / c),
        intervalArr = []


    if(interval <= 1){
        for(let i = s;i <= e;i++){
          intervalArr.push(i)
        }
    }else{
      for(let i = 0;i <= c;i++){
          intervalArr.push(s + i * interval)
      }
    }
    return [].concat(intervalArr)
}


// 遇到两条一条id一样的取第一个
function filterSameIDs(arr){
  let newArr = []

  let formerID = ''
    for(let i =0;i <arr.length;i++){
      let { id ,rid }  = arr[i]
      if(id != formerID){
        newArr.push({  id , rid })
        formerID = id
      }
    }

  return [].concat(newArr)
}

module.exports = new SankeyController();