export const selectCustomStyles = (newStyle, theme) => {
  return {
    control: (provided) => ({
      ...provided,
      borderWidth: '0px',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      // 'box-shadow': newStyle ? '-13px 15px 19px rgba(0, 0, 0, 0.15), inset 53px 36px 120px rgba(255, 255, 255, 0.06)' : 'none'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      width: '0px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      marginRight: '30px',
      borderRight:
        theme.palette.mode === 'light'
          ? '1px solid rgba(0, 0, 0, 0.2)'
          : '1px solid rgba(255,255,255,0.2)',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }),
    menu: (provided) => ({
      ...provided,
      color: 'auto',
      backgroundColor: newStyle
        ? theme.palette.background.input
        : 'transparent',
      boxShadow: newStyle
        ? '-13px 15px 19px rgba(0, 0, 0, 0.15), inset 53px 36px 120px rgba(255, 255, 255, 0.06)'
        : 'none',
      '&:hover': {
        backgroundColor: 'none',
      },
    }),
    menuList: (provided) => ({
      ...provided,
      color: 'auto',
      backgroundColor: newStyle
        ? theme.palette.background.input
        : 'transparent',
      boxShadow: newStyle
        ? '-13px 15px 19px rgba(0, 0, 0, 0.15), inset 53px 36px 120px rgba(255, 255, 255, 0.06)'
        : 'none',
      '&:hover': {
        backgroundColor: 'none',
      },
      '::-webkit-scrollbar': {
        width: '0px',
        height: '0px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#888',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#555',
      },
      borderRadius: '10px',
    }),
    option: (provided) => ({
      ...provided,
      color: 'auto',
      backgroundColor: newStyle
        ? theme.palette.background.input
        : 'transparent',
      boxShadow: newStyle
        ? '-13px 15px 19px rgba(0, 0, 0, 0.15), inset 53px 36px 120px rgba(255, 255, 255, 0.06)'
        : 'none',
      '&:hover': {
        backgroundColor: 'none',
      },
    }),
  }
}
