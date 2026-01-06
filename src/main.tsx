import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'

// Error handling for root element
const rootElement = document.getElementById('root')
if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; text-align: center;">
      <h1 style="color: #dc2626;">Application Error</h1>
      <p>Root element not found. Please check the HTML structure.</p>
    </div>
  `
  throw new Error('Root element not found')
}

// Wrap app in error boundary and render
try {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  )
} catch (error) {
  console.error('Failed to render app:', error)
  rootElement.innerHTML = `
    <div style="padding: 40px; font-family: sans-serif; max-width: 600px; margin: 0 auto; margin-top: 100px;">
      <h1 style="color: #dc2626; margin-bottom: 20px;">Application Error</h1>
      <p style="margin-bottom: 20px; color: #666;">Failed to load the application. Please check the console for details.</p>
      <details style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <summary style="cursor: pointer; font-weight: bold; margin-bottom: 10px;">Error Details</summary>
        <pre style="overflow: auto; font-size: 12px; white-space: pre-wrap; word-break: break-word;">
          ${error instanceof Error ? error.message : String(error)}
          ${error instanceof Error && error.stack ? error.stack : ''}
        </pre>
      </details>
      <button
        onclick="window.location.reload()"
        style="margin-top: 20px; padding: 10px 20px; background-color: #6BAA6F; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;"
      >
        Reload Page
      </button>
    </div>
  `
}
