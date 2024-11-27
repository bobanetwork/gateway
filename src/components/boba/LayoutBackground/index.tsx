

export const LayoutBackground = () => {
  return (
    <div className="absolute w-full h-full overflow-hidden bg-transparent">
      <div className={`w-screen h-screen bg-no-repeat
        bg-light-gradient dark:bg-dark-gradient
        transition-transform ease-in-out duration-1000
        bg-top bg-100x50 -translate-y-[30%]
          `}></div>
      <div className="absolute z-0 inset-0 h-full bg-grid-lines dark:bg-grid-lines-dark bg-50x50"></div>
    </div>
  )
}
