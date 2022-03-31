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

const readFile =  () => {
  var data = fs.readFileSync('./proxy.txt','utf-8');
  var arr = data.split("\n");
  let map = new Map();
  for(let i=0;i<arr.length;i++){
    var temp = arr[i].split("|");
    map.set(temp[0],temp[1])
  }
  return map;
}


let nimoGifter: NimoGifter | null = null;

const runSingleThread = async (index: number, username: string, password: string,proxy: string) => {
  let nimoGifter = new NimoGifter();
  await nimoGifter.init(username, password,proxy);
  await start1Round(index, nimoGifter)
};

// const repeat = async (index: number, username: string, password: string) => {
// runSingleThread(index)
// .then(
//   () => {
//     console.log(`${logTime()}__[${account.username}]: Hoàn Thành`)

//   }
// )
// .catch(
//   (error) => {
//     console.log(`${logTime()} ${account.username} thất bại:`, error.message)
//   }
// )
// }

const sleep = async (ms: number = 3000) => {
  await new Promise(r => setTimeout(r, ms));
}

const createJob = async (arrProxy: Map<string,string>) => {
  const MAX_ACCOUNT = process.env.MAX_ACCOUNT ? process.env.MAX_ACCOUNT : 2
  
    let threadList = []
    for (let i = 0; i < AccountList.length; i++) {
      const account = AccountList[i];
      var proxy = arrProxy.get(account.username)
      
      if(!proxy){
        console.log("!!!!!!!!!!!Username ",account.username + " chua set up proxy !!!!!!!!!!!!!!!!")
        continue;
      } 

      try {
        if (threadList.length >= MAX_ACCOUNT) {
          console.log(`${logTime()}: Số Tài Khoản Chạm Ngưỡng: `, MAX_ACCOUNT)
          await Promise.all(threadList).then(() => {
            console.log(`${logTime()}: Hêt Tài Khoản Chạm Ngưỡng`)
            threadList = []
          }
          )
        }
        console.log(`${logTime()}__[${threadList.length + 1}/${MAX_ACCOUNT}]: Khởi tạo ${account.username}`)
        threadList.push(
          runSingleThread(i + 1, account.username, account.password,proxy? proxy : "")
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

const main = async (index: number) => {
  var arrProxy = readFile()
  console.log("==================================Khoi tao proxy cho account==================================")
  console.log(arrProxy)

  createJob(arrProxy).then(
    () => {
      console.log("Start vong lap thứ ",index);
      index++;
      main(index);
    }
  );
}

main(1)

process.on('SIGINT', () => {
  console.log(`Process ${process.pid} has been interrupted`);
  nimoGifter?.closeAllBrowers().then(() => {
    process.exit(0)
  });

})

process.on('warning', e => console.warn(e.stack));
process.setMaxListeners(0);