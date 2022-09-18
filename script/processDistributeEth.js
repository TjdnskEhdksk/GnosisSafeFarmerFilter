import processedDistributeEth from "../static/distributeEth_15503366.json" assert { type: "json" };
import distributeEthJson from "../static/distributeEth.json" assert { type: "json" };
import multisenderAbi from "../static/abis/multisender.json" assert { type: "json" };
import fs from "fs";
import readline from "readline";
import csv from "csvtojson";
import {
  ethers
} from "ethers";
import 'dotenv/config';
import 'log-timestamp';

function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

function writeToJson(_data, fileName) {
  try {
    const data = JSON.stringify(_data, null, 4);
    fs.writeFileSync(fileName, data);
    console.log(`${fileName} saved`);
  } catch (e) {
    console.error(e);
  }
}

function appendToFile(fileName, newLine) {
  fs.appendFileSync(fileName, newLine);
  // fs.appendFile(fileName, newLine, function (err) {
  //   if (err) throw err;
  // });
}

const arrayChunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size))
  .fill()
  .map((_, index) => index * chunk_size)
  .map(begin => array.slice(begin, begin + chunk_size));

async function getTransactionCount(provider, address, blockNumber) {
  return await provider.getTransactionCount(address, blockNumber);
}

async function getBalance(provider, address, blockNumber) {
  const balance = await provider.getBalance(address, blockNumber);
  return balance.toString();
}

(async function main() {

  /**
   * initialize providers
   * parallelization
   */
  // const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_ALCHEMY_1);
  const providers = [
    process.env.ETH_ALCHEMY_1, 
    process.env.ETH_ALCHEMY_2, 
    process.env.ETH_ALCHEMY_5
  ].map(rpc => new ethers.providers.JsonRpcProvider(rpc));



  /**
   * process raw dune data
   */
  // const multisenderInterface = new ethers.utils.Interface(multisenderAbi);
  // const processedData = [];
  // const rawData = distributeEthJson.data.get_result_by_result_id;
  // console.log(rawData.length);
  // const chunks = arrayChunks(rawData, 20);
  // for (const chunk of chunks) {
  //   await Promise.all(chunk.map(async (entry) => {
  //     const data = entry.data;
  //     const tx_hash = data.tx_hash.replace('\\', '0');
  //     const contract_address = data.contract_address.replace('\\', '0');
  //     const block_time = data.block_time;
  //     const block_number = data.block_number.toString();
  //     const success = data.success;
  //     let recipients = data.recipients.map(r => r.replace('\\', '0'));
  //     let sender;
  //     try {
  //       const txRawData = await provider.getTransaction(tx_hash);
  //       sender = txRawData?.from;
  //       if (contract_address.toLowerCase() === '0xA5025FABA6E70B84F74e9b1113e5F7F4E7f4859f'.toLowerCase()) {
  //         recipients = [];
  //         const methodId = txRawData?.data.slice(0, 10).toLowerCase();
  //         const decodedInput = multisenderInterface.decodeFunctionData(methodId, txRawData?.data);
  //         if (methodId === '0x56e89613'.toLowerCase()) {
  //           const _recipients = decodedInput?._recipients;
  //           if (_recipients) {
  //             for (const _r of _recipients) {
  //               recipients.push(_r.recipient);
  //             }
  //           }
  //         } else if (methodId === '0xab883d28') {
  //           const _recipients = decodedInput?._contributors;
  //           if (_recipients) {
  //             for (const _r of _recipients) {
  //               recipients.push(_r);
  //             }
  //           }
  //         } else {
  //           throw `unknown methodId: ${tx_hash}`;
  //         }
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     const tmp = {
  //       tx_hash,
  //       sender,
  //       contract_address,
  //       recipients,
  //       success,
  //       block_time,
  //       block_number
  //     };
  //     processedData.push(tmp);
  //     console.log(`tx_hash: ${tx_hash} done`);
  //   }));
  //   await sleep(0.2);
  // }
  // writeToJson(processedData, './static/processedDistributeEth.json');



  /**
   * process etherscan data
   */
  // const parsed = new Set();
  // for (const entry of processedDistributeEth) {
  //   parsed.add(entry.tx_hash.toLowerCase());
  // }
  // const processedData = [];
  // const multisenderInterface = new ethers.utils.Interface(multisenderAbi);
  // const etherscanMultisender = await csv().fromFile('./static/etherscanMultisender.csv');
  // for (const tx of etherscanMultisender) {
  //   if (tx.Method === 'Multisend Ether') {
  //     const tx_hash = tx.Txhash;
  //     if (parsed.has(tx_hash.toLowerCase())) {
  //       continue;
  //     }
  //     const block_number = tx.Blockno;
  //     const block_time = tx.UnixTimestamp;
  //     const success = tx.ErrCode === '' ? true : false;
  //     let sender;
  //     let recipients = [];
  //     try {
  //       const txRawData = await provider.getTransaction(tx_hash);
  //       sender = txRawData?.from;
  //       const methodId = txRawData?.data.slice(0, 10).toLowerCase();
  //       const decodedInput = multisenderInterface.decodeFunctionData(methodId, txRawData?.data);
  //       if (methodId === '0x56e89613'.toLowerCase()) {
  //         const _recipients = decodedInput?._recipients;
  //         if (_recipients) {
  //           for (const _r of _recipients) {
  //             recipients.push(_r.recipient);
  //           }
  //         }
  //       } else if (methodId === '0xab883d28') {
  //         const _recipients = decodedInput?._contributors;
  //         if (_recipients) {
  //           for (const _r of _recipients) {
  //             recipients.push(_r);
  //           }
  //         }
  //       } else {
  //         throw `unknown methodId: ${tx_hash}`;
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     const tmp = {
  //       tx_hash,
  //       sender,
  //       contract_address: '0xa5025faba6e70b84f74e9b1113e5f7f4e7f4859f',
  //       recipients,
  //       success,
  //       block_time,
  //       block_number
  //     };
  //     processedData.push(tmp);
  //     console.log(`tx_hash: ${tx_hash} done`);
  //   }
  // }
  // console.log(processedDistributeEth.length);
  // processedDistributeEth.push(...processedData);
  // console.log(processedDistributeEth.length);
  // writeToJson(processedDistributeEth, './static/processedDistributeEth_15503366.json');


  
  /**
   * get involved address info
   */
  // const involvedAddrInfo = {};
  // for (const entry of processedDistributeEth) {
  //   const sender = entry.sender.toLowerCase();
  //   const recipients = [];
  //   for (const addr of entry.recipients) {
  //     recipients.push(addr.toLowerCase());
  //   }
  //   const involvedAddrs = [sender, ...recipients];
  //   const block_number = Number(entry.block_number);
  //   const tx_hash = entry.tx_hash;
  //   for (const addr of involvedAddrs) {
  //     if (!involvedAddrInfo[addr]) {
  //       involvedAddrInfo[addr] = { block_number, tx_hash };
  //     }
  //     if (involvedAddrInfo[addr].block_number > block_number) {
  //       involvedAddrInfo[addr].block_number = block_number;
  //       involvedAddrInfo[addr].tx_hash = tx_hash;
  //     }
  //   }
  // }

  // const queriedAddrs = new Set();
  // try {
  //   const fileStream = fs.createReadStream('./static/distributeEth_involvedAddrInfo_15503366.txt');
  //   const rl = readline.createInterface({
  //     input: fileStream,
  //     crlfDelay: Infinity
  //   });
  //   for await (const line of rl) {
  //     const _json = JSON.parse(line.trim());
  //     queriedAddrs.add(_json.address);
  //   }
  // } catch (e) {
  //   console.log('No queried Addr');
  //   console.log(e);
  // }
  
  // const toQueryAddrs = [...Object.keys(involvedAddrInfo)].filter(x => !queriedAddrs.has(x));
  // console.log(`Done: ${queriedAddrs.size}/${Object.keys(involvedAddrInfo).length}`);
  // console.log(`To Query: ${toQueryAddrs.length}/${Object.keys(involvedAddrInfo).length}`);
  // if (queriedAddrs.size + toQueryAddrs.length !== Object.keys(involvedAddrInfo).length) {
  //   throw 'length not correct';
  // }

  // const chunks1 = arrayChunks(toQueryAddrs, Math.ceil(toQueryAddrs.length / providers.length));

  // await Promise.all(chunks1.map(async (chunk1, index) => {
    
  //   const provider = providers[index];
  //   const chunks2 = arrayChunks(chunk1, 12);

  //   for (const chunk2 of chunks2) {
  //     await Promise.all(chunk2.map(async (addr) => {
  //       try {
  //         involvedAddrInfo[addr].balance = await getBalance(provider, addr, involvedAddrInfo[addr].block_number - 1);
  //         involvedAddrInfo[addr].nonce = await getTransactionCount(provider, addr, involvedAddrInfo[addr].block_number - 1);
  //         appendToFile(
  //           './static/distributeEth_involvedAddrInfo_15503366.txt',
  //           JSON.stringify({
  //             address: addr,
  //             block_number: involvedAddrInfo[addr].block_number,
  //             tx_hash: involvedAddrInfo[addr].tx_hash,
  //             balance: involvedAddrInfo[addr].balance,
  //             nonce: involvedAddrInfo[addr].nonce
  //           }) + '\n'
  //         );
  //       } catch(e) {
  //         console.log(`address: ${addr} Error`);
  //         console.error(e);
  //         appendToFile(
  //           './static/distributeEth_involvedAddrInfo_15503366_error.txt',
  //           JSON.stringify({
  //             address: addr,
  //             block_number: involvedAddrInfo[addr].block_number,
  //             tx_hash: involvedAddrInfo[addr].tx_hash
  //           }) + '\n'
  //         );
  //       }
  //     }));
  //   }

  // }));


  
  /**
   * convert txt to json
   */
  // const allInvolvedAddrInfo = {};
  // try {
  //   const fileStream = fs.createReadStream('./static/distributeEth_involvedAddrInfo_15503366.txt');
  //   const rl = readline.createInterface({
  //     input: fileStream,
  //     crlfDelay: Infinity
  //   });
  //   for await (const line of rl) {
  //     const { address, block_number, tx_hash, balance, nonce } = JSON.parse(line.trim());
  //     allInvolvedAddrInfo[address] = {
  //       block_number, tx_hash, balance, nonce
  //     }
  //   }
  //   console.log(Object.keys(allInvolvedAddrInfo).length);
  // } catch (e) {
  //   console.log(e);
  // }
  // writeToJson(allInvolvedAddrInfo, './static/distributeEth_involvedAddrInfo_15503366.json');

})();