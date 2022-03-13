import ModelAccount from "../Model/Model_Account";
// import ModelJob from "../Model/Model_Job";
const days = 1000 * 60 * 60 * 24;
const ServiceAccount = {
    find: async (condition: any) => {
        return ModelAccount.find(condition)
    },
    createNewAccount: async (data: any) => {
        let isExist = await ModelAccount.find({ username: data.username })
        if (isExist.length > 0) {
            console.log(`${data.username} đã tồn tại`)
        }
        else await ModelAccount.create(data)
    },
    updateCookie: async (data: any) => {
        let isExist = await ModelAccount.find({ username: data.username })
        if (isExist.length > 0) {
            let now = Date.now();
            if (isExist[0].updatedAt + days < now) {
                await ModelAccount.updateOne({ username: data.username }, { cookies: data.cookies, updatedAt: Date.now() })
                    .then(data => console.log(`Kết quả cập nhật: `, data))
            }
        } else
            console.log(`${data.username} Không tồn tại`)
    }

}

export default ServiceAccount