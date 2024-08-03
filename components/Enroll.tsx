'use client';

import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { roscContract } from "../utils/contract";
import { prepareContractCall, toEther } from "thirdweb";

export const Enroll = () => {
    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";

    const { data: isAllowed } = useReadContract({
        contract: roscContract,
        method: "isAllowed",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account,
        },
    });

    const { data: collateral } = useReadContract({
        contract: roscContract,
        method: "collateral",
        queryOptions: {
            enabled: !!account,
        },
    });

    const { data: slots } = useReadContract({
        contract: roscContract,
        method: "slots",
        queryOptions: {
            enabled: !!account,
        },
    });

    const { data: feePercent } = useReadContract({
        contract: roscContract,
        method: "feePercent",
        queryOptions: {
            enabled: !!account,
        },
    });

    const { data: instalmentAmount } = useReadContract({
        contract: roscContract,
        method: "instalmentAmount",
        queryOptions: {
            enabled: !!account,
        },
    });

    const { data: slotsLeft } = useReadContract({
        contract: roscContract,
        method: "slotsLeft",
        queryOptions: {
            enabled: !!account,
        },
    });

    const { data: slash } = useReadContract({
        contract: roscContract,
        method: "slash",
        queryOptions: {
            enabled: !!account,
        },
    });

    if (isAllowed) {
        const slotsStr = slots !== undefined ? slots.toString() : "loading";
        const instalmentAmountStr = instalmentAmount !== undefined ? toEther(instalmentAmount).toString() : "loading";
        const potStr = (slots !== undefined && instalmentAmount !== undefined) ? 
                       (Number(slots) * Number(toEther(instalmentAmount))).toString() : 
                       "loading";

        return (
            <div style={{ textAlign: "center", minWidth: "500px" }}>
                <h2 style={{ marginTop: "20px", color: "red" }}>fund I</h2>
                <p style={{ marginTop: "10px", marginBottom: "20px", color: "green" }}>
                    slots left: {slotsLeft !== undefined ? slotsLeft.toString() : "loading"} / {slotsStr}
                </p>

                <TransactionButton
                    transaction={() => (
                        prepareContractCall({
                            contract: roscContract,
                            method: "enrollUser",
                            value: collateral !== undefined ? BigInt(collateral) : BigInt(0),
                        })
                    )}
                    onTransactionConfirmed={() => alert("success!")}
                >
                    ENROLL
                </TransactionButton>

                <p style={{ marginTop: "20px", color: "red" }}>
                    Deposit {collateral !== undefined ? toEther(collateral).toString() : "loading"} Ξ collateral to enroll.
                </p>

                <p style={{ marginTop: "20px" }}> -- -- --</p>
                <p style={{ marginTop: "20px" }}>
                    Number of members – {slotsStr}
                </p>
                <p>
                    Maximum weekly instalment – {instalmentAmountStr} $USDr
                </p>
                <p>
                    Pot auction per round – {potStr} $USDr ({slotsStr} members x {instalmentAmountStr} $USDr)
                </p>
                <p>Duration – {slotsStr} weeks! </p>
                <p style={{ marginTop: "20px", color: "orange" }}>Protocol fees - {feePercent !== undefined ? feePercent.toString() : "loading"}%</p>
                <p style={{ color: "orange" }}> Collateral slashed per default : {slash !== undefined ? toEther(slash).toString() : "loading"} Ξ</p>
                <p style={{ marginTop: "20px" }}> -- -- --</p>
            </div>
        );
    }
}
