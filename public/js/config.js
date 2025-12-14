// Config helper to get contract address dynamically
async function getContractAddress() {
  try {
    const response = await fetch('/api/config');
    const data = await response.json();
    return data.contractAddress;
  } catch (error) {
    console.error('Error fetching config:', error);
    // Fallback to local deployment address
    return '0x5fbdb2315678afecb367f032d93f642f64180aa3';
  }
}
