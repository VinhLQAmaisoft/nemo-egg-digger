// import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { NimoGifter } from './configs/NimoGifter';
import { start1Round } from './helpers/handleGift';
const AccountList = require('../data/accountList.json')
dotenv.config();

const logTime = () => {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = '<' + date + ' ' + time + '>';
  return dateTime
}


let nimoGifter: NimoGifter | null = null;

let mainJobList: any = []
const runSingleThread = async (index: number, username: string, password: string) => {
  let nimoGifter = new NimoGifter();
  await nimoGifter.init(username, password);
  start1Round(index, nimoGifter).then(currentJob => {
    mainJobList = mainJobList.concat(currentJob)
  });
  await nimoGifter.closeAllBrowers()


};


const main = async () => {
  const MAX_ACCOUNT = process.env.MAX_ACCOUNT ? process.env.MAX_ACCOUNT : 2
  let threadList = []
  // for (let i = 0; i < AccountList.length; i++) {
  const account = AccountList[0]
  // const account2 = AccountList[1]
  // const account3 = AccountList[2]
  while (true) {
    try {
      console.log(`${logTime()}vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  Bắt đầu khởi tạo  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv`)

      threadList.push(runSingleThread(1, account.username, account.password).catch((error) => {
        console.log(`${logTime()} Luồng 1 thất bại`, error.message)
      }));
      // threadList.push(runSingleThread(2, account2.username, account2.password).catch((error) => {
      //   console.log(`${logTime()} Luồng 2 thất bại`, error.message)
      // }));
      // threadList.push(runSingleThread(3, account3.username, account3.password).catch((error) => {
      //   console.log(`${logTime()} Luồng 3 thất bại`, error.message)
      // }));
      if (threadList.length > MAX_ACCOUNT) {
        await Promise.all(threadList)
        threadList = []
      }
      // await sleep(5 * 60 * 1000)
      // }
      await Promise.all(threadList)
      threadList = []
      console.log(`${logTime()} ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  Kết thúc -> Chuẩn bị khởi tạo ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`)

    } catch (error) {
      console.log(`${logTime()}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Vòng lặp thất bại !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
      console.log(error)
      console.log(`${logTime()}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
      await sleep(60000)
    }
  }
}
// const sleep = async (ms: number = 3000) => {
//   await new Promise(r => setTimeout(r, ms));
// }
main()

process.on('SIGINT', () => {
  console.log(`Process ${process.pid} has been interrupted`);
  nimoGifter?.closeAllBrowers().then(() => {
    process.exit(0)
  });

})
const sleep = async (ms: number = 3000) => {
  await new Promise(r => setTimeout(r, ms));
}

process.on('warning', e => console.warn(e.stack));
process.setMaxListeners(0);