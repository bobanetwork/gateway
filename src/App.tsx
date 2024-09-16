import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from '@/components/ui/button'
import { EnvelopeOpenIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Input, Label } from "@/components/ui";
import ThemeToggleButton from "@/components/layout/ThemeToggle";
import Text from "./components/ui/text";
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
          <Button className="mx-2" key={connector.uid} variant={index % 2 == 0 ? "outline" : "default"} onClick={() => connect({ connector })} type="button">
            {connector.name}
          </Button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
        <Button variant="default">Primary</Button>
        <Button variant="secondary">Outlined</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="outline"> <EnvelopeOpenIcon className="mr-2 h-4 w-4" /> link</Button>
        <Button disabled>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>

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

        <div className="flex justify-center">
          <div className="mt-2 mx-auto rounded-sm p-3 w-12/4">
            📓 Montserrat
            <Text fontFamily="montserrat" variant="3xl"> 3xl Top level heading goes</Text>
            <Text fontFamily="montserrat" variant="2xl"> 2xl</Text>
            <Text fontFamily="montserrat" variant="xl"> xl</Text>
            <Text fontFamily="montserrat" align="center" variant="lg"> lg cneter aligned Text</Text>
            <Text fontFamily="montserrat" align="center" variant="md"> md cneter aligned Text</Text>
            <Text fontFamily="montserrat" align="right" variant="sm"> sm right aligned</Text>
            <Text fontFamily="montserrat" variant="xs"> xs</Text>
          </div>
          <div className="mt-2 mx-auto rounded-sm p-3 w-12/4">
            📓 Inter
            <Text fontWeight="bold" variant="lg">Large</Text>
            <Text fontWeight="bold" variant="md">Medium</Text>
            <Text fontWeight="bold" variant="sm">Small</Text>
            📓 Inter- semibold
            <Text fontWeight="semibold" variant="lg">Large</Text>
            <Text fontWeight="semibold" variant="md">Medium</Text>
            <Text fontWeight="semibold" variant="sm">Small</Text>
            📓 Inter- medium
            <Text fontWeight="medium" variant="lg">Large</Text>
            <Text fontWeight="medium" variant="md">Medium</Text>
            <Text fontWeight="medium" variant="sm">Small</Text>
            📓 Inter- regular
            <Text fontWeight="normal" variant="md">Medium</Text>
            <Text fontWeight="normal" variant="sm">Small</Text>
            📓 Inter- light
            <Text fontWeight="light" variant="sm">Small</Text>
          </div>
        </div>



      </div>
    </>
  );
}

export default App;
