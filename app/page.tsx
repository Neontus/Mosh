'use client';

import React, { useState, useRef } from 'react';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';

import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { Checkout } from '@coinbase/onchainkit/checkout';
import { NFTMintCardDefault } from '@coinbase/onchainkit/nft';
import { NFTCard } from '@coinbase/onchainkit/nft';

import {
  NFTLastSoldPrice, 
  NFTMedia, 
  NFTNetwork, 
  NFTOwner, 
  NFTTitle, 
} from '@coinbase/onchainkit/nft/view'; 

type Event = {
  id: number;
  title: string;
  description: string;
  date?: string;
  location?: string;
  price?: string;
  image?: string;
};

import { useAccount } from 'wagmi';
import { Providers } from './providers'; 

const TICKET_CONTRACT_ADDRESS = '0x747172f0dEcB86d9C82113381d3bBFf59d34EEc0';

export default function App() {
  const { address } = useAccount();
  const [selectedTab, setSelectedTab] = useState<'create' | 'feed' | 'tickets'>('feed');
  const [events] = useState<Event[]>([
    { 
      id: 1, 
      title: 'Blob', 
      description: 'Test Event',
      price: '0 ETH',
      image: '/api/placeholder/600/400'
    },
  ]);
  
  const [myTickets] = useState<Event[]>([
    { id: 1, title: 'Blockchain Summit Ticket', description: 'Your ticket as an NFT.' },
  ]);
  const [newEvent, setNewEvent] = useState<{ title: string; description: string }>({
    title: '',
    description: '',
  });
  const [checkoutEvent, setCheckoutEvent] = useState<Event | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState<number | null>(null);
  const shareTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating event:', newEvent);
    setNewEvent({ title: '', description: '' });
    alert('Event created (not implemented in demo).');
  };

  const handlePurchaseTicket = (event: Event) => {
    setCheckoutEvent(event);
  };

  const handleShareEvent = (eventId: number) => {
    // Create a sharable link to the event
    const shareableLink = `${window.location.origin}/event/${eventId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        // Clear any existing timeout
        if (shareTimeoutRef.current) {
          clearTimeout(shareTimeoutRef.current);
        }
        
        // Show tooltip for this specific event
        setShowShareTooltip(eventId);
        
        // Hide tooltip after 2 seconds
        shareTimeoutRef.current = setTimeout(() => {
          setShowShareTooltip(null);
        }, 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy link to clipboard');
      });
  };

  const apiKeyName = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
  const privateKey = process.env.PRIVATEKEY;

  return (
    <Providers>
      <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-100">
        {/* Enhanced Header with Animated Gradient */}
        <header className="sticky top-0 z-10 backdrop-blur-lg bg-white/70 dark:bg-black/70 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <h1 className="relative text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text">Mosh</h1>
                </div>
              </div>
              <div className="wallet-container">
                <Wallet>
                  <ConnectWallet className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-medium transition-all hover:shadow-lg hover:from-blue-700 hover:to-purple-800 hover:scale-105 duration-300">
                    <Avatar className="h-6 w-6" />
                    <Name />
                  </ConnectWallet>
                  <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                      <Avatar className="h-12 w-12 mb-2 ring-2 ring-purple-500/30 p-0.5 rounded-full" />
                      <Name className="font-bold text-lg" />
                      <Address className="text-sm text-gray-500 dark:text-gray-400" />
                      <EthBalance className="font-medium mt-1 text-blue-600 dark:text-blue-400" />
                    </Identity>
                    <WalletDropdownLink
                      icon="wallet"
                      href="https://keys.coinbase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Wallet
                    </WalletDropdownLink>
                    <WalletDropdownDisconnect className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" />
                  </WalletDropdown>
                </Wallet>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-5xl">
            {/* Enhanced Tab Navigation with Animated Selection Indicator */}
            <div className="flex justify-center mb-10">
              <nav className="flex space-x-2 bg-white/80 dark:bg-gray-800/80 p-1.5 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md">
                <button
                  onClick={() => setSelectedTab('create')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    selectedTab === 'create'
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/70'
                  }`}
                >
                  {selectedTab === 'create' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 animate-gradient-x"></span>
                  )}
                  <span className="relative">Create Event</span>
                </button>
                <button
                  onClick={() => setSelectedTab('feed')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    selectedTab === 'feed'
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/70'
                  }`}
                >
                  {selectedTab === 'feed' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 animate-gradient-x"></span>
                  )}
                  <span className="relative">Events Feed</span>
                </button>
                <button
                  onClick={() => setSelectedTab('tickets')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    selectedTab === 'tickets'
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/70'
                  }`}
                >
                  {selectedTab === 'tickets' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 animate-gradient-x"></span>
                  )}
                  <span className="relative">My Tickets</span>
                </button>
              </nav>
            </div>

            {/* Enhanced Tab Contents */}
            <div className="min-h-[60vh]">
              {/* Create Event Tab */}
              {selectedTab === 'create' && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text">Create a New Event</h2>
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transform transition-all hover:scale-[1.01]">
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                      <div className="flex items-start mb-4">
                        <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Create an NFT Ticket Collection</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                            Mint NFT tickets that your attendees can purchase. These digital tickets provide 
                            secure access to your event and can be traded on secondary markets.
                          </p>
                        </div>
                      </div>
                    </div>
                    <NFTMintCardDefault 
                      contractAddress={TICKET_CONTRACT_ADDRESS} 
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Events Feed Tab */}
              {selectedTab === 'feed' && (
                <div className="px-4">
                  <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text">Discover Events</h2>
                  <div className="space-y-6">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:translate-y-[-2px] border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                      >
                        <div className="md:flex">
                          <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                            <img 
                              src={event.image || '/api/placeholder/400/300'} 
                              alt={event.title} 
                              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 md:opacity-100"></div>
                          </div>
                          <div className="p-6 md:w-2/3 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-center mb-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30 mr-2">
                                  {event.price}
                                </span>
                              </div>
                              <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-white">{event.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex space-x-4">
                                <div className="relative">
                                  <button
                                    onClick={() => handleShareEvent(event.id)}
                                    className="text-sm text-gray-500 dark:text-gray-400 flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share
                                  </button>
                                  
                                  {/* Copied tooltip */}
                                  {showShareTooltip === event.id && (
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                                      Link copied!
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handlePurchaseTicket(event)}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:from-blue-700 hover:to-purple-800 hover:scale-105 duration-300 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                                Get Ticket
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Tickets Tab */}
              {selectedTab === 'tickets' && (
                <div>
                  <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text">My Tickets</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myTickets.map((ticket) => (
                      <div key={ticket.id} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 h-full flex flex-col">
                          <NFTCard
                            contractAddress={TICKET_CONTRACT_ADDRESS}
                            tokenId={ticket.id.toString()}
                            className="mb-4 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow"
                          >
                            <NFTMedia className="w-full aspect-video object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500" />
                            <NFTTitle className="text-lg font-bold mt-2" />
                          </NFTCard>
                          <h3 className="font-bold mt-3 text-gray-800 dark:text-white">{ticket.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{ticket.description}</p>
                          <div className="mt-auto pt-4 flex justify-between items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/30">
                              Valid
                            </span>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="bg-white/80 dark:bg-gray-900/80 border-t border-gray-200/50 dark:border-gray-800/50 py-6 mt-12 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text mr-2">Mosh</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">• {new Date().getFullYear()}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by <span className="font-medium">Onchainkit</span>
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Modernized Checkout Modal */}
        {checkoutEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden transform transition-all duration-300 scale-100">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-600 to-purple-700 rounded-t-2xl"></div>
              
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-200 z-10 p-1 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setCheckoutEvent(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="pt-24 px-8 pb-8">
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{checkoutEvent.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{checkoutEvent.description}</p>
                
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Ticket</span>
                    <span className="font-medium">{checkoutEvent.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Network Fee</span>
                    <span className="text-gray-800 dark:text-gray-200">Variable</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-3"></div>
                  <div className="flex justify-between items-center pt-2 font-bold">
                    <span>Total</span>
                    <span className="text-lg">{checkoutEvent.price || '0 ETH'}</span>
                  </div>
                </div>
                
                <button
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl font-medium transition-all hover:from-blue-700 hover:to-purple-800 hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Complete Purchase
                </button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                  By completing this purchase, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Providers>
  );
}