import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { contractABI } from "./contractABI";
import { fiatContractABI } from "./fiatContractABI";

const roscContractAddress = "0xc3f064b2f6023FAB1e25Cc5ec7705331370eDEaa";
const erc20FiatContractAddress = "0xA755f72E3106C7e59D269A2FB0Bacb5a5373fC6A";

export const roscContract = getContract({
    client : client,
    chain : chain,
    address : roscContractAddress,
    abi: contractABI
});

export const erc20FiatContract = getContract({
    client : client,
    chain : chain,
    address : erc20FiatContractAddress,
    abi : fiatContractABI
});