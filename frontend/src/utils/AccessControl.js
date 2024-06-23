export async function grantReadAccess(contract, patientAddress, providerAddress){
    try{
        const tx = await contract.grantReadAccess(patientAddress, providerAddress);
        await tx.wait();
        console.log("Access granted")
    }
    catch(error){
        console.log("Error Granting Access", error)
    }
}