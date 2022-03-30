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

const runSingleThread = async (index: number, username: string, password: string) => {
  let nimoGifter = new NimoGifter();
  await nimoGifter.init(username, password);
  await start1Round(index, nimoGifter)
};


const main = async () => {
  const MAX_ACCOUNT = process.env.MAX_ACCOUNT ? process.env.MAX_ACCOUNT : 2
  let threadList = []
  for (let i = 0; i < AccountList.length; i++) {
    const account = AccountList[i];
    try {
      if (threadList.length >= MAX_ACCOUNT) {
        console.log(`${logTime()}: Số Tài Khoản Chạm Ngưỡng`)
        await Promise.all(threadList).then(() => {
          console.log(`${logTime()}: Hêt Tài Khoản Chạm Ngưỡng`)
          threadList = []
        }
        )
      }
      console.log(`${logTime()}__[${threadList.length + 1}/${MAX_ACCOUNT}]: Khởi tạo ${account.username}`)
      threadList.push(
        runSingleThread(i + 1, account.username, account.password)
          .then(
            () => {
              console.log(`${logTime()}__[${account.username}]: Hoàn Thành`)
            }
          )
          .catch(
            (error) => {
              console.log(`${logTime()} ${account.username} thất bại:`, error.message)
            }
          )
      );
    } catch (error) {
      await Promise.all(threadList)
      console.log(`${logTime()}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Vòng lặp thất bại !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
      console.log(error)
      console.log(`${logTime()}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
      await sleep(60000)
    }
  }
  await Promise.all(threadList)
}
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