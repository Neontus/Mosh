'use client';

import React, { useState, useEffect } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import { NFTCard } from '@coinbase/onchainkit/nft';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import TicketNFTABI from '@/abi/TicketNFT.json';
import { Providers } from './providers';

const CONTRACT_ADDRESS = '0x747172f0dEcB86d9C82113381d3bBFf59d34EEc0';

export default function App() {
  const { address } = useAccount();
  const [availableTickets, setAvailableTickets] = useState<number | null>(null);
  const [myTickets, setMyTickets] = useState<number[]>([]);
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    if (address) {
      fetchEventDetails();
      fetchOwnedTickets();
    }
  }, [address]);

  // 🔹 Fetch available tickets
  async function fetchEventDetails() {
    try {
      const provider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TicketNFTABI, provider);

      const totalMinted = await contract.totalSupply();
      setAvailableTickets(10 - totalMinted.toNumber()); // Assuming max supply = 10
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  }

  // 🔹 Fetch owned tickets
  async function fetchOwnedTickets() {
    try {
      if (!address) return;
      const provider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TicketNFTABI, provider);

      const ownedTicketIds = await contract.getOwnedTickets(address);
      setMyTickets(ownedTicketIds.map((id: { toString: () => string }) => Number(id.toString())));
    } catch (error) {
      console.error("Error fetching owned tickets:", error);
    }
  }

  // 🔹 Mint a ticket
  async function mintTicket() {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    setMinting(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TicketNFTABI, signer);

      const tx = await contract.mintTicket(
        address,
        "Event Name",
        "Event Date",
        "Event Location"
      );
      await tx.wait();

      alert("✅ Ticket Minted Successfully!");
      fetchEventDetails();
      fetchOwnedTickets();
    } catch (error) {
      console.error("Error minting ticket:", error);
      alert("❌ Minting Failed!");
    }
    setMinting(false);
  }

  return (
    <Providers>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <header className="sticky top-0 bg-white/70 dark:bg-black/70 shadow-md py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
            <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text">Event Tickets</h1>
            <Wallet>
              <ConnectWallet className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 py-2">
                  <Avatar className="h-10 w-10" />
                  <Name className="font-bold text-lg" />
                  <Address className="text-sm text-gray-500 dark:text-gray-400" />
                  <EthBalance className="text-blue-600 dark:text-blue-400 font-medium" />
                </Identity>
                <WalletDropdownDisconnect className="px-4 py-2 text-red-500" />
              </WalletDropdown>
            </Wallet>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center p-4">
          <h2 className="text-2xl font-bold mb-4">Available Tickets: {availableTickets !== null ? `${availableTickets}/10` : "Loading..."}</h2>
          <button
            onClick={mintTicket}
            disabled={minting || availableTickets === 0}
            className={`px-4 py-2 bg-blue-600 text-white rounded-full ${minting || availableTickets === 0 ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"}`}
          >
            {minting ? "Minting..." : availableTickets === 0 ? "Sold Out" : "Mint a Ticket"}
          </button>

          <h2 className="text-2xl font-bold mt-8">My Tickets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTickets.map((ticketId) => (
              <NFTCard
                key={ticketId}
                contractAddress={CONTRACT_ADDRESS}
                tokenId={ticketId.toString()}
                className="rounded-lg shadow-md"
              />
            ))}
          </div>
        </main>
      </div>
    </Providers>
  );
}
