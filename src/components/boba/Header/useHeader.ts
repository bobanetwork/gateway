import { shortenAddress } from "@/utils/format";
import { useAccount } from "wagmi";

export function useHeader() {
  const { address } = useAccount();
  return {
    account: address,
    shortAccount: shortenAddress(address as any, '...', 4)
  }
}

export default useHeader;