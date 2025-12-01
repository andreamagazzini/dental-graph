import React, { useState, useRef } from 'react'
import './CoordinatePicker.css'

const CoordinatePicker = () => {
  const [clicks, setClicks] = useState([])
  const imageRef = useRef(null)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  const handleImageLoad = () => {
    if (imageRef.current) {
      const container = imageRef.current.parentElement
      const width = container ? container.offsetWidth : imageRef.current.offsetWidth
      const height = imageRef.current.naturalHeight
      setImageDimensions({ width, height })
    }
  }

  const handleImageClick = (e) => {
    if (!imageRef.current) return

    const container = imageRef.current.parentElement
    const containerRect = container.getBoundingClientRect()
    const imageRect = imageRef.current.getBoundingClientRect()
    
    // Calculate click position relative to the image
    const x = e.clientX - imageRect.left
    const y = e.clientY - imageRect.top
    
    // Calculate relative coordinates (0-1)
    const relativeX = x / imageRect.width
    const relativeY = y / imageRect.height

    const newClick = {
      id: clicks.length + 1,
      x: x,
      y: y,
      relativeX: relativeX.toFixed(4),
      relativeY: relativeY.toFixed(4),
      timestamp: new Date().toLocaleTimeString()
    }

    setClicks([...clicks, newClick])
    console.log('Click coordinates:', newClick)
  }

  const clearClicks = () => {
    setClicks([])
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const exportCoordinates = () => {
    const data = clicks.map(click => ({
      x: parseFloat(click.relativeX),
      y: parseFloat(click.relativeY)
    }))
    const json = JSON.stringify(data, null, 2)
    copyToClipboard(json)
  }

  return (
    <div className="coordinate-picker-container">
      <div className="picker-header">
        <h2>Coordinate Picker</h2>
        <p>Click on the image to get coordinates. Click positions are marked with red dots.</p>
        <div className="picker-controls">
          <button onClick={clearClicks}>Clear All</button>
          <button onClick={exportCoordinates}>Export as JSON</button>
        </div>
      </div>

      <div className="picker-main">
        <div className="picker-image-wrapper">
          <div className="mouth-image-wrapper-inner">
            <img
              ref={imageRef}
              src={`${import.meta.env.BASE_URL}dental-schema.png`}
              alt="Dental chart"
              className="mouth-image"
              onLoad={handleImageLoad}
              onClick={handleImageClick}
            />
            {/* Markers for clicked positions */}
            {clicks.map((click) => (
              <div
                key={click.id}
                className="click-marker"
                style={{
                  left: `${click.x}px`,
                  top: `${click.y}px`,
                }}
                title={`X: ${click.relativeX}, Y: ${click.relativeY}`}
              />
            ))}
          </div>
        </div>

        <div className="picker-coordinates">
          <h3>Click Coordinates ({clicks.length})</h3>
          <div className="coordinates-list">
            {clicks.length === 0 ? (
              <p className="no-clicks">No clicks yet. Click on the image to start.</p>
            ) : (
              clicks.map((click) => (
                <div key={click.id} className="coordinate-item">
                  <div className="coordinate-number">#{click.id}</div>
                  <div className="coordinate-values">
                    <div>
                      <strong>X:</strong> {click.relativeX} <small>({Math.round(click.x)}px)</small>
                    </div>
                    <div>
                      <strong>Y:</strong> {click.relativeY} <small>({Math.round(click.y)}px)</small>
                    </div>
                    <div className="coordinate-code">
                      <code>
                        position: {'{'} x: {click.relativeX}, y: {click.relativeY} {'}'}
                      </code>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(`position: { x: ${click.relativeX}, y: ${click.relativeY} }`)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="coordinate-time">{click.timestamp}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoordinatePicker
