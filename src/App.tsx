import ThemeToggleButton from "@/components/layout/ThemeToggle";
import { Input, Label } from "@/components/ui";
import { Button } from '@/components/ui/button';
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Text from "./components/ui/text";
import ButtonLists from "./theme/buttons";
import ColorTiles from "./theme/colorTiles";
import Fonts from "./theme/fonts";
function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
      <div>
        <h2>Account</h2>

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
      </div>

      <div>
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

        <ButtonLists />

        <h2>Input</h2>
        <div className="m-2 p-4 rounded">
          <div className="m-2 rounded">
            <Input type="text" placeholder="Reciever Address" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Bridge Amount</Label>
            <Input type="text" id="email" placeholder="Enter amount to bridge" />
          </div>
        </div>

        <Text variant="3xl"> Colors </Text>
        <ColorTiles />
        <Text variant="3xl"> Fonts </Text>
        <Fonts />
      </div>
    </>
  );
}

export default App;
