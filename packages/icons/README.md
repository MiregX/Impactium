# @impactium/icons

This package provides a convenient wrapper around `lucide-react` and `vercel-icons`. It includes over 1900 icons, making it easy to use them in your projects.

### Key Features
- **Default Size:** Icons have a default size of `16`.
- **Default Color:** Default `color` value is `currentColor`.
- **Color Priority:** The `color` property takes precedence over `variant`.
- **Recommendation:** Avoid using universal CSS rules like `* { color: something }` as all icons will inherit that color. Instead use `*:not(svg *){}`
- **`@param fromGeist`:** Allows selecting an icon that exists in both libraries.

### Usage

```typescript
import { Icon } from '@impactium/icons';

// Basic usage
<Icon name="FunctionGo" />

// Setting color
<Icon name="FunctionGo" color="gray" />
<Icon name="FunctionGo" color="#212121" />

// Using variant
<Icon name="FunctionGo" variant="dimmed" />

// Example with TypeScript types
const name: Icon.Name = "FunctionNode";
const variant: Icon.Variant = "white";

<Icon name={name} variant={variant} size={32} />
```

### Changelog
- **1.0.0**: Package initialized.
- **1.0.1**: Added size customization support.
- **1.0.2**: Added color customization support.
- **1.0.3**: Fixed an issue where lucide-icons rendered incorrectly.
- **1.0.4**: Improved performance.
- **1.0.5**: Fixed an issue multicolor icons rendered incorrectly.
- **1.0.6**: Now `lucide-icons` have priority over `vercel-icons`.
- **1.0.7**: Replaced `var(--vercel-color)` with hardcoded color values.
- **1.0.8**:
  1. The default icon size has been updated from **20px** to **16px**.
  2. Fixed an issue with the built-in icon compiler from `lucide-react`. A custom algorithm was implemented to:
     - Support `defs` elements.
     - Work with nodes of any depth.
  3. Added support for the `fromGeist` parameter, allowing the selection of icons with the same name from both libraries. For example:
    - `<Icon name='User' />` // defaults to `lucide-react`.
    - `<Icon name='User' fromGeist />` // loads the icon from `Geist/Vercel`.
- **1.0.9**: New version just because i want to.
- **1.1.0**:
  1. Decreased package-size from 2MB to 1.2MB.
  2. Licence improvements.
- **1.1.1**: More icons.
- **1.1.2**: Fixed `unique key error`.
- **1.1.3**: Cause i want to.
- **1.1.4**: Fixed colors for PrismColor icon.
- **1.1.5**: Fixed icons order.
- **1.1.6**: Added new logo.
- **1.1.7**: Fixed new logo.
- **1.1.7**: Added new logo.
- **1.1.8**: Fixed new logo.
- **1.1.9**: Fixed colors for Python icon.
- **1.2.0**: Added Impactium logo and better icon generation algorhythm.
- **1.2.1**: Added two icons: `PointerLeft` and `PointerRight`.
- **1.2.2**: Two icons has been merged into one ic  on `Pointer` and has been redrew.
- **1.2.3**: Now any version of `React` is supported.
- **1.2.4**: Now any version of `React-Dom` is supported.
- **1.2.5**: Added `LogoTailwind` icon.
- **1.2.6**: Removed `Pointer` icon due to duplication of `GPS` icon.
- **1.2.7**: Added error message for unknown name prop.
- **1.2.8**: Added `LogoDocker` icon.

### TODO
- **Suggested Improvement**: Enhance the algorithm to enable the compiler to preserve key icon settings, such as `viewBox` and `width`.

This package makes it quick and easy to integrate icons into your projects with minimal configuration.

Need help or something? Write here: `admin@impactium.fun`

Made by **Mireg** from **Impactium** with 🖤