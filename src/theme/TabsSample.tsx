import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import Text from '@/components/ui/text'

const TabsSample = () => {
  return (
    <div className="flex flex-col w-6/12 gap-4">
      <Text variant="md" fontWeight="bold">Main Bridge Tab</Text>
      <Tabs defaultValue="classic" className="w-[600px]">
        <TabsList>
          <TabsTrigger value="classic">Classic</TabsTrigger>
          <TabsTrigger value="light">Light</TabsTrigger>
          <TabsTrigger value="party">Third Party</TabsTrigger>
        </TabsList>
        <TabsContent value="classic">Make changes to your account here.</TabsContent>
        <TabsContent value="light">Make changes to your account here.</TabsContent>
        <TabsContent value="party">Change your password here.</TabsContent>
      </Tabs>
      <Text variant="md" fontWeight="bold">Smart Account Transaction</Text>
      <Tabs defaultValue="transfer" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
        </TabsList>
        <TabsContent value="transfer">Transfer goes here!</TabsContent>
        <TabsContent value="send">Send Send.</TabsContent>
      </Tabs>
      <Text variant="md" fontWeight="bold">Delegate Vote Modal</Text>
      <Tabs defaultValue="toMe" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="toMe">To Myself</TabsTrigger>
          <TabsTrigger value="toOther">To Other</TabsTrigger>
        </TabsList>
        <TabsContent value="toMe">Make changes to your account here.</TabsContent>
        <TabsContent value="toOther">Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}

export default TabsSample
