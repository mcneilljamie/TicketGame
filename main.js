const CONTRACT_ADDRESS = '0x47b4C3860aA5baCD36D18100F19BBCDe9cbba40F';
const CONTRACT_ABI = [

  [
  	{
  		"inputs": [],
  		"stateMutability": "nonpayable",
  		"type": "constructor"
  	},
  	{
  		"anonymous": false,
  		"inputs": [
  			{
  				"indexed": false,
  				"internalType": "address",
  				"name": "winner",
  				"type": "address"
  			},
  			{
  				"indexed": false,
  				"internalType": "uint256",
  				"name": "jackpot",
  				"type": "uint256"
  			},
  			{
  				"indexed": false,
  				"internalType": "uint256",
  				"name": "endTime",
  				"type": "uint256"
  			}
  		],
  		"name": "GameEnded",
  		"type": "event"
  	},
  	{
  		"anonymous": false,
  		"inputs": [
  			{
  				"indexed": false,
  				"internalType": "address",
  				"name": "buyer",
  				"type": "address"
  			},
  			{
  				"indexed": false,
  				"internalType": "uint256",
  				"name": "amount",
  				"type": "uint256"
  			}
  		],
  		"name": "TicketPurchased",
  		"type": "event"
  	},
  	{
  		"inputs": [],
  		"name": "INCREMENT_TIME",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "INITIAL_COUNTDOWN",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "STARTING_PRICE",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "TICKETS_PER_DOUBLING",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [
  			{
  				"internalType": "uint256",
  				"name": "amount",
  				"type": "uint256"
  			}
  		],
  		"name": "buyTickets",
  		"outputs": [],
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "claimDevFee",
  		"outputs": [],
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "claimRewards",
  		"outputs": [],
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"inputs": [
  			{
  				"internalType": "address",
  				"name": "",
  				"type": "address"
  			}
  		],
  		"name": "claimedRewards",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "countdown",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "currentRoundTickets",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "gameEndTime",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "lastBuyer",
  		"outputs": [
  			{
  				"internalType": "address",
  				"name": "",
  				"type": "address"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "ticketPrice",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [
  			{
  				"internalType": "address",
  				"name": "",
  				"type": "address"
  			}
  		],
  		"name": "ticketsOf",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"inputs": [],
  		"name": "totalTicketsSold",
  		"outputs": [
  			{
  				"internalType": "uint256",
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"stateMutability": "view",
  		"type": "function"
  	}
  ]


];

const web3 = new Web3(Web3.givenProvider);
const contractInstance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

document.getElementById('buyTickets').addEventListener('click', async () => {
  const amount = document.getElementById('ticketAmount').value;
  await buyTickets(amount);
});

document.getElementById('claimRewards').addEventListener('click', async () => {
  await claimRewards();
});

async function buyTickets(amount) {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];

  const ticketPrice = await contractInstance.methods.ticketPrice().call();
  const totalCost = BigInt(ticketPrice) * BigInt(amount);

  await contractInstance.methods.buyTickets(amount).send({ from: account, value: totalCost.toString() });
}

async function claimRewards() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];

  await contractInstance.methods.claimRewards().send({ from: account });
}

async function updateUI() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];

  const remainingTime = await contractInstance.methods.countdown().call();
  const ticketPrice = await contractInstance.methods.ticketPrice().call();
  const totalTicketsSold = await contractInstance.methods.totalTicketsSold().call();
  const myTickets = await contractInstance.methods.ticketsOf(account).call();

  document.getElementById('remainingTime').innerText = remainingTime;
  document.getElementById('ticketPrice').innerText = web3.utils.fromWei(ticketPrice, 'ether');
  document.getElementById('totalTicketsSold').innerText = totalTicketsSold;
  document.getElementById('myTickets').innerText = myTickets;
}

// Add a button to connect to Metamask
const connectButton = document.getElementById("connectButton");
connectButton.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected to Metamask");
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log('Metamask not detected');
  }
});


updateUI();
setInterval(updateUI, 5000);
