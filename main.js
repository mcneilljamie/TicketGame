const web3 = new Web3(window.ethereum);

const contractAddress = '0x47b4C3860aA5baCD36D18100F19BBCDe9cbba40F';
const contractABI = 
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
;

const ticketContract = new web3.eth.Contract(contractABI, contractAddress);

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log('Connected with account:', account);

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
  const ticketPrice = await ticketContract.methods.ticketPrice().call();
  document.getElementById('ticket-price').innerText = web3.utils.fromWei(ticketPrice, 'ether') + ' BNB';
}

async function getCountdown() {
  const remainingTime = await ticketContract.methods.countdown().call();
  const currentTime = Math.floor(Date.now() / 1000);
  const gameEndTime = await ticketContract.methods.gameEndTime().call();
  const timeLeft = gameEndTime - currentTime;

  if (timeLeft > 0) {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    document.getElementById('countdown').innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    document.getElementById('countdown').innerText = '00:00:00';
  }
}

async function getStats() {
  const totalTickets = await ticketContract.methods.totalTicketsSold().call();
  const prizePool = await ticketContract.methods.totalTicketsSold().call();
  const lastWinner = await ticketContract.methods.lastBuyer().call();

  document.getElementById('total-tickets').innerText = totalTickets;
  document.getElementById('prize-pool').innerText = web3.utils.fromWei(prizePool, 'ether') + ' BNB';
  document.getElementById('last-winner').innerText = lastWinner;
}

// Buy tickets function
const buyTickets = async () => {
  // Get the amount of tickets to buy from the input field
  const ticketsInput = document.getElementById('tickets-amount');
  const ticketsAmount = ticketsInput.value;

  try {
    // Get the current account address from MetaMask
    const accounts = await web3.eth.getAccounts();
    const currentAccount = accounts[0];

    // Calculate the cost of the tickets
    const ticketPrice = await ticketContract.methods.ticketPrice().call();
    const cost = web3.utils.toWei(String(ticketPrice * ticketsAmount), 'ether');

    // Call the buyTickets function on the contract
    await ticketContract.methods.buyTickets(ticketsAmount).send({ value: cost, from: currentAccount });
    console.log(`Bought ${ticketsAmount} tickets`);
  } catch (error) {
    console.log(error);
  }
};

// Claim rewards function
const claimRewards = async () => {
 
