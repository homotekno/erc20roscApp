'use client';

type TableProps = {
    numUsers: number;
    numRounds: number;
  };

const Ledger = ({ numUsers, numRounds }) => {
  const users = Array.from({ length: numUsers }, (_, i) => `User ${i + 1}`);
  const rounds = Array.from({ length: numRounds }, (_, i) => `Round ${i + 1}`);

  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10px" }}>
        <table border={1}>
        <thead>
            <tr>
            <th></th>
            {rounds.map((round, index) => (
                <th key={index}>{round}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {users.map((user, userIndex) => (
            <tr key={userIndex}>
                <td>{user}</td>
                {rounds.map((_, roundIndex) => (
                <td key={roundIndex}></td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
};

export default Ledger;



// 'use client';

// import { useActiveAccount, useReadContract } from "thirdweb/react"

// export const Ledger = () => {
//     const account = useActiveAccount();
    
//     const { data : Users } = useReadContract({

//     });
// }

