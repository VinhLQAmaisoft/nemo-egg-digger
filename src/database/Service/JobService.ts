import ModelBaseChannel from "../Model/Model_BaseChannels";
// import ModelJob from "../Model/Model_Job";

export default {
    getAvailableJob: async () => {
        let now = Date.now();
        let availableJob = await ModelBaseChannel.find({ expried: { $gt: now } }).sort({ quantity: -1 })
        return availableJob
    }
    ,
    clearJobList: async (channel: string) => {
        console.log(channel);
        // await ModelBaseChannel.findOneAndDelete({ channel })
        //     .then(data => console.log("Dọn Bank Job " + channel + ": \n" + data))
    }
};