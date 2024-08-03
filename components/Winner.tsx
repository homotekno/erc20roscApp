'use client';

import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react"
import { roscContract } from "../utils/contract";
import { prepareContractCall, toEther } from "thirdweb";

export const Winner = () => {
    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";

    const { data: currentRound } = useReadContract({
        contract: roscContract,
        method: "currentRound",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: admin } = useReadContract({
        contract: roscContract,
        method: "admin",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: winnerforRound } = useReadContract({
        contract: roscContract,
        method: "winnerforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: highestBidforRound } = useReadContract({
        contract: roscContract,
        method: "highestBidforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: dividendAmountforRound } = useReadContract({
        contract: roscContract,
        method: "dividendAmountforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: defaultersForRound } = useReadContract({
        contract: roscContract,
        method: "defaultersForRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: collateralDividendforRound } = useReadContract({
        contract: roscContract,
        method: "collateralDividendforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: winningPotforRound } = useReadContract({
        contract: roscContract,
        method: "winningPotforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: winningSlashforRound } = useReadContract({
        contract: roscContract,
        method: "winningSlashforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: potWithdrawnforRound } = useReadContract({
        contract: roscContract,
        method: "potWithdrawnforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: userName } = useReadContract({
        contract: roscContract,
        method: "userName",
        params: [winnerforRound ? winnerforRound : "0"],
        queryOptions: {
            enabled: !!winnerforRound,
        }
    });



    function truncate(value: string | number, decimalPlaces: number): number {
        const numericValue: number = Number(value);
        if (isNaN(numericValue)) {
            throw new Error('Invalid input: value must be a convertible to a number.');
        }
        const factor: number = Math.pow(10, decimalPlaces);
        return Math.trunc(numericValue * factor) / factor;
    }

    // const winnerforRoundStr = winnerforRound ? winnerforRound.toString() : "0";
    // const currentRoundStr = currentRound ? currentRound.toString() : "0";
    const highestBid = highestBidforRound ? highestBidforRound.toString() : "0";
    const dividendAmount = dividendAmountforRound ? toEther(dividendAmountforRound).toString() : "0";
    const collateralDividend = collateralDividendforRound ? toEther(collateralDividendforRound).toString() : "0";
    const winningPot = winningPotforRound ? toEther(winningPotforRound).toString() : "0";
    const winningSlash = winningSlashforRound ? toEther(winningSlashforRound).toString() : "0";


    if(admin != winnerforRound){
        return(
            <div>
                { walletAddress == winnerforRound ? (
                    <div>
                        <p style={{marginTop: "20px", color: "green", marginBottom: "20px"}}>You win mfer</p>
                        { potWithdrawnforRound ? (
                            <div>
                                <button style={{backgroundColor: "green", color: "white"}}
                                >Withdrawn ✅</button>
                            </div>
                        ) : (
                            <div>
                                <TransactionButton style={{backgroundColor: "blue", color: "white"}}
                                    transaction={ () => (
                                        prepareContractCall({
                                            contract : roscContract,
                                            method : "winnerWithdraw"
                                        })
                                    )}
                                    onTransactionConfirmed={() => alert("Success!!")}
                                >Withdraw</TransactionButton>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <p style={{marginTop: "10px", color: "blue"}}><b>winner : {userName}</b></p>
                        <p style={{color: "blue"}}><b>({winnerforRound})</b></p>
                    </div>
                )}
                <div style={{marginTop: "30px", color: "orange"}}>
                    <p>Winning Bid : {highestBid}%</p>
                    <p>Defaulters: {defaultersForRound?.toString()}</p>
                    <p>Winning Pot: ${truncate(winningPot, 2)} rUSD + {truncate(winningSlash, 3)} Ξ </p>
                    <p>Dividend: ${truncate(dividendAmount, 2)} rUSD + {truncate(collateralDividend, 5)} Ξ</p>
                    <p></p>
                </div>
            </div>
        )
    } else {
        return(
            <div>
                <p>Pay/Bid deadline has passed. Winner will be annoounced soon !!</p>
            </div>
        )
    }
}