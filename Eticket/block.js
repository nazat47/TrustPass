var web3;
var address="0xC260057AE3A66E902569e4AF38346b1E9D77b27E";
async function Connect(){
    await window.web3.currentProvider.enable();
    web3=new Web3(window.web3.currentProvider);
}
if(typeof web3 !== "undefined"){
    web3=new Web3(window.web3.currentProvider);
}
else{
    web3=new Web3( new Web3.Provider.HttpProvider("HTTP://127.0.0.1:7545"));
}
var abi=[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "TicketID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "TicketCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "TicketID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "RefundReceiver",
				"type": "address"
			}
		],
		"name": "TicketRefunded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "TicketID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "DecryptionKey",
				"type": "bytes32"
			}
		],
		"name": "TicketSold",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "TicketID",
				"type": "uint256"
			}
		],
		"name": "Buy_Ticket",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_DepartureTime",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_ArrivalTime",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_Source",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_Destination",
				"type": "string"
			}
		],
		"name": "CreateTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "TicketID",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "DecryptionKey",
				"type": "bytes32"
			}
		],
		"name": "GetTicketDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "departer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "arrival",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "source",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "destination",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "TicketID",
				"type": "uint256"
			}
		],
		"name": "RefundTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tickets",
		"outputs": [
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "enum TrainTicketMarketplace.TicketStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "bytes",
				"name": "Encrypted_Details",
				"type": "bytes"
			},
			{
				"internalType": "string",
				"name": "Departure_Time",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "Arrival_Time",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "Source",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "Destination",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "key",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "ExpTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
var contract = new web3.eth.Contract(abi,address);

function createTicket(){
    var price=document.getElementById("price").value;
    var dtime=document.getElementById("dtime").value;
    var atime=document.getElementById("atime").value;
    var src=document.getElementById("src").value;
    var dst=document.getElementById("dst").value;
    web3.eth.getAccounts().then(function(account){
        return contract.methods.CreateTicket(price,dtime,atime,src,dst).send({from:account[0]}).on('receipt', function(receipt){
			console.log('Transaction receipt:', receipt);
		  });
    }).then(function(tmp){
        $("price").val("");
    }).catch(function(tmp){
        alert("error");
    })

}
function getDetails(){
    var id=document.getElementById("tid").value;
    var key=document.getElementById("dkey").value;
   
  contract.methods.GetTicketDetails(id,key).call().then(function(tmp){
        alert("key valid")
    }).catch(function(tmp){
        alert("invalid");
    })

}
function buyTicket(){
    var id=document.getElementById("btid").value;

  
    web3.eth.getAccounts().then(function(account){
        return contract.methods.Buy_Ticket(id).send({from:account[0]});
    }).then(function(tmp){
		var d1 = new Date();
       var d2 = new Date ( d1 );
       d2.setMinutes ( d1.getMinutes() + 1 );
       alert ( "your key will expire at :"+d2 );
        $("btid").val("");
    }).catch(function(tmp){
        alert("error");
    })

}
function refundTicket(){
    var id=document.getElementById("rtid").value;

  
    web3.eth.getAccounts().then(function(account){
        return contract.methods.RefundTicket(id).send({from:account[0]});
    }).then(function(tmp){
        $("rtid").val("");
    }).catch(function(tmp){
        alert("error");
    })

}