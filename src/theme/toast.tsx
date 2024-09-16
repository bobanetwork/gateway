import { Button } from "@/components/ui"
import Text from "@/components/ui/text"
import { useToast } from "@/hooks/use-toast"
import { IconAlertCircle, IconCircleCheck, IconAlertTriangle } from "@tabler/icons-react"


const ToastListContainer = () => {

  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-4">
      <Text align="center" variant="3xl">Toast Examples</Text>
      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={() => {
          toast({
            title: "[Information Text Here]",
            variant: "default"
          })
        }}>
          <IconAlertCircle className="w-4 h-4 mr-2" /> Information
        </Button>
        <Button variant="outline" onClick={() => {
          toast({
            title: "[Information Text Here]",
            variant: "destructive"
          })
        }}>
          <IconAlertTriangle className="w-4 h-4 mr-2" /> Warning
        </Button>
        <Button variant="outline" onClick={() => {
          toast({
            title: "[Information Text Here]",
            variant: "default"
          })
        }}>
          <IconAlertCircle className="w-4 h-4 mr-2" /> Error
        </Button>
        <Button variant="outline" onClick={() => {
          toast({
            title: "[Information Text Here]",
            variant: "default"
          })
        }}>
          <IconCircleCheck className="w-4 h-4 mr-2" /> Success
        </Button>
      </div>
    </div>
  )
}

export default ToastListContainer