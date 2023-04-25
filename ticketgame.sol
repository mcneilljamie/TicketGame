// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Rest of your contract code


contract TicketGame is ReentrancyGuard {
    address private constant BNB_TOKEN = 0x3a0c5583d5AbADEcD7bb043709c4b1aED89267D6;
    IERC20 private bnb;

    uint256 public constant STARTING_PRICE = 0.00001 ether;
    uint256 public constant TICKETS_PER_DOUBLING = 10000000;
    uint256 public constant INCREMENT_TIME = 1;
    uint256 public constant INITIAL_COUNTDOWN = 24 hours;

    uint256 public ticketPrice = STARTING_PRICE;
    uint256 public totalTicketsSold;
    uint256 public currentRoundTickets;
    uint256 public countdown;
    uint256 public gameEndTime;
    address public lastBuyer;

    mapping(address => uint256) public ticketsOf;
    mapping(address => uint256) public claimedRewards;

    event TicketPurchased(address buyer, uint256 amount);
    event GameEnded(address winner, uint256 jackpot, uint256 endTime);

    constructor() {
        bnb = IERC20(BNB_TOKEN);
        countdown = INITIAL_COUNTDOWN;
    }

    function buyTickets(uint256 amount) external nonReentrant {
        require(gameEndTime == 0 || block.timestamp < gameEndTime, "Game already ended.");
        uint256 cost = ticketPrice * amount;
        bnb.transferFrom(msg.sender, address(this), cost);

        ticketsOf[msg.sender] += amount;
        totalTicketsSold += amount;
        currentRoundTickets += amount;

        if (lastBuyer == address(0) && currentRoundTickets >= 2) {
            gameEndTime = block.timestamp + countdown;
        } else if (gameEndTime > 0) {
            gameEndTime += INCREMENT_TIME * amount;
            countdown += INCREMENT_TIME * amount;
        }

        lastBuyer = msg.sender;

        if (totalTicketsSold / TICKETS_PER_DOUBLING > (totalTicketsSold - amount) / TICKETS_PER_DOUBLING) {
            ticketPrice *= 2;
        }

        emit TicketPurchased(msg.sender, amount);
    }

    function claimRewards() external nonReentrant {
        require(block.timestamp >= gameEndTime, "Game has not ended yet.");
        require(claimedRewards[msg.sender] == 0, "Rewards already claimed.");

        uint256 jackpot = bnb.balanceOf(address(this)) * 7 / 10;
        uint256 distribution = bnb.balanceOf(address(this)) * 15 / 100;

        if (msg.sender == lastBuyer) {
            bnb.transfer(msg.sender, jackpot);
            claimedRewards[msg.sender] = jackpot;
            emit GameEnded(msg.sender, jackpot, gameEndTime);
        } else {
            uint256 userReward = distribution * ticketsOf[msg.sender] / totalTicketsSold;
            bnb.transfer(msg.sender, userReward);
            claimedRewards[msg.sender] = userReward;
        }
    }

    function claimDevFee() external nonReentrant {
        require(msg.sender == BNB_TOKEN, "Only the dev wallet can claim this fee.");
        require(block.timestamp >= gameEndTime, "Game has not ended yet.");

        uint256 devFee = bnb.balanceOf(address(this)) * 15 / 100;
        bnb.transfer(msg.sender, devFee);
    }
}
