


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