import { Button, Tooltip } from "@/components/ui"
import Text from "@/components/ui/text"
import { IconSettings2 } from "@tabler/icons-react"

const TooltipSample = () => {
  return (
    <div className="flex flex-col gap-2 items-center my-3">
      <Text variant="2xl" fontWeight="medium"> ToolTip option</Text>
      <Tooltip content="Hello world of React!!">
        <Button variant="outline">ME</Button>
      </Tooltip>

      <Tooltip
        content={<div className="p-1 rounded-sm w-80 gap-2 flex flex-col items-start">
          <Text variant="md" fontWeight="medium" >Light Bridge</Text>
          <Text variant="sm" fontWeight="normal">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto corporis, unde a obcaecati saepe numquam placeat tenetur blanditiis aut mollitia. Excepturi amet inventore pariatur corrupti ullam ab ad facilis totam!</Text>
          <Text variant="md" fontWeight="medium" >Classic Bridge</Text>
          <Text variant="sm" fontWeight="normal">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto corporis, unde a obcaecati saepe numquam placeat tenetur blanditiis aut mollitia. Excepturi amet inventore pariatur corrupti ullam ab ad facilis totam!</Text>
        </div>}
      >
        <IconSettings2 className="w-8 h-8" />
      </Tooltip>
    </div>
  )
}

export default TooltipSample
