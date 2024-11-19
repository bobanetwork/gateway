import Text from '@/components/ui/text'
const Fonts = () => {
  return (
    <div className="flex justify-center gap-5">
      <div className="flex flex-col gap-2">
        📓 Montserrat
        <Text fontFamily="montserrat" variant="3xl"> 3xl Top level heading goes</Text>
        <Text fontFamily="montserrat" variant="2xl"> 2xl</Text>
        <Text fontFamily="montserrat" variant="xl"> xl</Text>
        <Text fontFamily="montserrat" align="center" variant="lg"> lg cneter aligned Text</Text>
        <Text fontFamily="montserrat" align="center" variant="md"> md cneter aligned Text</Text>
        <Text fontFamily="montserrat" align="right" variant="sm"> sm right aligned</Text>
        <Text fontFamily="montserrat" variant="xs"> xs</Text>
      </div>
      <div className="flex flex-col gap-2">
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
  )
}

export default Fonts
