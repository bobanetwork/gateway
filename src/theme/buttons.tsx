import { Button } from "@/components/ui"
import Text from "@/components/ui/text"

interface Props {

}

const ButtonLists = (props: Props) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <div className="flex flex-col gap-2 py-2">
        <Text variant="2xl">Primary</Text>
        <div className="flex gap-2">
          <Text variant="xl">Active</Text>
          <Button size="sm">Button SM</Button>
          <Button size="md">Button MD</Button>
          <Button size="lg">Button LG</Button>
        </div>
        <div className="flex gap-2">
          <Text variant="xl">Hover</Text>
          <Button size="sm">Button SM</Button>
          <Button size="md">Button MD</Button>
          <Button size="lg">Button LG</Button>
        </div>
        <div className="flex gap-2">
          <Text variant="xl">Disabled</Text>
          <Button disabled={true} size="sm">Button SM</Button>
          <Button disabled={true} size="md">Button MD</Button>
          <Button disabled={true} size="lg">Button LG</Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 py-2">
        <Text variant="2xl">Outline</Text>
        <div className="flex gap-2">
          <Text variant="xl">Active</Text>
          <Button variant="outline" size="sm">Button SM</Button>
          <Button variant="outline" size="md">Button MD</Button>
          <Button variant="outline" size="lg">Button LG</Button>
        </div>
        <div className="flex gap-2">
          <Text variant="xl">Hover</Text>
          <Button variant="outline" size="sm">Button SM</Button>
          <Button variant="outline" size="md">Button MD</Button>
          <Button variant="outline" size="lg">Button LG</Button>
        </div>
        <div className="flex gap-2">
          <Text variant="xl">Disabled</Text>
          <Button variant="outline" disabled={true} size="sm">Button SM</Button>
          <Button variant="outline" disabled={true} size="md">Button MD</Button>
          <Button variant="outline" disabled={true} size="lg">Button LG</Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 py-2">
        <Text variant="2xl">Text Only</Text>
        <div className="flex gap-2">
          <Text variant="xl">Active</Text>
          <Button variant="ghost" size="sm">Button SM</Button>
          <Button variant="ghost" size="md">Button MD</Button>
          <Button variant="ghost" size="lg">Button LG</Button>
        </div>
        <div className="flex gap-2">
          <Text variant="xl">Hover</Text>
          <Button variant="ghost" size="sm">Button SM</Button>
          <Button variant="ghost" size="md">Button MD</Button>
          <Button variant="ghost" size="lg">Button LG</Button>
        </div>
        <div className="flex gap-2">
          <Text variant="xl">Disabled</Text>
          <Button variant="ghost" disabled={true} size="sm">Button SM</Button>
          <Button variant="ghost" disabled={true} size="md">Button MD</Button>
          <Button variant="ghost" disabled={true} size="lg">Button LG</Button>
        </div>
      </div>
    </div>
  )
}

export default ButtonLists
