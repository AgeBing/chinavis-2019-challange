const sankey = require('../model/sankey');
const traj = require('../model/traj');

class SankeyController {
 async getTrack(ctx) {
        let { day, cluster, startMinutes, endMinutes,rids,limit} = ctx.request.body;
        let timeStart = startMinutes
        let timeEnd = endMinutes
        // console.log(JSON.parse(rids))
        rids = JSON.parse(rids)

        //rids:[ [1,2] , [3] , [4] , [5,6,7] , [8] ]  表示房间的组合和顺序
        // let rids=[ [0,1,2] , [3] , [4] , [5,6,7] , [8] ]
        let rids2group={}//rid与新的分组间的映射
        let group2rid={}//分组与rid的映射
        rids.forEach((rid,index)=>{//rid:[1,],index:0
            rid.forEach((r)=>{//r:1
                rids2group[r]=index
            })
        })
        let res = await sankey.getTrack(day, cluster, timeStart, timeEnd, limit);

        console.log(res.slice(0,10))

        let timeInit = timeStart,
            timeInterval = 30,
            map = {}
            //  uid => [ t1:rid , t2:rid ... tn:rid ]

        let intervalCounts =  Math.floor( (timeEnd - timeStart )/ timeInterval )

        // 计算一定时间间隔内某人  主要在哪个房间 
        // 输出一个稀疏矩阵
        res.forEach((r)=>{
            let { id,time,place,label } = r
            time = Math.floor(time / 60)   // 单位为分


            place = rids2group[place]     //对当前的place映射到指定组
            if(place >= 8) place = 8      //多于8的修正为8
            let arr = map[id]
            if(!map.hasOwnProperty(id)){
                map[id] = []
                arr = map[id]
            }

            let intervalIndex = Math.floor( (time - timeInit )/ timeInterval ),
                stayInterval = time - timeInterval * intervalIndex - timeInit 

            if( !arr[intervalIndex] || 
                ( arr[intervalIndex] && stayInterval > arr[intervalIndex].stay) ){  //取该时间段更久的 ？！

                arr[intervalIndex] = {
                    stay : stayInterval,   // 在该 时间区间内呆的时间
                    place
                }
            }
            //by xwx 需要在这里检查前面有没有空值，如果有，value设置为place，stay:timeInterval
            
            for(let i = intervalIndex;i >= 0&&(!arr[i]);i--)
                arr[i]={stay:timeInterval,place}
            
        })

        // 补全稀疏矩阵中的空值，向两边去寻找 ？！
        function findNearst(id,index){
            let arr = map[id]
            //by xwx 空值的补充需要去index的后面去找，找他后面的、离它最近的非空值
            for(let i = index+1;i < arr.length;i++)
                if(arr[i]) return arr[i].place
            for(let i = index;i >= 0;i--)
                if(arr[i]) return arr[i].place
            // for(let i = index;i >= 0;i--)
            //  if(arr[i]) return arr[i].place

            // for(let i = index+1;i < arr.length;i++)
            //  if(arr[i]) return arr[i].place
        }

        let ids = Object.keys(map)  


        let room = {}  //每个时间段内每个房间待的人数
        // rid => [ t1 : {count , uids} , t2:{ } , tn:{} ]
        // 时间间隔 到 房间 的矩阵
        // 也是稀疏矩阵
        // console.log('ids start===============')
        ids.forEach((_id)=>{
            let timeArr = map[_id]
            timeArr.forEach((record,index)=>{
                let place
                if(!record){
                    console.log('no place',id,index)
                    place  = findNearst(id,index)
                }else{
                    place = record.place
                }
                if(!room.hasOwnProperty(place)){
                    room[place] = []
                }
                if(  room[place][index] == null ){
                    room[place][index] = {
                        count : 0,//by xwx 不应该是1吗？？？？？
                        peoples : []
                    }
                }
                room[place][index]['count'] += 1
                room[place][index]['peoples'].push(_id)
            })
        })




        // 进一步转换 
        let nodes = [],
            links = [],
            linksMap = {},
            rooms = Object.keys(room),
            maxValue = 0

        for(let i = 0;i < rooms.length ;i++){
            for(let j = 0;j < intervalCounts;j++){
                let _rid = rooms[i]
                let value = room[_rid][j] == null ? 0 : room[_rid][j]['count']
                maxValue = maxValue > value ? maxValue : value
                nodes.push({
                    index: i * intervalCounts + j,
                    name : _rid +','+  (timeStart + timeInterval*j),
                    value :value,
                    depth : j ,
                    height : +_rid,
                    x_index: j,
                    y_index :+_rid,
                })
            }
        }   

        for(let j = 0;j < intervalCounts - 1;j++){
            for(let i = 0;i < rooms.length ;i++){
                let sourceRoomId =  rooms[i],
                    sourceTime = timeStart + timeInterval*j,
                    targetTime = timeStart + timeInterval*(j+1),
                    startPeoples = room[sourceRoomId][j] == null ? null : room[sourceRoomId][j]['peoples']

                if(startPeoples == null){
                        // console.log(sourceRoomId,j)
                }else{
                    startPeoples.forEach((_id)=>{
                        for(let k = 0;k < rooms.length ;k++){
                            let targetRoomId =  rooms[k],
                                endPeoples = room[targetRoomId][j+1] == null ? null : room[targetRoomId][j+1]['peoples']

                            if(endPeoples != null && endPeoples.indexOf(_id) != -1){
                                let sourceName = sourceRoomId +','+sourceTime,
                                    targetName = targetRoomId +','+targetTime
                                if(linksMap[sourceName] == undefined){
                                    linksMap[sourceName] = {}
                                }
                                if(linksMap[sourceName][targetName] == undefined){
                                    linksMap[sourceName][targetName] = {
                                        count : 0,
                                        peoples:[]
                                    }
                                }
                                linksMap[sourceName][targetName]['count'] += 1
                                linksMap[sourceName][targetName]['peoples'].push(_id)
                            }
                        }
                    })
                }   
            }
        }

        function getIndex(name){
            let rid = name.split(',')[0],
                time = name.split(',')[1],
                timeIndex = Math.floor(  (+time - timeStart) / timeInterval )
            return rooms.indexOf(rid) * intervalCounts + timeIndex
        }

        let linkCount = 0 
        Object.keys(linksMap).forEach((startName)=>{
            let targets = linksMap[startName]
            Object.keys(targets).forEach((targetName)=>{
                linkCount+=1
                links.push({
                    index: linkCount,
                    source : getIndex(startName),
                    target : getIndex(targetName),
                    value  : linksMap[startName][targetName]['count'],
                    ids : linksMap[startName][targetName]['peoples']
                })
            })

        })



        let roomsArrFromDB =  await sankey.getRooms(),
            rnames = [],
            tnames = []
        rnames = rooms.map((id)=>{
            let cur_rooms=rids[id]//当前id分组包含的rid数组
            let name =''//当前组的名称
            for(let i =0;i < roomsArrFromDB.length;i++){
                for(let j=0;j<cur_rooms.length;j++)
                {  if(roomsArrFromDB[i]['id'] == cur_rooms[j]){
                        name += ' '+roomsArrFromDB[i]['name']
                        if(name == null) name = '其他' 
                }}
                // if(roomsArrFromDB[i]['id'] == id){
                //         name =roomsArrFromDB[i]['name']
                //         if(name == null) name = '其他' 
                //     return name
                // }
        }
        if (name!='')
            return name
        else
            return '其他'
        })

        for(let i =0;i < intervalCounts;i++){
            tnames.push(
                timeStart + i*timeInterval
            )
        }
        ctx.body = { nodes,links,maxValue,rooms:rnames,times:tnames };
    }





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
          
          res = await traj.getTrajsByTimeIntervalAndRooms(t_s,t_e,day,allrids.join(','))
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