// copy from https://cdn.ethers.io/lib/ethers-5.1.esm.min.js
import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constants.js";
// get the element
const connectBtn = document.getElementById("connectBtn");
const getBalanceBtn = document.getElementById("getBalance");
const balanceLabel = document.getElementById("balanceLabel");
const sendBtn = document.getElementById("sendBtn");
const sendIpt = document.getElementById("sendIpt");

connectBtn.onclick = connect;
sendBtn.onclick = send;
getBalanceBtn.onclick = getBalance;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      console.log("There is a metamask connected!");
    } catch (error) {
      console.error(error);
    }

    document.getElementById("connectBtn").innerHTML = "已链接Metamask";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    document.getElementById("connectBtn").innerHTML =
      "请安装浏览器插件 Metamask";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    balanceLabel.innerHTML = ethers.utils.formatEther(balance);
  }
}

async function send() {
  const ammount = sendIpt.value;
  console.log(`send with ${ammount}`);

  if (typeof window.ethereum !== "undefined") {
    // provider is Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // signer is account of Metamask
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txRes = await contract.fund({
        value: ethers.utils.parseEther(ammount),
      });
      await listenForTxMine(txRes, provider);
      console.log("Done!");
    } catch (error) {
      console.error(error);
    }
  }
}

// listen tx to finish
function listenForTxMine(txRes, provider) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Mining ${txRes.hash}...`);
      provider.once(txRes.hash, (txReceipt) => {
        console.log(`Complete with ${txReceipt.confirmations} confirmations`);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
