import React, { useState, useRef, useEffect } from 'react'
import DentalChart from './components/DentalChart'
import CoordinatePicker from './components/CoordinatePicker'
import ImageCropper from './components/ImageCropper'
import ToothMapper from './components/ToothMapper'
import './App.css'

function App() {
  const [mode, setMode] = useState('chart') // 'chart', 'picker', 'cropper', or 'mapper'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setDropdownOpen(false)
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <div className="dropdown-container" ref={dropdownRef}>
            <button
              className="dropdown-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Menu"
            >
              <span className="dots-icon">⋮</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button
                  className={mode === 'picker' ? 'active' : ''}
                  onClick={() => handleModeChange('picker')}
                >
                  Coordinate Picker
                </button>
                <button
                  className={mode === 'cropper' ? 'active' : ''}
                  onClick={() => handleModeChange('cropper')}
                >
                  Image Cropper
                </button>
                <button
                  className={mode === 'mapper' ? 'active' : ''}
                  onClick={() => handleModeChange('mapper')}
                >
                  Tooth Mapper
                </button>
                <button
                  className={mode === 'chart' ? 'active' : ''}
                  onClick={() => handleModeChange('chart')}
                >
                  Chart View
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="header-center">
          <h1>Interactive Dental Chart</h1>
        </div>
      </header>
      {mode === 'chart' && <DentalChart />}
      {mode === 'picker' && <CoordinatePicker />}
      {mode === 'cropper' && <ImageCropper />}
      {mode === 'mapper' && <ToothMapper />}
    </div>
  )
}

export default App
