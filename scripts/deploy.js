const hre = require("hardhat");

async function main() {
    const ChaosCoin = await hre.ethers.getContractFactory("ChaosCoin");
    const chaos = await ChaosCoin.deploy();
    await chaos.waitForDeployment();

    console.log("ChaosCoin deployed to:", await chaos.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
