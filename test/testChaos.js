const { ethers } = require("hardhat");

async function main() {
    // Deploy ChaosCoin
    const ChaosCoin = await ethers.getContractFactory("ChaosCoin");
    const chaos = await ChaosCoin.deploy();
    await chaos.waitForDeployment(); // ✅ Fix for ethers v6
    console.log(`ChaosCoin deployed to: ${await chaos.getAddress()}`); // ✅ Correct way to get contract address

    // Get 3 test accounts
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();

    // Correct way to parse Ether values
    const amount = ethers.parseEther("100"); // ✅ Fix for ethers v6

    // Send CHAOS tokens to users
    await chaos.transfer(user1.address, amount);
    await chaos.transfer(user2.address, amount);
    await chaos.transfer(user3.address, amount);
    await chaos.transfer(user4.address, amount);

    console.log("Users received CHAOS tokens");

    // Users opt in
    await chaos.connect(user1).optInToChaos();
    await chaos.connect(user2).optInToChaos();
    await chaos.connect(user3).optInToChaos();
    await chaos.connect(user4).optInToChaos();

    console.log("All users opted into Chaos");

    // Execute Chaos
    await chaos.executeChaosBatch();
    console.log("Chaos executed, balances shuffled!");

    // Print final balances
    console.log(`User1 Balance: ${ethers.formatEther(await chaos.balanceOf(user1.address))} CHAOS`);
    console.log(`User2 Balance: ${ethers.formatEther(await chaos.balanceOf(user2.address))} CHAOS`);
    console.log(`User3 Balance: ${ethers.formatEther(await chaos.balanceOf(user3.address))} CHAOS`);
    console.log(`User4 Balance: ${ethers.formatEther(await chaos.balanceOf(user4.address))} CHAOS`);

    await network.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]); 
    await network.provider.send("evm_mine"); 
    
    console.log("Time advanced by 1 year");

// Users opt in AGAIN
await chaos.connect(user1).optInToChaos();
await chaos.connect(user2).optInToChaos();
await chaos.connect(user3).optInToChaos();
await chaos.connect(user4).optInToChaos();
console.log("All users opted in again");

// Execute Chaos AGAIN
await chaos.executeChaosBatch();
console.log("Chaos executed again, balances shuffled!");

// Print final balances after second execution
console.log(`User1 Balance: ${ethers.formatEther(await chaos.balanceOf(user1.address))} CHAOS`);
console.log(`User2 Balance: ${ethers.formatEther(await chaos.balanceOf(user2.address))} CHAOS`);
console.log(`User3 Balance: ${ethers.formatEther(await chaos.balanceOf(user3.address))} CHAOS`);
console.log(`User4 Balance: ${ethers.formatEther(await chaos.balanceOf(user4.address))} CHAOS`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
