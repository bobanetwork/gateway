import { Button, Input, Text } from "@/components/ui";
import AlertLists from "./alertList";
import ButtonLists from "./buttons";
import ColorTiles from "./colorTiles";
import DropdownSample from "./dropdownSample";
import Fonts from "./fonts";
import TabsSample from "./TabsSample";
import ToastListContainer from "./toastListContainer";
import TooltipSample from "./tooltipSample";
import PopoverSample from "./popoverSample";
import ThemeToggleButton from "@/components/boba/Header/components/ThemeToggle";
import { useAccount, useConnect, useDisconnect } from "wagmi";


const Example: React.FC = () => {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  return <>
    <div className="container mx-auto px-4">
      <h2>Account</h2>

      <PopoverSample />
      <div>
        status: {account.status}
        <br />
        addresses: {JSON.stringify(account.addresses)}
        <br />
        chainId: {account.chainId}
      </div>

      {account.status === "connected" && (
        <Button type="button" onClick={() => disconnect()}>
          Disconnect
        </Button>
      )}

      <ThemeToggleButton />
      <h2>Connect</h2>
      {connectors.map((connector, index) => (
        <Button className="mx-2" key={connector.uid} variant={index % 2 == 0 ? "outline" : "default"}
          size="sm"
          onClick={() => connect({ connector })} type="button">
          {connector.name}
        </Button>
      ))}
      <div>{status}</div>
      <div>{error?.message}</div>

      <TabsSample />
      <TooltipSample />
      <DropdownSample />
      <ToastListContainer />
      <AlertLists />
      <ButtonLists />
      <h2>Input</h2>
      <div className="m-2 p-4 rounded">
        <div className="m-2 rounded">
          <Input type="text" placeholder="Reciever Address" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="email">Bridge Amount</label>
          <Input type="text" id="email" placeholder="Enter amount to bridge" />
        </div>
      </div>

      <Text variant="3xl"> Colors </Text>
      <ColorTiles />
      <Text variant="3xl"> Fonts </Text>
      <Fonts />
    </div>
  </>
}

export default Example;