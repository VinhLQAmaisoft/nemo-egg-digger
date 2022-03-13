import { NimoGifter } from "src/configs/NimoGifter";
import JobService from "../database/Service/JobService";
const start1Round = async (nimoGifter: NimoGifter) => {
  try {
    console.log("Bắt đầu 1 vòng quét !!!!!")
    let MAX_JOB = process.env.MAX_JOB ? process.env.MAX_JOB : 10
    const listLink: any = [];
    let currentJob: any = []
    const availableJob = await JobService.getAvailableJob();
    availableJob.forEach(job => { listLink.push(job.channel) })
    console.log("Job Found: ", listLink.length)
    for await (const link of listLink) {
      currentJob.push(nimoGifter.takeGift(link).catch(console.log))
      await sleep(5000)
      if (currentJob.length > MAX_JOB) {
        console.log(`Đạt số job tối đa/account  ${currentJob.length}/${MAX_JOB}`)
        await Promise.all(currentJob)
        currentJob = []
      }
    }
    console.log(`Hoàn thiện nốt các job ${currentJob.length}/${MAX_JOB}`)
    await Promise.all(currentJob)
    console.log("Kết thúc một vòng, chuẩn bị vòng mới !!!!!")
  } catch (e) {
    console.log("Start Round Thất Bại, ", e);
  }

  // await browser.close();
};

const sleep = async (ms: number = 3000) => {
  await new Promise(r => setTimeout(r, ms));
}

export { start1Round }
