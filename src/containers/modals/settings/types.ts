export interface SettingRowTypes {
  title: string
  subTitle: string
  isActive: boolean
  onStateChange: (state: boolean) => void
}

export interface SettingDropDownRowTypes {
  title: string
  subTitle: string
}
