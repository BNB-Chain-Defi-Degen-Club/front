export const isMetamaskInstalled = () => !!(window as any).ethereum;
export const isMetamaskConnected = () => !!(window as any).ethereum.isConnected();
export const isMetamaskUnlocked = async () => await (window as any).ethereum._metamask.isUnlocked();
