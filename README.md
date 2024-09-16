


## Project Structure: 


```python

src/
│
├── components/           # All reusable components go here
│   ├── ui/               # Custom components extending Shadcn UI or built-in ones
│   │   ├── Button.tsx    # Example custom button component
│   │   ├── Card.tsx      # Example custom card component
│   │   └── index.ts      # Centralized export file for ui components
│   ├── layout/           # Components related to page layout (e.g., Header, Footer)
│   ├── forms/            # Components related to forms (e.g., Input, Form)
│   └── modals/           # Components for modal dialogs
│
├── styles/               # Custom CSS or Tailwind styles
│   └── globals.css       # Global styling if necessary
│
├── pages/                # Main application pages or routes
│   ├── Home.tsx
│   ├── About.tsx
│   └── index.tsx
└── utils/                # Utility functions (e.g., helpers, context, hooks)

```


# ⚠ Custom hook
Please check the hook from the package before implementing the new one.
[usehooks custom](https://usehooks-ts.com/)

# ⚠ Icons
Please check the icons availble from library below.
[icons package](https://tabler.io/icons)


# Light Mode Colors:
```python

Gray
50 - #FCFCFD Opacity:90%
100 #F0F1EA
200 #E5E5E1
300 #FCFCFD
400 #DEE0D8
500 #C8CAC2
600 #8F9288
700 #5E6058
800 #22221E

Green (Main Brand Color)
50 - #EFF8CC
100 - #CEE967
200 - #BEE234
300 - #AEDB01      (Main Green)
400 - #90B406
500 - #637A0D
600 - #232C00

Red (error)
50 - #F3D8DB
100 - #EEC8CC
200 - #C97973
300 - #A52015
400 - #841A11
500 - #692327
600 - #210604

Yellow (warning)
50 - #FDF0D9
100 - #F9D28D
200 - #F7C367
300 - #F5B441
400 - #936C27
500 - #62481A
600 - #31240D

Information (information)
50 - #DBE3F8
100 - #B7C7F0
200 - #6E8EE1
300 - #4972DA
400 - #3B5BAE
500 - #1E2E57
600 - #0F172C
```

# Dark Mode Colors:


```python

Gray
50 - #EEEEEE 
100 - #A8A8A8
200 - #5F5F5F
300 - #545454
400 - #393939
500 - #262626
600 - #191919

Green (Main Brand Color)
50 - #EFF8CC
100 - #CEE967
200 - #BEE234
300 - #AEDB01      (Main Green)
400 - #90B406
500 - #637A0D
600 - #232C00

Red (error)
50 - #F7DCDC
100 - #EFB9B9
200 - #E07272
300 - #D84F4F
400 - #822F2F
500 - #562020
600 - #2B1010

Yellow (warning)
50 - #FDF0D9
100 - #F9D28D
200 - #F7C367
300 - #F5B441
400 - #936C27
500 - #62481A
600 - #31240D

Information (information)
50 - #DBE3F8
100 - #B7C7F0
200 - #6E8EE1
300 - #4A72DA
400 - #3B5BAE
500 - #1E2E57
600 - #0F172C

```