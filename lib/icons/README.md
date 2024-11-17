# @impactium/icons

This package provides a convenient wrapper around `lucide-react` and `vercel-icons`. It includes over 1900 icons, making it easy to use them in your projects.

### Key Features
- **Default Size:** Icons have a default size of `20`.
- **Color Priority:** The `color` property takes precedence over `variant`.
- **Recommendation:** Avoid using universal CSS rules like `* { color: something }` as all icons will inherit that color.

---

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
- **1.0.6**: Now `lucide-icons` have priority over `versel-icons`.
- **1.0.7**: Replaced `var(--versel-color)` with hardcoded color values.

This package makes it quick and easy to integrate icons into your projects with minimal configuration.

Need help or something? Write here: `admin@impactium.fun`

Made by **Mireg** from **Impactium** with 🖤