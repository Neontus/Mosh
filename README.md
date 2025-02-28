**Overview**

Going to concerts, sports games, and events is fun, but buying tickets is definitely not! The most common platforms used to purchase tickets for events act as middle men, charging large fees for these events. Additionally, these ticketing systems are plagued with fraud due to the centralized control and lack of transparency. This affects both event-goers, who pay huge fees and might have to deal with fraud, and event-organizers, who end up having little control over the sales of their tickets.

Mosh is a decentralized ticketing platform built on Base, designed to eliminate fraud, reduce fees by cutting out middle-men, and bring transparency to event ticketing. By leveraging smart contracts, it ensures secure ticket issuance, resale, and validation, preventing counterfeits and scalping while giving event organizers control over pricing and transfers. The tickets are designed as NFTs, so they are immutable, transparent assets that can be sold by event-organizers to buyers. With on-chain verification and a trustless system, Mosh creates a more accessible and fair ticketing experience for both hosts and attendees.


**Backend**

The NFTs for the tickets are minted using a Solidity Smart Contract called TicketNFT.sol, which takes advantage of ERC721 standard for NFTs. There is also an SVG renderer smart contract, so that these NFTs can be dynamically rendered to match the details of the concert. You can see how these contracts function further in the test folder, where base cases have been running, testing the functionality of the smart contracts in creating NFTs. The scripts folder features the deploy scripts used to push the smart contracts onto the Base chain


**Frontend**

The frontend is built on Next Js, and uses Tailwind CSS for the styling. We make use of Base's OnChainKit  and Smart Wallet to make the web app more accessible. When authenticating and connecting to a wallet, we used Base's OnChainKit and Smart Wallet to make it possible for users who have never interacted with crypto to set up a wallet.
