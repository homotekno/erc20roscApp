'use client';

import React from 'react';
import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { erc20FiatContract, roscContract } from "../utils/contract";
import { prepareContractCall, toEther } from "thirdweb";
import { Pay } from "./Pay";
import { Bid } from "./Bid";
import Ledger from "./Ledger";
import { Winner } from "./Winner";

export const PayBid: React.FC = () => {
    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";

    const { data: userCollateral } = useReadContract({
        contract: roscContract,
        method: "userCollateral",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account
        }
    });

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
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: slots } = useReadContract({
        contract: roscContract,
        method: "slots",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: isUser } = useReadContract({
        contract: roscContract,
        method: "isUser",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: instalmentAmount } = useReadContract({
        contract: roscContract,
        method: "instalmentAmount",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: feePercent } = useReadContract({
        contract: roscContract,
        method: "feePercent",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: payBidWindow } = useReadContract({
        contract: roscContract,
        method: "payBidWindow",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: totalPotforRound } = useReadContract({
        contract: roscContract,
        method: "totalPotforRound",
        params: [currentRound ?? BigInt(0)], // Default to BigInt(0) if undefined
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: dividendAmountforRound } = useReadContract({
        contract: roscContract,
        method: "dividendAmountforRound",
        params: [currentRound ?? BigInt(0)], // Default to BigInt(0) if undefined
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: highestBidforRound } = useReadContract({
        contract: roscContract,
        method: "highestBidforRound",
        params: [currentRound ?? BigInt(0)], // Default to BigInt(0) if undefined
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: userBidforRound } = useReadContract({
        contract: roscContract,
        method: "userBidforRound",
        params: [currentRound ?? BigInt(0), walletAddress],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: userDeposits } = useReadContract({
        contract: roscContract,
        method: "userDeposits",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account,
        }
    });

    const { data: userName } = useReadContract({
        contract: roscContract,
        method: "userName",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account,
        }
    });

    function truncate(value: string | number, decimalPlaces: number): number {
        const numericValue: number = Number(value);
        if (isNaN(numericValue)) {
            throw new Error('Invalid input: value must be convertible to a number.');
        }
        const factor: number = Math.pow(10, decimalPlaces);
        return Math.trunc(numericValue * factor) / factor;
    }

    if (isUser) {
        const currentRoundStr = currentRound?.toString() || "0";
        const slotsStr = slots?.toString() || "0";
        const instalmentAmountStr = instalmentAmount ? toEther(instalmentAmount).toString() : "0";
        const userDepositsStr = userDeposits ? toEther(userDeposits).toString() : "0";
        const totalPotforRoundStr = totalPotforRound ? toEther(totalPotforRound).toString() : "0";
        const highestBidforRoundStr = highestBidforRound ? highestBidforRound.toString() : "0";
        const userBidforRoundStr = userBidforRound ? userBidforRound.toString() : "0";
        const userCollateralStr = userCollateral ? toEther(userCollateral).toString() : "0";

        return (
            <div style={{ textAlign: "center", minWidth: "500px", marginTop: "10px" }}>
                <h2 style={{ marginTop: "20px", color: "red", marginBottom: "10px" }}>fund I</h2>
                <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10px" }}>
                    <p style={{ color: "green" }}>{userName}'s account :</p>
                    <p style={{ color: "grey" }}>🔒 Collateral: ${truncate(userCollateralStr, 4)} Ξ</p>
                    <p style={{ color: "grey" }}>💰 Deposits: ${truncate(userDepositsStr, 2)} rUSD</p>
                    <p style={{ color: "grey" }}>
                        ⚖️ : {userFiatBalance ? `${toEther(userFiatBalance).toString()} rUSD` : "Loading..."}
                    </p>
                </div>
                <h3 style={{ marginTop: "20px", color: "green" }}>
                    ROUND : {currentRoundStr} / {slots?.toString() || "0"}
                </h3>
                <p style={{ color: "red", marginTop: "10px" }}>Deadline: 4:20PM, 20 April 2024</p>
                <p style={{ color: "red", marginBottom: "20px" }}>Protocol fees: {feePercent?.toString()}%</p>
                {currentRoundStr === "0" ? (
                    <div>
                        <p>Waiting for all members to join. Round 1 will start soon!!</p>
                        <p style={{ marginBottom: "20px", color:"orange", marginTop: "20px" }}>
                            Please approve the chit contract for rUSD token in the meantime for ${instalmentAmountStr} rUSD !!
                        </p>
                    </div>
                ) : payBidWindow ? (
                    <div style={{ textAlign: "center", minWidth: "500px", marginTop: "10px" }}>                                                
                        <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10px", marginTop: "20px" }}>
                            <p style={{ color: "green" }}>Active Pot: ${totalPotforRoundStr} rUSD</p>
                            <p style={{ color: "red" }}>Highest Bid: {highestBidforRoundStr}%</p>
                        </div>
                        <p>=====================================</p>
                        <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10px", marginTop: "20px", marginBottom: "20px" }}>
                            <div>
                                <Pay />
                            </div>
                            <div>
                                <Bid />
                            </div>                            
                        </div>
                        <div>
                            <p style={{ color: "green", marginTop: "30px" }}><b>Your bid: {userBidforRoundStr}%</b></p>
                            <p style={{ color: "orange", marginBottom: "20px" }}>New bids must exceed the highest active bid !!</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p style={{ color: "green", marginTop: "30px", marginBottom: "20px" }}>
                            =====================================
                        </p>

                        <Winner /> 

                        <p style={{ color: "green", marginTop: "30px", marginBottom: "20px" }}>
                            =====================================
                        </p>
                    </div>
                )}
                
                <p style={{ color: "blue", marginTop: "50px"}}>=====================================</p>
                <p style={{ color: "green"}}>TRUTH TABLE</p>
                <p style={{ color: "blue", marginBottom: "30px" }}>=====================================</p>
                <Ledger numUsers={4} numRounds={4}/>  
                <p style={{ color: "blue", marginTop: "50px"}}>=====================================</p>
                <p style={{ color: "green"}}>UTILS</p>
                <p style={{ color: "blue", marginBottom: "30px" }}>=====================================</p>
                <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10px", marginTop: "20px", marginBottom: "20px" }}>
                    <TransactionButton
                        transaction={() => (
                            prepareContractCall({
                                contract: erc20FiatContract,
                                method: "approve",
                                params: [roscContract.address, BigInt((parseFloat(instalmentAmountStr) * parseInt(slotsStr)) * 10**18)]
                            })
                        )}
                        onTransactionConfirmed={() => alert("Success!!")}
                    >approve rUSD</TransactionButton>
                    <TransactionButton
                        transaction={() => (
                            prepareContractCall({
                                contract: roscContract,
                                method: "withdrawUnlockedCollateral"
                            })
                        )}
                        onTransactionConfirmed={() => alert("Success!!")}
                    >w/d collateral</TransactionButton>
                </div>
            </div>
        )
    }
    return null;
}