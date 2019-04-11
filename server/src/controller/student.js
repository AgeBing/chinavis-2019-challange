const student = require('../model/student');


class StudentController {
  async overview(ctx) {
    const { grade } = ctx.request.body;
    const stus = await student.getOverview(grade);
    let classes = new Map()

    stus.forEach((r)=>{
      let m = classes.get(r.cla)

      let i =  (r.sex == '男' ? 0 : 1)

      if(!m){
         let c = [0,0]
         c[i] += 1
         classes.set(r.cla , c )
      }else{

         m[i] += 1
         classes.set(r.cla , m ) 
      }
    })

    // console.log(classes)

    let classNames = Array.from(classes.keys())

    classNames =  classNames.sort()


    let res = []

    classNames.forEach( (name)=>{
      let counts = classes.get(name) 

      res.push({
          sex : '男',
          count: counts[0],
          cla :  name
      })
      res.push({
          sex : '女',
          count: counts[1],
          cla :  name
      })

    })

    // console.log(classNames)
    ctx.body = res ;
  }
  async profile(ctx) {
    let res = { str : 'get profile!' }
    ctx.body = res ;
  }

}

module.exports = new StudentController();