'use client';

import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { erc20FiatContract, roscContract } from "../utils/contract";
import { prepareContractCall, toEther } from "thirdweb";

export const Pay = () => {
    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";

    const { data: userFiatBalance } = useReadContract({
        contract: erc20FiatContract,
        method: "balanceOf",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: currentRound } = useReadContract({
        contract: roscContract,
        method: "currentRound",
    });

    const { data: dueAmount } = useReadContract({
        contract: roscContract,
        method: "dueAmountforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data : hasPaid } = useReadContract({
        contract : roscContract,
        method: "hasPaidRound",
        params : [currentRound ? currentRound : BigInt(0), walletAddress]
    });

    const dueAmountStr = dueAmount ? toEther(dueAmount).toString() : "0";

    if (!hasPaid) {
        return (
            <div>
                <h4 style={{ color: "green" }}>Payments</h4>
                <p style={{ marginBottom: "10px", marginTop: "20px" }}>
                    ⚖️ : {userFiatBalance ? `${toEther(userFiatBalance).toString()} rUSD` : "Loading..."}
                </p>
                <TransactionButton 
                    transaction={ () => (
                        prepareContractCall({
                            contract : roscContract,
                            method : "payROSCRound",
                        })
                    )}
                    onTransactionConfirmed={() => alert("Success!!")}
                >
                    Pay ${dueAmountStr}
                </TransactionButton>
            </div>
        );
    } else {
        return (
            <div>
                <h4 style={{ color: "green" }}>Payments</h4>
                <p style={{ marginBottom: "10px", marginTop: "20px" }}>
                    ⚖️ : {userFiatBalance ? `${toEther(userFiatBalance).toString()} rUSD` : "Loading..."}
                </p>
                <button style={{ backgroundColor: "green" }}>
                    Paid ${dueAmount ? toEther(dueAmount).toString() : "Loading..."} ✅
                </button>
            </div>
        )
    }

    return null;
};