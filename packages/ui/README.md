import { Meta } from "@storybook/blocks";
import { Title } from '@storybook/blocks'

import Github from "./assets/github.svg";
import Discord from "./assets/discord.svg";
import Bilibili from "./assets/bilibili.svg";
import DingDing from "./assets/dingding.png";
import Youtube from "./assets/youtube.svg";
import Tutorials from "./assets/tutorials.svg";

export const RightArrow = () => <svg 
    viewBox="0 0 14 14" 
    width="8px" 
    height="14px" 
    style={{ 
      marginLeft: '4px',
      display: 'inline-block',
      shapeRendering: 'inherit',
      verticalAlign: 'middle',
      fill: 'currentColor',
      'path fill': 'currentColor'
    }}
>
  <path d="m11.1 7.35-5.5 5.5a.5.5 0 0 1-.7-.7L10.04 7 4.9 1.85a.5.5 0 1 1 .7-.7l5.5 5.5c.2.2.2.5 0 .7Z" />
</svg>

# Introduction

`@galacean/editor-ui` is a set of components used to build [Galacean Editor](https://galacean.com) which is an perfessional 3d scene editor in the browser. This package is separated from it, dedicated to building a graphic editor in the browser.

In addition to including some basic components such as `<Button>` or `<Input />`, it also provides some dedicated components like `<ColorPicker />`, `<GradientSlider />`, `<ParticleSlider />`, `AssetPicker` and some hooks to help you build your own graphic editor.

You also could use it to build some plugins for Galacean Editor.

Accessibility is a key part of the package, all components are designed to be accessible.

## Installation

```bash
npm install @galacean/editor-ui
```

## Usage

Once you have installed the package, you can import the components and use them in your application.

```tsx
import { Button } from '@galacean/editor-ui';

function App() {
  return (
    <Button>Galacean Editor</Button>
  );
}
```

Note: You have to keep your application with some **reset css** to make sure the components work correctly. If not you could use `resetStyle()` which exported from `@galacean/editor-ui` to reset the style.

> This package does not use the `z-index` style.


## Acknowledgement

This library would not have been possible without these excellent open-source projects:

- `@stitches/react` CSS-in-JS solution
- `@radix-ui` for building accessibility components
- `@radix-ui/colors` for color system
- `react-colorful` a tiny color picker component
- `colord` for color manipulation
- `@tabler/icon-react` for some icons

