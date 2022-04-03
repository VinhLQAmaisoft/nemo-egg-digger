// import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { NimoGifter } from './configs/NimoGifter';
// import JobService from './database/Service/JobService';
import { start1Round } from './helpers/handleGift';
const AccountList = require('../data/accountList.json')
const fs = require('fs')
dotenv.config();

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

const initProxy = () => {
  let rawData = fs.readFileSync('./proxy.txt', 'utf-8');
  let arrRawData = rawData.split("\r\n");
  let proxyList = [];
  for (let i = 0; i < arrRawData.length; i++) {
    let temp = arrRawData[i].split(":");
    let proxy = {
      host: temp[0],
      port: temp[1],
      username: temp[2],
      password: temp[3],
    }
    proxyList.push(proxy)
  }
  return proxyList;
}
let nimoGifter: NimoGifter | null = null;

const runSingleThread = async (index: number, username: string, password: string, proxy: any) => {
  let nimoGifter = new NimoGifter();
  try {
    console.log(`${logTime()} [Thread ${index}] Init !!!`)
    await nimoGifter.init(username, password, proxy)
    console.log(`${logTime()} [Thread ${index}] Start !!!`)
    await start1Round(index, nimoGifter, proxy)
    console.log(`${logTime()} [Thread ${index}] Done !!!`)
  }
  catch (err: any) {
    console.log(`Thread ${index} Sập:`, err.message)
  }
  await nimoGifter.closeAllBrowers()

};

const main = async () => {
  var arrProxy = initProxy()
  let maxAccount = process.env.MAX_ACCOUNT ? parseInt(process.env.MAX_ACCOUNT) : 1
  let threadList = []
  for await (const [index, account] of AccountList.entries()) {
    threadList.push(
      runSingleThread(index, account.username, account.password, arrProxy[index])
        .catch(err => console.log(`Thread ${index} crashed with error:`, err.message))
    )
    await sleep(5000)
    if (threadList.length >= maxAccount) {
      console.log(`${logTime()} Đã chạy full luồng ${threadList.length}/${maxAccount}`)
      await Promise.all(threadList).then(() => {
        console.log(`${logTime()} Hoàn thành tất cả các luồng !!!!!`)

        threadList = []
      })
    }
  }
  await Promise.all(threadList).then(() => {
    threadList = []
  })

}

main()

process.on('SIGINT', () => {
  console.log(`Process ${process.pid} has been interrupted`);
  nimoGifter?.closeAllBrowers().then(() => {
    process.exit(0)
  });

})

process.on('warning', e => console.warn(e.stack));
process.setMaxListeners(0);