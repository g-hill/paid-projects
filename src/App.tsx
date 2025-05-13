import './App.css'
import { AuthForm } from './components/AuthForm'
import { ThemeProvider } from './components/ui/ThemeProvider'
import ModeToggle from './components/ModeToggle'

function App() {
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ModeToggle />
        <div className="min-h-screen flex items-center justify-center bg-muted">
      <AuthForm />
    </div>
    </ThemeProvider>
  )
}

export default App
