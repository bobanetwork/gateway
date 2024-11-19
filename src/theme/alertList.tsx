import { Alert } from "@/components/ui";
import Text from "@/components/ui/text";

const AlertLists = () => {
  return (
    <div className="flex flex-col gap-2 flex-wrap">
      <Text variant="2xl">In modal alerts</Text>
      <div className="flex flex-wrap gap-2">
        <Alert
          variant="info"
          title="[Info alert goes here]"
          description="[Description of alert goes here]"
        />
        <Alert
          variant="warning"
          title="[warning alert goes here]"
          description="[Description of alert goes here]"
        />
        <Alert
          variant="error"
          title="[Error alert goes here]"
          description="[Description of alert goes here]"
        />
        <Alert
          variant="success"
          title="[Success alert goes here]"
          description="[Description of alert goes here]"
        />
      </div>
    </div>
  )
}

export default AlertLists;
