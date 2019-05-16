const people = require('../model/people');

class PeopleController {
    async getUids(ctx) {
        const { clusterNum } = ctx.request.body;

        let users = await people.getUidByCNum(clusterNum-1)

        let  usersId = users.map((u)=>+u.id)

        ctx.body = usersId;
    }
}

module.exports = new PeopleController();