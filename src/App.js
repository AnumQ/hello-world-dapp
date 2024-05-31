import { useState, useCallback, useEffect } from "react";
import "./App.css";
import { Web3 } from "web3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // ethereum is the object injected as property on the window object by Ethereum-enabled browser extensions like MetaMask.
    if (window.ethereum) {
      // initialize web3
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      setError(
        "Non-Ethereum browser detected. Install Metamask on browser and try again."
      );
    }
  }, []);

  // Get account balance using Web3.js
  const getBalance = useCallback(
    async (account) => {
      try {
        let balance = await web3.eth.getBalance(account); // returns balance in wei
        balance = web3.utils.fromWei(balance, "ether"); // convert to ether
        setBalance(balance);
      } catch (e) {
        setError("Error getting balance. See console output for details");
        console.error("Errong getting balance. Details: ", e);
      }
    },
    [web3]
  );

  const connectWallet = useCallback(async () => {
    // Modern dapp browsers
    if (web3) {
      // Requst account access
      try {
        const accounts = await web3.eth.requestAccounts();
        setAccounts(accounts);

        if (accounts.length > 0) {
          getBalance(accounts[0]);
        }
      } catch (e) {
        setError(
          "Error connecting to Metamask. See console output for details. "
        );
        console.error("Error connecting to Metamask ", e);
      }
    } else {
      setError("Web 3 is not initialized");
    }
  }, [web3, getBalance]);

  const disconnectWallet = useCallback(async () => {
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    setAccounts([]);
  }, []);

  const deploySmartContract = useCallback(async () => {
    // Replace with your compiled contract's ABI and bytecode
    const ABI = [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        inputs: [],
        name: "getGreeting",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "string", name: "_greeting", type: "string" }],
        name: "setGreeting",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const BYTECODE =
      "0x608060405234801561000f575f80fd5b506040518060400160405280600d81526020017f48656c6c6f2c20576f726c6421000000000000000000000000000000000000008152505f90816100539190610293565b50610362565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806100d457607f821691505b6020821081036100e7576100e6610090565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026101497fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261010e565b610153868361010e565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61019761019261018d8461016b565b610174565b61016b565b9050919050565b5f819050919050565b6101b08361017d565b6101c46101bc8261019e565b84845461011a565b825550505050565b5f90565b6101d86101cc565b6101e38184846101a7565b505050565b5b81811015610206576101fb5f826101d0565b6001810190506101e9565b5050565b601f82111561024b5761021c816100ed565b610225846100ff565b81016020851015610234578190505b610248610240856100ff565b8301826101e8565b50505b505050565b5f82821c905092915050565b5f61026b5f1984600802610250565b1980831691505092915050565b5f610283838361025c565b9150826002028217905092915050565b61029c82610059565b67ffffffffffffffff8111156102b5576102b4610063565b5b6102bf82546100bd565b6102ca82828561020a565b5f60209050601f8311600181146102fb575f84156102e9578287015190505b6102f38582610278565b86555061035a565b601f198416610309866100ed565b5f5b828110156103305784890151825560018201915060208501945060208101905061030b565b8683101561034d5784890151610349601f89168261025c565b8355505b6001600288020188555050505b505050505050565b61062f8061036f5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c8063a413686214610038578063fe50cc7214610054575b5f80fd5b610052600480360381019061004d9190610260565b610072565b005b61005c610084565b6040516100699190610307565b60405180910390f35b805f9081610080919061052a565b5050565b60605f805461009290610354565b80601f01602080910402602001604051908101604052809291908181526020018280546100be90610354565b80156101095780601f106100e057610100808354040283529160200191610109565b820191905f5260205f20905b8154815290600101906020018083116100ec57829003601f168201915b5050505050905090565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6101728261012c565b810181811067ffffffffffffffff821117156101915761019061013c565b5b80604052505050565b5f6101a3610113565b90506101af8282610169565b919050565b5f67ffffffffffffffff8211156101ce576101cd61013c565b5b6101d78261012c565b9050602081019050919050565b828183375f83830152505050565b5f6102046101ff846101b4565b61019a565b9050828152602081018484840111156102205761021f610128565b5b61022b8482856101e4565b509392505050565b5f82601f83011261024757610246610124565b5b81356102578482602086016101f2565b91505092915050565b5f602082840312156102755761027461011c565b5b5f82013567ffffffffffffffff81111561029257610291610120565b5b61029e84828501610233565b91505092915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f6102d9826102a7565b6102e381856102b1565b93506102f38185602086016102c1565b6102fc8161012c565b840191505092915050565b5f6020820190508181035f83015261031f81846102cf565b905092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061036b57607f821691505b60208210810361037e5761037d610327565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026103e07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826103a5565b6103ea86836103a5565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61042e61042961042484610402565b61040b565b610402565b9050919050565b5f819050919050565b61044783610414565b61045b61045382610435565b8484546103b1565b825550505050565b5f90565b61046f610463565b61047a81848461043e565b505050565b5b8181101561049d576104925f82610467565b600181019050610480565b5050565b601f8211156104e2576104b381610384565b6104bc84610396565b810160208510156104cb578190505b6104df6104d785610396565b83018261047f565b50505b505050565b5f82821c905092915050565b5f6105025f19846008026104e7565b1980831691505092915050565b5f61051a83836104f3565b9150826002028217905092915050565b610533826102a7565b67ffffffffffffffff81111561054c5761054b61013c565b5b6105568254610354565b6105618282856104a1565b5f60209050601f831160018114610592575f8415610580578287015190505b61058a858261050f565b8655506105f1565b601f1984166105a086610384565b5f5b828110156105c7578489015182556001820191506020850194506020810190506105a2565b868310156105e457848901516105e0601f8916826104f3565b8355505b6001600288020188555050505b50505050505056fea264697066735822122074f625bb06252c704d1d417e6ab70b24a88dbf4793c5f6b86c198977767d9d5664736f6c63430008190033"; // Paste the bytecode here
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a Web3 instance
    const web3 = new Web3(window.ethereum);

    // Get accounts from MetaMask
    const accounts = await web3.eth.getAccounts();
    console.log("Deploying from account:", accounts[0]);
    var myContract = new web3.eth.Contract(ABI);

    // Create the contract deployer
    const deployer = myContract.deploy({
      data: BYTECODE,
      arguments: ["Hello, world!"], // Constructor arguments
    });

    // Send the transaction to deploy the contract
    deployer
      .send({
        from: accounts[0],
        gas: 2000000, // Adjust gas limit as needed
      })
      .on("receipt", (receipt) => {
        console.log("Contract deployed at address:", receipt.contractAddress);
      })
      .on("error", (error) => {
        console.error("Error deploying contract:", error);
      });
  }, []);

  return (
    <div className="App">
      <p>{error && <span>{error}</span>}</p>
      {accounts.length > 0 && (
        <>
          <h2>Successfully connected to Metamask Wallet</h2>
          <div className="card">
            <h3>Account Details</h3>
            <h5>Address: {accounts[0]}</h5>
          </div>
          <div className="card">
            <h3>Balance (eth): {balance}</h3>
            <button
              className="button"
              onClick={() => {
                getBalance(accounts[0]);
              }}
            >
              Get balance
            </button>
          </div>
          <br />
          <button className="button" onClick={disconnectWallet}>
            Disconnect Your Metamask Wallet
          </button>
          <br />
          <button className="button-large" onClick={deploySmartContract}>
            Deploy smart contract
          </button>
        </>
      )}
      {accounts.length === 0 && (
        <button className="button-large" onClick={connectWallet}>
          Connect Your Metamask Wallet
        </button>
      )}
    </div>
  );
}

export default App;
