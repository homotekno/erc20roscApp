'use client';

import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react"
import { roscContract } from "../utils/contract";
import { Enroll } from "./Enroll";
import { PayBid } from "./PayBid";

export const ROSCApp = () => {
    //
    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";

    const { data : isAllowed } = useReadContract({
        contract : roscContract,
        method : "isAllowed",
        params : [walletAddress],
        queryOptions : {
            enabled: !!account,
        }
    });
    const { data : isUser } = useReadContract({
        contract : roscContract,
        method : "isUser",
        params : [walletAddress],
        queryOptions : {
            enabled: !!account,
        }
    });
    const { data : fundStatus } = useReadContract({
        contract : roscContract,
        method : "fundStatus",
        queryOptions : {
            enabled: !!account,
        }
    });

    //
    if (account && fundStatus){
        return(
            <div  style={{ textAlign: "center", minWidth: "500px" }}>
                <ConnectButton
                    client={client}
                    chain={chain}
                />
                <div>
                    {isAllowed && !isUser ? (
                        <Enroll />
                    ) : isAllowed && isUser ? (
                        <PayBid />
                    ) : (
                        <p style={{marginTop: "20px", color: "red"}}>you do not have WL/access, sorry !!</p>
                    )}
                </div>
            </div>
        );

    } else {
        return(
            <div>
                <p style={{marginTop: "20px", color: "red"}}>There are no active funds right now ! !!</p>
            </div>
        )
    }
}