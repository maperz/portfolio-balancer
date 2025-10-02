# Portfolio Balancer

A modern React-based portfolio rebalancing calculator that helps investors maintain their desired asset allocation. Built with React, Tailwind CSS, and Vite for optimal performance and developer experience.

NOTE: This project was entirely bootstrapped and developed with AI tooling to test their capabilities and understand modern AI workflow.

## Features

### Basic Mode
- Add multiple investment positions (stocks, bonds, commodities, cash, etc.)
- Set target allocation percentages for each position
- Calculate rebalancing recommendations (buy/sell/hold)
- Automatic handling of allocations that don't sum to 100% (creates "Unspent" position)

### Advanced Mode
- Monthly savings integration
- Configurable rebalancing frequency (monthly, quarterly, yearly)
- Future portfolio value calculations including regular contributions

### Internationalization
- Available in English and German
- Automatic language detection based on browser settings
- Manual language switching
- Separate JSON translation files for easy maintenance

### Modern Tech Stack
- ⚛️ React 18 with hooks and context
- 🎨 Tailwind CSS for styling
- ⚡ Vite for fast development and building
- 📱 Fully responsive design
- ♿ WCAG compliant accessibility
- 🌐 Static site deployment ready

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio-balancer.git
cd portfolio-balancer

# Install dependencies
npm install

# Start development server
npm run dev
```

Then visit `http://localhost:3000` in your browser.

## GitHub Pages Deployment

### Automatic Deployment with GitHub Actions
1. Fork this repository
2. Go to Settings → Pages
3. Select "GitHub Actions" as the source
4. Push to main branch - the site will automatically build and deploy
5. Your site will be available at `https://yourusername.github.io/portfolio-balancer`

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider

## Project Structure

```
portfolio-balancer/
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── ModeToggle.jsx
│   │   ├── PortfolioForm.jsx
│   │   ├── PositionRow.jsx
│   │   ├── AdvancedSettings.jsx
│   │   ├── Results.jsx
│   │   └── Footer.jsx
│   ├── contexts/          # React contexts
│   │   ├── LanguageContext.jsx
│   │   └── PortfolioContext.jsx
│   ├── locales/           # Translation files
│   │   ├── en.json
│   │   └── de.json
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # React entry point
│   └── index.css          # Tailwind CSS styles
├── .github/workflows/     # GitHub Actions
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Usage Examples

### Basic Portfolio Rebalancing
1. **Add Positions**: Enter your current investments
   - MSCI World ETF: €70,000 (target: 70%)
   - Gold ETF: €10,000 (target: 10%)
   - Cash: €20,000 (target: 20%)

2. **Calculate**: The app will show:
   - Current allocation percentages
   - Target values for perfect balance
   - Specific buy/sell recommendations

### Advanced Mode with Savings
1. **Enable Advanced Mode**
2. **Set Monthly Savings**: €1,000
3. **Choose Frequency**: Quarterly rebalancing
4. **Calculate**: See how regular contributions can help rebalance over time

## File Structure

```
portfolio-balancer/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # Core application logic
├── translations.js     # Internationalization support
└── README.md           # This file
```

## Technical Details

### Architecture
- **React 18**: Modern React with hooks and context API
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Vite**: Fast build tool and development server
- **Context API**: State management for portfolio data and internationalization
- **JSON Translations**: Separate translation files for maintainability

### Core Algorithm
The rebalancing calculation works as follows:

1. **Calculate Total Portfolio Value**
   ```javascript
   totalValue = sum(currentValues) + (monthlySavings × months)
   ```

2. **Determine Target Values**
   ```javascript
   targetValue = (targetPercentage / 100) × totalValue
   ```

3. **Calculate Differences**
   ```javascript
   difference = targetValue - currentValue
   ```

4. **Generate Actions**
   - Positive difference → Buy recommendation
   - Negative difference → Sell recommendation
   - Near zero → Hold recommendation

### State Management
- **PortfolioContext**: Manages positions, calculations, and advanced settings
- **LanguageContext**: Handles translations and currency formatting

### Styling Architecture
- **Tailwind CSS**: Base utility classes
- **Custom Components**: Reusable button, form, and layout classes
- **CSS Custom Properties**: Theme colors and design tokens
- **Responsive Design**: Mobile-first approach with breakpoints

## Customization

### Adding New Languages
1. Create a new translation file in `src/locales/`:
```json
// src/locales/fr.json
{
  "title": "Équilibreur de Portefeuille",
  "subtitle": "Équilibrez votre portefeuille d'investissement",
  // ... other translations
}
```

2. Import and add to `LanguageContext.jsx`:
```javascript
import frTranslations from '../locales/fr.json';

const translations = {
  en: enTranslations,
  de: deTranslations,
  fr: frTranslations,
};
```

3. Add language button to `Header.jsx`

### Customizing Tailwind Theme
Modify `tailwind.config.js` to customize colors, fonts, and spacing:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      },
    },
  },
}
```

### Adding New Features
1. Create new components in `src/components/`
2. Add state management to contexts as needed
3. Update translations in JSON files
4. Add Tailwind classes for styling

## Development Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Testing

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for testing.

### Running Tests

```bash
# Run tests in watch mode (interactive)
npm run test

# Run tests once (for CI/CD)
npm run test:run

# Run tests with UI interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure

Tests are located in the `src/test/` directory:

- `PortfolioContext.test.jsx` - Tests for portfolio business logic
- `App.test.jsx` - Integration tests for the main App component
- `calculations.test.js` - Unit tests for calculation utilities

### Writing Tests

Tests use Vitest and React Testing Library. Example:

```javascript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PortfolioProvider, usePortfolio } from '../contexts/PortfolioContext';

describe('Portfolio Feature', () => {
  it('should calculate correctly', () => {
    const { result } = renderHook(() => usePortfolio(), {
      wrapper: PortfolioProvider,
    });
    
    act(() => {
      result.current.calculateRebalancing();
    });
    
    expect(result.current.results).toBeDefined();
  });
});
```

```

## Browser Support
- Chrome 88+
- Firefox 88+
- Safari 14+
- Edge 88+

Modern browsers with ES2020 support and CSS Grid/Flexbox.

## Contributing

This is an open-source project. Contributions are welcome!

### Development Setup
1. Clone the repository
2. Make your changes
3. Test thoroughly across different browsers
4. Submit a pull request

### Areas for Contribution
- Additional language translations
- New rebalancing algorithms
- Enhanced UI/UX features
- Mobile app development
- Tax-loss harvesting features
- Integration with brokerage APIs

## Disclaimer

This tool is for educational and planning purposes only. It does not constitute financial advice. Always consult with a qualified financial advisor before making investment decisions.

## Support

- Open an issue on GitHub for bug reports
- Submit feature requests via GitHub issues
- Check existing issues before creating new ones
