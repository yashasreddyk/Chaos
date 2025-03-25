// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChaosCoin is ERC20, Ownable {
    uint256 public immutable launchTime;
    uint256 public lastExecuted;
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;
    bool public chaosExecuted = false;
    uint256 public constant COOLDOWN_PERIOD = 365 days;
    uint256 public batchSize = 10;
    uint256 public lastProcessedIndex = 0;
    
    mapping(address => bool) public optedIn;
    address[] public chaosParticipants;

    constructor() ERC20("Chaos Coin", "CHAOS") Ownable(msg.sender) {
        _mint(msg.sender, 10_000_000 * 10**18);
        _mint(address(this), TOTAL_SUPPLY - (10_000_000 * 10**18));
        launchTime = block.timestamp;
    }

    function requestChaos() external {
        require(balanceOf(address(this)) >= 1 * 10**18, "No more free CHAOS");
        _transfer(address(this), msg.sender, 1 * 10**18);
    }

    function optInToChaos() external {
        require(!optedIn[msg.sender], "Already opted in");
        require(balanceOf(msg.sender) > 0, "Must hold CHAOS to opt-in");
        optedIn[msg.sender] = true;
        chaosParticipants.push(msg.sender);
    }

    function executeChaosBatch() external {
        require(block.timestamp >= lastExecuted + COOLDOWN_PERIOD, "Cooldown active");
        require(chaosParticipants.length > 1, "Not enough participants");
        
        uint256 endIndex = lastProcessedIndex + batchSize;
        if (endIndex > chaosParticipants.length) {
            endIndex = chaosParticipants.length;
        }
        
        for (uint256 i = lastProcessedIndex; i < endIndex; i++) {
            uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, chaosParticipants[i]))) % chaosParticipants.length;
            address recipient = chaosParticipants[randomIndex];
            uint256 amount = balanceOf(chaosParticipants[i]) / 2;
            _transfer(chaosParticipants[i], recipient, amount);
            
            // Reset opt-in status after chaos execution
            optedIn[chaosParticipants[i]] = false;
        }
        
        lastProcessedIndex = endIndex;
        if (lastProcessedIndex >= chaosParticipants.length) {
            lastProcessedIndex = 0;
            chaosExecuted = true;
            lastExecuted = block.timestamp;
        }

         // 🔥 Reward the caller for executing Chaos
        _mint(msg.sender, 10_000 * 10**18); // Reward with 10000 CHAOS
    }
}
