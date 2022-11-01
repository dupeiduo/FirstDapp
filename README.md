# FirstDapp

Quik look https://docs.ethers.io/v5/getting-started/

1. 新建 html，引入文件 `<script src="./index.js" type="moudel"></script>`

2. 链接 metamask `await ethereum.request({ method: "eth_requestAccounts" });`

3. 获取账户 `const accounts = await ethereum.request({ method: "eth_accounts" });`

4. 获取余额

```javascript
const provider = new ethers.providers.Web3Provider(window.ethereum);
const balance = await provider.getBalance(contractAddress);
const formatBalance = ethers.utils.formatEther(balance);
```

5. 初始化合约对象，要先导入部署合约的 `abi`、 `contractAddress`

```javascript
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner(); // 从钱包拿签名
const contract = new ethers.Contract(contractAddress, abi, signer);
```

6. 使用合约方法

```javascript
const txRes = await contract.fund({
  value: ethers.utils.parseEther(ammount),
});
```

7. 监听事件, 全监听`provider.on`、一次监听 `provider.once`

```javascript
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
```

8、与存款方式类似，提款代码

```javascript
async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      console.log("Withdrawing...");
      const txRes = await contract.withdraw();
      await listenForTxMine(txRes, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}
```
