//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract OleanjiToken is ERC20("OleanjiToken" , "Oleanji") {

   
   
    address owner;
    struct Transaction {
        uint256 transactId;
        address sender;
        address to;
        uint256 value;
        string time;
        string message;
        bytes32 hashText;
    }
    mapping(uint256 => Transaction ) private idTransaction;
    mapping (address => bool) public alreadyMinted;
    uint256 numofTransaction;



    constructor(uint totalSupply)  {
       
       uint amount = totalSupply * 10 ** 18;
  
        owner = msg.sender;
       _mint(owner, amount);
    }



    function CreateTransactionList (address _to ,string memory _message,uint _value , string memory _time , bytes32  _hash) public {
        address _sender = msg.sender;
        require(_sender != _to ,"You can't be the same person as receiving and collecting");
        require(_value > 0 , "You can send 0 tokens to another person");
        bytes memory b1 = bytes(_time);
        require(b1.length != 0 , "it is empty");
        require(_hash != "", "it is empty");
        numofTransaction +=1;
        idTransaction[numofTransaction] = Transaction (
            numofTransaction,
            _sender,
            _to,
            _value,
            _time,
            _message,
            _hash
        );
    }



    function FetchAllTransactions() public view returns (Transaction [] memory){
        Transaction [] memory transaction = new Transaction [] (numofTransaction);
        uint index = 0;
        for (uint i = 0; i < numofTransaction; i++) {
            uint currentPoint = idTransaction[i+1].transactId;
            Transaction storage currentTransact = idTransaction[currentPoint];
            transaction[index] = currentTransact;
            index +=1;
        }
        return transaction;

    }

        function checkIfMinted() public view returns(bool) {
            bool checked =  alreadyMinted[msg.sender];
            return checked;
        }
        function mintByAnyone() public  {
        require(alreadyMinted[msg.sender] == false, "You have already gotten free tokens");
        uint amountForAnyone = 100 *10 ** 18;
        _mint(msg.sender,amountForAnyone);
        alreadyMinted[msg.sender] = true;
    }
 
}