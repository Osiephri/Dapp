import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";

import { providers, Contract, ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { OleanjiToken,abi} from "../constant";
// import Oleanji from "../artifacts/contracts/OleanjiToken.sol/OleanjiToken.json"



export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading ,setLoading] = useState(false)
  const [message ,setMessage] = useState("")
  const[hash, setHash]= useState("")
  const[tranferAmount, setTransferAmount] = useState(0)
  const[serial, setSerial]= useState(1)
  const[address, setAddress] = useState("")
  const[allTransactions, setAllTransactions] = useState([])
  const [owner , setOwner] = useState("")
  const [fileUrl , setFileUrl] = useState(null)
  const [time , setTime] = useState("")



  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Ropsten network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    console.log(chainId)
    if (chainId !== 3 && chainId !==1337) {
      window.alert("Change the network to Ropsten");
      throw new Error("Change network to Ropsten");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      // this is done here to set the owner address and this would show transactions done before on loading of the page.

      const addresso = await signer.getAddress();
      setOwner(addresso);
      return signer;
    }
    return web3Provider;
  };
  

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
      await FetchAllTransactions();

    } catch (err) {
      console.error(err);
    }
  };


  const transferTokens = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const Token = new Contract(
        OleanjiToken,
        abi,
        signer
      );

      

      const IsValid = ethers.utils.isAddress(address)
      
      if(address =="" || !IsValid) {
        window.alert("The Address Section should have a valid address in it.");
      }
      if(tranferAmount == "" || tranferAmount>=80) {
        window.alert("Enter a valid amount in the Amount Section which is also less than 80");

      }
     
      

      const amountInWei = ethers.utils.parseEther(tranferAmount);
 
      console.log(owner);
      const tx1 = await Token.transfer(address, amountInWei);
 
        let _time =  new Date().toLocaleString();
      console.log(_time);
      let hashValue = tx1.hash;
      console.log(hashValue);
      console.log("time works");
      if (message == ""){
        message ="No Message was sent"
      }
    
      if (hash != hashValue){
        hash = hashValue;
      }
      if (time != _time){
        time = _time;
      }


      if(tx1) {
        console.log("time works");
        
        
        console.log(time);
        console.log(hash);
        console.log("the setting of all also works")
        const tx2 = await Token.CreateTransactionList(address, message ,tranferAmount,time,hash);
        console.log("time wjnorks");
        setLoading(true);
      // wait for the transaction to get mined
      await tx1.wait();
      
      await tx2.wait();
      await FetchAllTransactions();
      setLoading(false);
      } else {
        setLoading(false);
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const Mint = async () => {
    try {
      
      const signer = await getProviderOrSigner(true);
      const Token = new Contract(
      OleanjiToken,
      abi,
      signer
    );
    const checker = await Token.checkIfMinted()
    if(!checker){
      const mintNewOleanji = await Token.mintByAnyone();
      await mintNewOleanji.wait();
    }
    else{
      window.alert("You have already minted 100 Oleanji");
    }
   
    } catch (er) {
      console.log(er)
    }
    
  }

  const FetchAllTransactions = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const Token = new Contract(
        OleanjiToken,
        abi,
        signer
      );

      const data = await Token.FetchAllTransactions()
      const transactions = await Promise.all(data.map(async i => {
     
      
       let transactionsList = {
        Index: i.transactId.toNumber(),
        Sender : i.sender,
        Receiver : i.to,
        Value: i.value.toNumber(),
        Time : i.time,
        Message :i.message,
        Hash:i.hashText
       }
       return transactionsList
     }))
    
     setAllTransactions(transactions);
     console.log(transactions);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "ropsten",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  const renderButton = () => {
    if(walletConnected && allTransactions.length == 0 ) {
      return (
       

        <div style={{display:"flex", justifyContent:"space-around"}}>
        <div className={styles.card}>
        <input
        style={{padding:"10px", marginTop :"10px"}}
          type= "text"
          placeholder=" Receiver's Address"
          onChange={e => setAddress(e.target.value) 
          }
         />
         <br />
         <input
           style={{padding:"10px", marginTop :"10px"}}
          placeholder="Amount"
          onChange={e => setTransferAmount(e.target.value) }
          />

          <textarea
          style={{padding:"10px", marginTop :"20px"}}
          placeholder="Message should not be more than 20 characters."
          rows="4" cols="25"
          onChange={e => setMessage(e.target.value) }
          />

          <div>
          <button 
         className={styles.button}
         style={{margin:"50px 0 0 0", padding:"10px 50px" , border:"2px solid black"}}
          onClick={transferTokens}>
            <p>
              SEND
            </p>
          </button>
          </div>
          </div>
          <div className={styles.card}>
            <p>
              You can only Mint Tokens Once.
            </p>
            <div>
              <button onClick={Mint} className={styles.button} style={{margin:"50px", padding:"10px" , border:"2px solid black"}}>
                Mint Oleanji
              </button>
            </div>
          </div>
        </div>
      )
    }
    else if(walletConnected && allTransactions.length > 0) {
      return (
        <div>

        <div style={{display:"flex", justifyContent:"space-around"}}>

        
        <div className={styles.card}>
        <input
        style={{padding:"10px", marginTop :"10px"}}
          type= "text"
          placeholder=" Receiver's Address"
          onChange={e => setAddress(e.target.value) 
          }
         />
         <br />
         <input
           style={{padding:"10px", marginTop :"10px"}}
          placeholder="Amount"
          onChange={e => setTransferAmount(e.target.value) }
          />

          <textarea
          style={{padding:"10px", marginTop :"20px"}}
          placeholder="Message should not be more than 20 characters."
          rows="4" cols="25"
          onChange={e => setMessage(e.target.value) }
          />

          <div>
          <button 
            className={styles.button}
            style={{margin:"50px 0 0 0", padding:"10px 50px" , border:"2px solid black"}}
          onClick={transferTokens}>
            <p>
              SEND
            </p>
          </button>
          </div>

          </div>
          <div className={styles.card}>
            <p>
              You can only Mint Tokens Once.
            </p>
            <div>
              <button onClick={Mint} className={styles.button} style={{margin:"50px", padding:"10px" , border:"2px solid black"}}>
                Mint Oleanji
              </button>
            </div>
          </div>
          </div>
         <br/>
         <br/>
         <br/>


            <h2 className={styles.title} style={{marginBottom:"20px"}}>
             Transactions Record
           </h2>
         <div> 
           
            <table className={styles.table}>
              <tbody>

             
              <tr className={styles.tr}>
              <th className={styles.th}>
                  No
                </th>
                <th className={styles.th}>
                  ID
                </th>
                <th className={styles.th}>
                  Senders Address
                </th>
                <th className={styles.th}>
                  Receivers Address
                </th>
                <th className={styles.th}>
                  Amount 
                </th>
                <th className={styles.th}>
                  Time
                </th>
                <th className={styles.th}>
                  Message 
                </th>
                <th className={styles.th}>
                  EtherScan
                </th>
              </tr>

              {

                allTransactions.map((transaction , i ) => {
               
                  return (
                    (transaction.Sender == owner || transaction.Receiver == owner) && 

                     <tr key={i} className={styles.tr}>
                       <td className={styles.td}>
                         {serial++}
                       </td>
                       <td className={styles.td}>
                         {transaction.Index}
                       </td>
                       <td className={styles.td}>
                       {transaction.Sender == owner ? (
                           <p>You</p>
                         ) : (
                          <p> {transaction.Sender}</p> 
                         )
                         }
                         
                       </td>
                       <td className={styles.td}>
                         
                         {transaction.Receiver == owner ? (
                           <p>You</p>
                         ) : (
                          <p> {transaction.Receiver}</p> 
                         )
                         }
                       </td>
                       <td className={styles.td}>
                         {transaction.Value}
                       </td>
                       <td className={styles.td}>
                         {transaction.Time}
                       </td>
                       <td className={styles.td}>
                         {transaction.Message}
                       </td>
                       <td className={styles.td}>
                        <button>
                          <a href={`https://ropsten.etherscan.io/tx/${transaction.Hash}`}  target="_blank" rel="noreferrer">
                            View in Explorer
                          </a>
                        </button>
                       </td>
                     </tr> 
                   )
                }
                
                    
                )
              }
               </tbody>
            </table>
         </div>
      </div>
    
      )
    }
    else if(loading) {
      <button>
        ....Loading.....
      </button>
    }
    else {
      return(
        <button onClick={connectWallet} className= {styles.button} style={{margin:"50px", padding:"10px" , border:"2px solid black"}}>
        Connect your wallet
      </button>
      )
    }
  }
  return (
    <div>
      <Head>
      <title>OleanjiDAO</title>
        <meta name="description" content="OleanjiDAOToken" />
        <link rel="icon" href="/favicon.ico" />
       
      </Head>
      <div className={styles.main}>
      <h1 className={styles.title}>You can transfer Oleanji Token in here</h1> <br/>
      
      <h2>
        Contract Address : {OleanjiToken}
      </h2>
      
      <div>
        {renderButton()}


      </div>
      </div>
    </div>
  );

}