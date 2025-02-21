// NFTTransferComponent.tsx
import React, { useState } from 'react';
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";


const apiKeyName = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

const privateKey = process.env.PRIVATE_KEY;



// let wallet: Wallet | null = null;

// const initializeWallet = async () => {
//     wallet = await Wallet.create({ networkId: Coinbase.networks.BaseSepolia });

// };

// initializeWallet();

interface NFTTransferComponentProps {
    recipient: string; // Recipient address provided at construction
    sender: string;    // Sender address provided at construction
  }
  
  const NFTTransferComponent: React.FC<NFTTransferComponentProps> = ({
    recipient,
    sender,
  }) => {
    // Local state for NFT contract address, token ID, and status message.
    const [contractAddress, setContractAddress] = useState<string>('');
    const [tokenId, setTokenId] = useState<string>('1000');
    const [message, setMessage] = useState<string>('');
  
    const handleTransfer = async () => {
      if (!contractAddress || !tokenId) {
        setMessage('Please fill in the contract address and token ID.');
        return;
      }
      setMessage('Initiating NFT transfer...');
  
      try {
        // Configure Coinbase using your API key JSON file.
        if (apiKeyName && privateKey) {
            Coinbase.configure({ apiKeyName: apiKeyName, privateKey: privateKey });
          } else {
          console.error('API key is not defined');
        }
  
        // Create a wallet instance on Ethereum Mainnet.
        const wallet = await Wallet.create({});
  
        // Prepare the arguments for the ERC‑721 transferFrom method.
        const transferFromArgs = {
          from: sender,      // Sender address provided via props
          to: recipient,     // Recipient address provided via props
          tokenId: tokenId,  // Token ID to transfer
        };
  
        // Invoke the transferFrom method on your NFT contract.
        const contractInvocation = await wallet.invokeContract({
          contractAddress: contractAddress, // Your NFT contract address
          method: 'transferFrom',
          args: transferFromArgs,
        });
  
        // Wait for the transaction to be confirmed on-chain.
        await contractInvocation.wait();
        setMessage('NFT transferred successfully!');
      } catch (error) {
        console.error('Error transferring NFT:', error);
        setMessage('NFT transfer failed. Check console for details.');
      }
    };
  
    return (
      <div className="p-4 border rounded max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Transfer ERC‑721 NFT Ticket</h2>
        <p>
          <strong>Sender:</strong> {sender}
        </p>
        <p>
          <strong>Recipient:</strong> {recipient}
        </p>
        <div className="mb-4">
          <label className="block font-medium">NFT Contract Address:</label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0xYourNFTContractAddress"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Token ID:</label>
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Token ID"
          />
        </div>
        <button
          onClick={handleTransfer}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Transfer NFT
        </button>
        {message && <p className="mt-4">{message}</p>}
      </div>
    );
  };
  
  export default NFTTransferComponent;