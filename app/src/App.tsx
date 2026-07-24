import { ThemeProvider } from "@/components/theme/theme-provider"
import { CalculatorPage } from "@/components/calculator/calculator-page"

function App() {
  return (
    <ThemeProvider>
      <CalculatorPage />
    </ThemeProvider>
  )
}

export default App
