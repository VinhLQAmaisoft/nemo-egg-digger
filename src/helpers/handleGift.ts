import { NimoGifter } from "src/configs/NimoGifter";
import JobService from "../database/Service/JobService";
const start1Round = async (index: number, nimoGifter: NimoGifter) => {
  try {
    console.log(`${logTime()} Bắt đầu 1 vòng quét !!!!!`)
    let MAX_JOB = process.env.MAX_JOB ? process.env.MAX_JOB : 10
    const listLink: any = [];
    let currentJob: any = []
    const availableJob = await JobService.getAvailableJob();
    availableJob.forEach(job => { listLink.push(job.channel) })
    console.log(`${logTime()}Job Found: `, listLink.length)
    let thread = 1;
    for await (const link of listLink) {
      currentJob.push(nimoGifter.takeGift(index, thread, link).catch(console.log))
      thread++
      await sleep(5000)
      if (currentJob.length > MAX_JOB) {
        console.log(`${logTime()} Đạt số job tối đa/account  ${currentJob.length}/${MAX_JOB}`)
        await Promise.all(currentJob)
        currentJob = []
      }
    }
    console.log(`${logTime()} Hoàn thiện nốt các job ${currentJob.length}/${MAX_JOB}`)
    console.log(`${logTime()} Kết thúc một vòng, chuẩn bị vòng mới !!!!!`)
    return currentJob

  } catch (e) {
    console.log("Start Round Thất Bại, ", e);
    return []
  }
  // await browser.close();
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
