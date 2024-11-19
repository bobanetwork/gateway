import { shortenAddress } from "@/utils/format";
import { useState } from "react";

export function useHeader() {
  const [account, _] = useState<string>("0x970387428874288742887428");
  return {
    account,
    shortAccount: shortenAddress(account, '...', 4)
  }
}

export default useHeader;