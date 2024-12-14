# Staking dApp Development Guide

## **Project Setup**

1. **Organize the Project Structure**
   - Create a directory structure:
     ```py
     src
      ├── assets                # Static assets like images, logos, fonts, etc.
      ├── components            # Reusable UI components.
      │   └── StakingComponent.tsx  # Example component that uses the hooks.
      ├── config                # Configuration files.
      │   ├── contracts.ts      # Configuration for the staking contracts.
      │   └── otherConfigs.ts   # Any other configurations (e.g., network, API keys).
      ├── hooks                 # All custom React hooks.
      │   ├── useBalances.ts    # Hook for fetching balances.
      │   ├── useAPY.ts         # Hook for fetching APY data.
      │   ├── useTokenApproval.ts # Hook for token approval logic.
      │   ├── useStakingActions.ts # Hook for staking logic.
      │   ├── useUnstakingActions.ts # Hook for unstaking logic.
      │   ├── useStakingStats.ts # Hook for fetching staking stats.
      ├── index.css             # Global CSS or Tailwind CSS setup.
      ├── layout                # Layout components (e.g., Header, Footer, Sidebar).
      │   └── DefaultLayout.tsx # Example layout for the app.
      ├── main.tsx              # Entry point of the React application.
      ├── services              # External service or API wrappers.
      │   └── staking.ts        # Staking service for off-chain logic.
      ├── stores                # State management (e.g., Zustand, Redux).
      │   └── useStakingStore.ts # Example Zustand store for staking state.
      ├── theme                 # Theme-related files (e.g., color palettes, typography).
      │   └── theme.ts          # Example file for a theme configuration.
      ├── types                 # TypeScript types and interfaces.
      │   └── staking.ts        # Types related to staking (e.g., responses, contracts).
      ├── utils                 # Utility/helper functions.
      │   └── formatters.ts     # Formatters (e.g., formatEther, date formatting).
      │   └── validators.ts     # Input validation utilities.
      ├── vite-env.d.ts         # TypeScript declarations for Vite.
      └── wagmi.ts              # Wagmi setup file for managing providers and chains.

     ```

## **Feature Implementation**

### **1. Connect Wallet**
- Use `wagmi` and `viem` to implement wallet connection:
  - Show an alert if the user is not connected to the **BOBA Network**.
  - Provide a "Connect Wallet" button to connect using MetaMask.
- Code snippet:
  ```tsx
  import { useAccount, useConnect, useNetwork, useSwitchNetwork } from 'wagmi';

  const ConnectButton = () => {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();

    const BOBA_CHAIN_ID = 288; // Boba Ethereum Mainnet

    return (
      <div>
        {!isConnected && (
          <button onClick={() => connect(connectors[0])}>Connect Wallet</button>
        )}
        {isConnected && chain?.id !== BOBA_CHAIN_ID && (
          <button onClick={() => switchNetwork?.(BOBA_CHAIN_ID)}>
            Switch to Boba Network
          </button>
        )}
      </div>
    );
  };
  ```

### **2. Stake Page**
**UI Components**
- **Balance and Staked Amounts**
  - Use `wagmi` to fetch token balances via an `ERC20` contract.
  - Display available balance and already staked tokens.

- **Add Token to MetaMask**
  - Implement the "Add to MetaMask" functionality using `window.ethereum.request`.
  ```tsx
  const addTokenToMetaMask = async () => {
    const tokenDetails = {
      address: '0xYourTokenAddress',
      symbol: 'BOBA',
      decimals: 18,
    };
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: tokenDetails,
      },
    });
  };
  ```

**Stake Funds**
- Modal Form:
  - Enter the staking amount and calculate rewards based on `APY`.
  - Send the transaction using the staking smart contract.
- Transaction Example:
  ```tsx
  import { writeContract } from '@wagmi/core';

  const stakeFunds = async (amount: string) => {
    await writeContract({
      address: '0xStakingContractAddress',
      abi: StakingABI,
      functionName: 'stake',
      args: [BigInt(amount * 1e18)],
    });
  };
  ```

### **3. Staking History**
- Existing Implementation:
  ```tsx
  
  async loadAccountSaveInfo() {
    try {
      const account = networkService.account
      let fsContract = this.loadFixedSavingContract()

      fsContract = fsContract.connect(networkService.L2Provider!)

      const stakeInfo: any = []

      const stakeCounts = await fsContract.personalStakeCount(account)

      for (let i = 0; i < stakeCounts; i++) {
        const stakeId = await fsContract.personalStakePos(account, i)
        const stakeData = await fsContract.stakeDataMap(stakeId)

        stakeInfo.push({
          stakeId: Number(stakeId.toString()),
          depositTimestamp: Number(stakeData.depositTimestamp.toString()),
          depositAmount: logAmount(stakeData.depositAmount.toString(), 18),
          isActive: stakeData.isActive,
        })
      }
      return { stakeInfo }
    } catch (error) {
      console.log(`FS: error`, error)
      return error
    }
  }
  
  
  /// the way to calculate total staked is.
  const totalBOBAstaked = Object.keys(stakeInfo).reduce((accumulator, key) => {
    if (stakeInfo[key].isActive) {
      return accumulator + Number(stakeInfo[key].depositAmount)
    }
    return accumulator
  }, 0)
  
  
  ///apy is hardcoded does it make sense to read from contract or somewhere constant?
  APY
  
  
  ```

- Cache this data in a `zustand` store:
  ```tsx
  import { create } from 'zustand';

  const useStakingStore = create((set) => ({
    stakingHistory: [],
    setStakingHistory: (data) => set({ stakingHistory: data }),
  }));
  ```

### **4. Unstake Funds**
- Ensure buttons are enabled only during the **Unstaking Window**.
- Example Logic:
  ```tsx
  const isUnstakingWindow = (unstakeDate: Date) => {
    const now = new Date();
    const start = new Date(unstakeDate);
    const end = new Date(unstakeDate);
    end.setDate(start.getDate() + 2); // Add 2 days for the unstaking window
    return now >= start && now <= end;
  };
  ```

- Unstake Logic:
  ```tsx
  const unstakeFunds = async (amount: string) => {
    await writeContract({
      address: '0xStakingContractAddress',
      abi: StakingABI,
      functionName: 'unstake',
      args: [BigInt(amount * 1e18)],
    });
  };
  ```

### **5. Loading and Success Dialogs**
- Use `zustand` for managing UI states (loading, success, error).
  ```tsx
  const useUIStore = create((set) => ({
    isLoading: false,
    setLoading: (status) => set({ isLoading: status }),
    showDialog: false,
    setDialog: (status) => set({ showDialog: status }),
  }));
  ```

## **Best Practices for Scaling**
1. **Code Quality**
   - Use consistent folder structure.
   - Follow TypeScript for type safety.
   - Implement reusable hooks (`useStake`, `useUnstake`, etc.).

2. **Contract Abstraction**
   - Store contract addresses and ABI in a centralized file (`contracts/index.ts`).

3. **Caching**
   - Use `zustand` to cache responses like staking history or balances.
   - Refetch data only on changes using `wagmi`.

4. **Theming**
   - Use `tailwindcss` for maintaining consistent UI styles.

5. **Testing**
   - Unit-test components using libraries like `Jest` and `React Testing Library`.
   - Test transactions on a testnet before deploying.
