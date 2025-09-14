import { LanguageProvider } from './contexts/LanguageContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ModeToggle from './components/ModeToggle';
import { PortfolioSummary } from './components/PortfolioSummary';
import PortfolioForm from './components/PortfolioForm';
import Results from './components/Results';
import { MonthlyStrategy } from './components/MonthlyStrategy';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PortfolioProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-1">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Hero />
                <ModeToggle />
                <PortfolioSummary />
                <PortfolioForm />
                <Results />
                <MonthlyStrategy />
              </div>
            </main>
            <Footer />
          </div>
        </PortfolioProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
