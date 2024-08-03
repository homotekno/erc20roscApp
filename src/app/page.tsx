import { ConnectEmbed } from "@/app/thirdweb"
import { client } from "./client";
import { chain } from "./chain";
import { ROSCApp } from "../../components/ROSCApp";


export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    }}>
      <h1 style={{ marginBottom: "10px", marginTop: "70px", color: "green", fontFamily: "monospace" }}>chit.finance</h1>
      <p style={{ marginBottom: "20px", color: "green", fontFamily: "monospace" }}>on-chain rotating savings and credit protocol</p>  
      <ConnectEmbed 
        client={client}
        chain={chain}
      />
      <ROSCApp />
    </div>
  );
}
