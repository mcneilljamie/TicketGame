const CONTRACT_ADDRESS = '0x47b4C3860aA5baCD36D18100F19BBCDe9cbba40F';
const CONTRACT_ABI = [
  [
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
  ]
];

let contract;

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log('Connected with account:', account);

      // Create a new Web3 instance and contract instance
      const web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(contractABI, contractAddress);

      // Call other functions after a successful connection
      getTicketPrice();
      getCountdown();
      getStats();
    } catch (error) {
      console.error('User rejected connection:', error);
    }
  } else {
    alert('Please install MetaMask or use a Web3-enabled browser.');
  }
}

async function getTicketPrice() {
  const ticketPrice = await contract.methods.ticketPrice().call();
  document.getElementById('ticket-price').innerText = web3.utils.fromWei(ticketPrice, 'ether') + ' BNB';
}

async function getCountdown() {
  const remainingTime = await contract.methods.remainingTime().call();
  // Convert the remainingTime to a readable format
  const seconds = parseInt(remainingTime % 60);
  const minutes = parseInt((remainingTime / 60) % 60);
  const hours = parseInt((remainingTime / 3600) % 24);
  const days = parseInt(remainingTime / 86400);

  const countdownString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  document.getElementById('countdown').innerText = countdownString;
}

async function getStats() {
  const totalTickets = await contract.methods.totalTickets().call();
  const prizePool = await contract.methods.prizePool().call();
  const lastWinner = await contract.methods.lastWinner().call();

  document.getElementById('total-tickets').innerText = totalTickets;
  document.getElementById('prize-pool').innerText = web3.utils.fromWei(prizePool, 'ether') + ' BNB';
  document.getElementById('last-winner').innerText = lastWinner;
}

// Connect to MetaMask when the page loads
window.addEventListener('DOMContentLoaded', connect);
