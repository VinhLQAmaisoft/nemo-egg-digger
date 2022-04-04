import { NimoGifter } from "src/configs/NimoGifter";
import JobService from "../database/Service/JobService";
const start1Round = async (index: number, nimoGifter: NimoGifter, proxy: any) => {
  try {
    console.log(`${logTime()} Bắt đầu 1 vòng quét !!!!!`)
    let MAX_JOB = process.env.MAX_JOB ? process.env.MAX_JOB : 10
    const listLink: any = [];
    let currentJob: any = [];
    let ignoreList: any = [];
    while (true) {
      const availableJob = await JobService.getAvailableJob();
      availableJob.forEach(job => {
        if (!ignoreList.includes(job.channel)) {
          listLink.push(job.channel)
        }
      })
      console.log(`${logTime()}:Job Found: `, listLink.length)
      let thread = 0;
      for (let i = 0; i < listLink.length; i++) {
        const link = listLink[i];
        if (thread >= MAX_JOB || ignoreList.length >= MAX_JOB) {
          console.log(`${logTime()} Đạt số job tối đa/account  ${thread}/${MAX_JOB}`)
        }
        while (thread >= MAX_JOB || ignoreList.length >= MAX_JOB) {
          console.log(`${logTime()} Đợi hoàn thành job!!  ${thread}/${MAX_JOB}`)
          await sleep(5000)
        }
        thread++;
        ignoreList.push(link)
        nimoGifter.takeGift(index, thread, proxy, link)
          .then(() => {
            console.log(`[Luồng ${index} - Tab ${thread}] Hoàn thành: `)
            --thread;
            ignoreList.splice(ignoreList.indexOf(link), 1)
          })
          .catch(err => {
            console.log(`[Luồng ${index} - Tab ${thread}] thất bại: `, err.message)
            --thread;
            ignoreList.splice(ignoreList.indexOf(link), 1)
          })

        await sleep(5000)

      }
    }
    console.log(`${logTime()} Hoàn thiện nốt các job ${currentJob.length}/${MAX_JOB}`)
    await Promise.all(currentJob)
    console.log(`${logTime()} Done 1 vòng`)

  } catch (e) {
    console.log("Start Round Thất Bại, ", e);
    return []
  }
};

const logTime = () => {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = '<' + date + ' ' + time + '>';
  return dateTime
}

const sleep = async (ms: number = 3000) => {
  await new Promise(r => setTimeout(r, ms));
}

export { start1Round }
