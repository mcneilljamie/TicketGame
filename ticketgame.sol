const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-node.quicknode.com/your-endpoint-here'));

const contractAddress = '0x47b4C3860aA5baCD36D18100F19BBCDe9cbba40F';
const contractABI = [{...}];

const ticketContract = new web3.eth.Contract(contractABI, contractAddress);

// Connect Metamask wallet
const connectWallet = async () => {
  try {
    // Check if Metamask is installed
    if (typeof window.ethereum !== 'undefined') {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Get the current account address from Metamask
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      console.log('Connected to Metamask with address:', currentAccount);
    } else {
      console.log('Please install Metamask to use this dApp');
    }
  } catch (error) {
    console.log(error);
  }
};

// Buy tickets function
const buyTickets = async () => {
  try {
    // Check if user is connected to Metamask
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.log('Please connect to Metamask to buy tickets');
      return;
    }
    // Get the amount of tickets to buy from the input field
    const ticketsInput = document.getElementById('ticketsInput');
    const ticketsAmount = ticketsInput.value;
    // Call the buyTickets function on the contract
    await ticketContract.methods.buyTickets(ticketsAmount).send({ value: web3.utils.toWei(String(ticketPrice * ticketsAmount)), from: accounts[0] });
    console.log(`Bought ${ticketsAmount} tickets`);
  } catch (error) {
    console.log(error);
  }
};

// Listen for events emitted by the contract
ticketContract.events.GameEnded({}, (error, event) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log('Game ended');
  console.log('Winner:', event.returnValues.winner);
  console.log('Jackpot:', web3.utils.fromWei(event.returnValues.jackpot));
  console.log('End time:', new Date(event.returnValues.endTime * 1000));
});

ticketContract.events.TicketPurchased({}, (error, event) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log('Ticket purchased');
  console.log('Buyer:', event.returnValues.buyer);
  console.log('Amount:', web3.utils.fromWei(event.returnValues.amount));
});

// Display countdown timer
const countdownTimer = setInterval(async () => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const gameEndTime = await ticket
