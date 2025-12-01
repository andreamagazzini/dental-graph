import React, { useState, useEffect } from 'react'
import './ToothMapper.css'

const ToothMapper = () => {
  // Coordinates from DentalChart - same order
  const coordinates = [
    { x: 0.4402, y: 0.0343 }, { x: 0.5598, y: 0.0343 }, { x: 0.6565, y: 0.0551 }, { x: 0.7455, y: 0.0807 },
    { x: 0.7863, y: 0.1286 }, { x: 0.8244, y: 0.1845 }, { x: 0.8651, y: 0.2532 }, { x: 0.8982, y: 0.3427 },
    { x: 0.9135, y: 0.4273 }, { x: 0.341, y: 0.0551 }, { x: 0.2646, y: 0.0839 }, { x: 0.2163, y: 0.1302 },
    { x: 0.1679, y: 0.1877 }, { x: 0.1298, y: 0.2548 }, { x: 0.0992, y: 0.3458 }, { x: 0.0789, y: 0.4305 },
    { x: 0.084, y: 0.5823 }, { x: 0.1018, y: 0.6685 }, { x: 0.1501, y: 0.7564 }, { x: 0.1934, y: 0.8347 },
    { x: 0.2468, y: 0.8874 }, { x: 0.3003, y: 0.9337 }, { x: 0.3817, y: 0.9529 }, { x: 0.458, y: 0.9641 },
    { x: 0.5344, y: 0.9641 }, { x: 0.6107, y: 0.9513 }, { x: 0.6896, y: 0.9289 }, { x: 0.7506, y: 0.8858 },
    { x: 0.8041, y: 0.8331 }, { x: 0.8422, y: 0.758 }, { x: 0.888, y: 0.6685 }, { x: 0.9109, y: 0.5807 }
  ]

  // Standard dental numbering system (FDI/ISO)
  const dentalTeeth = [
    // Upper Right Quadrant (8-1, coordinates 0-7, but in reverse order)
    { number: 8, name: 'Incisor (Central)', quadrant: 'Upper Right' },
    { number: 7, name: 'Incisor (Lateral)', quadrant: 'Upper Right' },
    { number: 6, name: 'Canine (Eye tooth / Cuspid)', quadrant: 'Upper Right' },
    { number: 5, name: 'Bicuspid (1st)', quadrant: 'Upper Right' },
    { number: 4, name: 'Bicuspid (2nd)', quadrant: 'Upper Right' },
    { number: 3, name: 'Molar (1st Molar)', quadrant: 'Upper Right' },
    { number: 2, name: 'Molar (2nd Molar)', quadrant: 'Upper Right' },
    { number: 1, name: 'Wisdom Tooth (3rd Molar)', quadrant: 'Upper Right' },
    // Upper Left Quadrant (9-16, coordinates 8-15)
    { number: 9, name: 'Incisor (Central)', quadrant: 'Upper Left' },
    { number: 10, name: 'Incisor (Lateral)', quadrant: 'Upper Left' },
    { number: 11, name: 'Canine (Eye tooth / Cuspid)', quadrant: 'Upper Left' },
    { number: 12, name: 'Bicuspid (1st)', quadrant: 'Upper Left' },
    { number: 13, name: 'Bicuspid (2nd)', quadrant: 'Upper Left' },
    { number: 14, name: 'Molar (1st Molar)', quadrant: 'Upper Left' },
    { number: 15, name: 'Molar (2nd Molar)', quadrant: 'Upper Left' },
    { number: 16, name: 'Wisdom Tooth (3rd Molar)', quadrant: 'Upper Left' },
    // Lower Left Quadrant (17-24, coordinates 16-23)
    { number: 17, name: 'Wisdom Tooth (3rd Molar)', quadrant: 'Lower Left' },
    { number: 18, name: 'Molar (2nd Molar)', quadrant: 'Lower Left' },
    { number: 19, name: 'Molar (1st Molar)', quadrant: 'Lower Left' },
    { number: 20, name: 'Bicuspid (2nd)', quadrant: 'Lower Left' },
    { number: 21, name: 'Bicuspid (1st)', quadrant: 'Lower Left' },
    { number: 22, name: 'Canine (Eye tooth / Cuspid)', quadrant: 'Lower Left' },
    { number: 23, name: 'Incisor (Lateral)', quadrant: 'Lower Left' },
    { number: 24, name: 'Incisor (Central)', quadrant: 'Lower Left' },
    // Lower Right Quadrant (25-32, coordinates 24-31)
    { number: 25, name: 'Incisor (Central)', quadrant: 'Lower Right' },
    { number: 26, name: 'Incisor (Lateral)', quadrant: 'Lower Right' },
    { number: 27, name: 'Canine (Eye tooth / Cuspid)', quadrant: 'Lower Right' },
    { number: 28, name: 'Bicuspid (1st)', quadrant: 'Lower Right' },
    { number: 29, name: 'Bicuspid (2nd)', quadrant: 'Lower Right' },
    { number: 30, name: 'Molar (1st Molar)', quadrant: 'Lower Right' },
    { number: 31, name: 'Molar (2nd Molar)', quadrant: 'Lower Right' },
    { number: 32, name: 'Wisdom Tooth (3rd Molar)', quadrant: 'Lower Right' },
  ]

  const getToothInfo = (index) => {
    return dentalTeeth[index] || { number: index + 1, name: 'Unknown', quadrant: 'Unknown' }
  }

  const [mappings, setMappings] = useState({})
  const [selectedCoordinate, setSelectedCoordinate] = useState(null)
  const [assignedToothNumber, setAssignedToothNumber] = useState('')
  const [imageName, setImageName] = useState('')
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const imageRef = React.useRef(null)

  // Track which tooth number is assigned to which coordinate
  const [coordinateToToothMapping, setCoordinateToToothMapping] = useState({})

  // Available tooth image names (filesystem-safe) with upper/lower distinction
  const toothImageNames = [
    'incisor-central-upper',
    'incisor-lateral-upper',
    'canine-eye-tooth-cuspid-upper',
    'bicuspid-1st-upper',
    'bicuspid-2nd-upper',
    'molar-1st-molar-upper',
    'molar-2nd-molar-upper',
    'wisdom-tooth-3rd-molar-upper',
    'incisor-central-lower',
    'incisor-lateral-lower',
    'canine-eye-tooth-cuspid-lower',
    'bicuspid-1st-lower',
    'bicuspid-2nd-lower',
    'molar-1st-molar-lower',
    'molar-2nd-molar-lower',
    'wisdom-tooth-3rd-molar-lower'
  ]

  // Helper to get image name from tooth number (with upper/lower distinction)
  const getImageNameFromToothNumber = (toothNumber) => {
    const toothInfo = dentalTeeth.find(t => t.number === toothNumber)
    if (!toothInfo) return null
    
    // Convert tooth name to filesystem-safe name
    const baseName = toothInfo.name
      .toLowerCase()
      .replace(/[()]/g, '')
      .replace(/\s+/g, '-')
      .replace(/\//g, '-')
    
    // Add upper/lower suffix based on quadrant
    const isUpper = toothInfo.quadrant.includes('Upper')
    return `${baseName}-${isUpper ? 'upper' : 'lower'}`
  }

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight
      })
    }
  }

  const handleCoordinateClick = (coordinateIndex) => {
    setSelectedCoordinate(coordinateIndex)
    setAssignedToothNumber(coordinateToToothMapping[coordinateIndex] || '')
    const toothNum = coordinateToToothMapping[coordinateIndex]
    if (toothNum) {
      const imgName = getImageNameFromToothNumber(toothNum)
      setImageName(imgName || mappings[coordinateIndex] || '')
    } else {
      setImageName(mappings[coordinateIndex] || '')
    }
  }

  const handleToothNumberSelect = (e) => {
    const toothNumber = e.target.value ? parseInt(e.target.value) : ''
    setAssignedToothNumber(toothNumber)
    if (selectedCoordinate !== null) {
      setCoordinateToToothMapping({
        ...coordinateToToothMapping,
        [selectedCoordinate]: toothNumber
      })
    }
  }

  const handleImageNameChange = (e) => {
    const value = e.target.value
    setImageName(value)
    if (selectedCoordinate !== null) {
      setMappings({
        ...mappings,
        [selectedCoordinate]: value
      })
    }
  }

  // Auto-update image name when tooth number changes
  useEffect(() => {
    if (assignedToothNumber && selectedCoordinate !== null) {
      const imgName = getImageNameFromToothNumber(parseInt(assignedToothNumber))
      if (imgName) {
        setImageName(imgName)
        setMappings({
          ...mappings,
          [selectedCoordinate]: imgName
        })
      }
    }
  }, [assignedToothNumber, selectedCoordinate])

  const clearMapping = (coordinateIndex) => {
    const newMappings = { ...mappings }
    const newToothMapping = { ...coordinateToToothMapping }
    delete newMappings[coordinateIndex]
    delete newToothMapping[coordinateIndex]
    setMappings(newMappings)
    setCoordinateToToothMapping(newToothMapping)
    if (selectedCoordinate === coordinateIndex) {
      setSelectedCoordinate(null)
      setImageName('')
      setAssignedToothNumber('')
    }
  }

  const clearAll = () => {
    setMappings({})
    setCoordinateToToothMapping({})
    setSelectedCoordinate(null)
    setImageName('')
    setAssignedToothNumber('')
  }

  const exportMappings = () => {
    const data = {
      mappings: Object.keys(mappings).map(key => {
        const coordinateIndex = parseInt(key)
        const assignedTooth = coordinateToToothMapping[coordinateIndex]
        const toothInfo = assignedTooth ? dentalTeeth.find(t => t.number === assignedTooth) : null
        return {
          coordinateIndex: coordinateIndex,
          assignedToothNumber: assignedTooth || null,
          assignedToothName: toothInfo ? toothInfo.name : null,
          assignedQuadrant: toothInfo ? toothInfo.quadrant : null,
          imageNumber: mappings[key]
        }
      }),
      fullMapping: mappings,
      coordinateToToothMapping: coordinateToToothMapping,
      imageMapping: Object.keys(mappings).reduce((acc, key) => {
        const assignedTooth = coordinateToToothMapping[key]
        if (assignedTooth) {
          acc[assignedTooth] = mappings[key]
        }
        return acc
      }, {})
    }
    const json = JSON.stringify(data, null, 2)
    
    // Copy to clipboard
    navigator.clipboard.writeText(json)
    alert('Mapping data copied to clipboard!')
    
    // Also download as file
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'tooth-mappings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const getMappedCount = () => {
    return Object.keys(mappings).length
  }

  const getToothForCoordinate = (coordinateIndex) => {
    const assignedTooth = coordinateToToothMapping[coordinateIndex]
    if (assignedTooth) {
      return dentalTeeth.find(t => t.number === assignedTooth)
    }
    return null
  }

  return (
    <div className="tooth-mapper-container">
      <div className="mapper-header">
        <h2>Tooth Image Mapper</h2>
        <p>Click on a tooth to assign it a tooth number and image</p>
        <div className="mapper-stats">
          <span>Mapped: {getMappedCount()} / 32</span>
        </div>
        <div className="mapper-controls">
          <button onClick={clearAll} disabled={getMappedCount() === 0}>
            Clear All
          </button>
          <button onClick={exportMappings} disabled={getMappedCount() === 0} className="export-btn">
            Export Mappings
          </button>
        </div>
      </div>

      <div className="mapper-main">
        <div className="mapper-image-section">
          <div className="mapper-image-wrapper">
            <img
              ref={imageRef}
              src={`${import.meta.env.BASE_URL}dental-schema.png`}
              alt="Dental chart"
              className="mapper-image"
              onLoad={handleImageLoad}
            />
            {imageDimensions.width > 0 && coordinates.map((coord, coordinateIndex) => {
              const x = coord.x * imageDimensions.width
              const y = coord.y * imageDimensions.height
              const isSelected = selectedCoordinate === coordinateIndex
              const isMapped = mappings[coordinateIndex]
              const assignedTooth = getToothForCoordinate(coordinateIndex)
              
              return (
                <div
                  key={coordinateIndex}
                  className={`tooth-marker ${isSelected ? 'selected' : ''} ${isMapped ? 'mapped' : ''}`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                  }}
                  onClick={() => handleCoordinateClick(coordinateIndex)}
                  title={`Coordinate ${coordinateIndex}${assignedTooth ? ` → Tooth ${assignedTooth.number}: ${assignedTooth.name} (${assignedTooth.quadrant})` : ''}${isMapped ? ` - Image: ${isMapped}` : ''}`}
                >
                  <span className="marker-number">{assignedTooth ? assignedTooth.number : coordinateIndex + 1}</span>
                  {isMapped && <span className="marker-check">✓</span>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mapper-control-panel">
          {selectedCoordinate !== null ? (
            <div className="tooth-assignment">
              <h3>Assign Tooth & Image to Coordinate</h3>
              <div className="tooth-info-box">
                <div className="coordinate-label">Coordinate Position: {selectedCoordinate}</div>
              </div>
              
              <div className="assignment-section">
                <label>Assign Tooth Number:</label>
                <select
                  className="tooth-select"
                  value={assignedToothNumber || ''}
                  onChange={handleToothNumberSelect}
                >
                  <option value="">-- Select tooth number --</option>
                  {dentalTeeth.map((tooth) => (
                    <option key={tooth.number} value={tooth.number}>
                      {tooth.number} - {tooth.name} ({tooth.quadrant})
                    </option>
                  ))}
                </select>
                {assignedToothNumber && (
                  <div className="assigned-tooth-info">
                    <strong>Assigned:</strong> Tooth #{assignedToothNumber} - {dentalTeeth.find(t => t.number === parseInt(assignedToothNumber))?.name} ({dentalTeeth.find(t => t.number === parseInt(assignedToothNumber))?.quadrant})
                  </div>
                )}
              </div>
              <div className="image-input-section">
                <label>Tooth Image Name:</label>
                <select
                  value={imageName}
                  onChange={handleImageNameChange}
                  className="image-name-select"
                >
                  <option value="">-- Select tooth image --</option>
                  {toothImageNames.map((name) => (
                    <option key={name} value={name}>
                      {name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                <p className="input-hint">
                  Select the tooth type image (auto-filled when tooth number is selected)
                </p>
                {mappings[selectedCoordinate] && (
                  <div className="preview-image">
                    <img
                      src={`/${mappings[selectedCoordinate]}.png`}
                      alt={`Coordinate ${selectedCoordinate} preview`}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                    <div className="preview-error" style={{ display: 'none' }}>
                      Image not found
                    </div>
                  </div>
                )}
              </div>
              <div className="assignment-actions">
                <button
                  onClick={() => clearMapping(selectedCoordinate)}
                  disabled={!mappings[selectedCoordinate] && !coordinateToToothMapping[selectedCoordinate]}
                  className="clear-btn"
                >
                  Clear Mapping
                </button>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Click on a tooth marker to assign an image number</p>
            </div>
          )}

          <div className="mappings-list">
            <h3>Current Mappings ({getMappedCount()})</h3>
            {getMappedCount() === 0 ? (
              <p className="no-mappings">No mappings yet</p>
            ) : (
              <div className="mappings-items">
                {Object.keys(mappings)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((index) => (
                    <div
                      key={index}
                      className={`mapping-item ${selectedCoordinate === parseInt(index) ? 'active' : ''}`}
                      onClick={() => handleCoordinateClick(parseInt(index))}
                    >
                      <span className="mapping-coordinate">Coord {parseInt(index)}</span>
                      {coordinateToToothMapping[index] ? (
                        <>
                          <span className="mapping-number">→ Tooth #{coordinateToToothMapping[index]}</span>
                          <span className="mapping-name">{dentalTeeth.find(t => t.number === coordinateToToothMapping[index])?.name}</span>
                        </>
                      ) : (
                        <span className="mapping-name">No tooth assigned</span>
                      )}
                      {mappings[index] && (
                        <span className="mapping-image">→ {mappings[index].replace(/-/g, ' ')}</span>
                      )}
                      <button
                        className="mapping-remove"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearMapping(parseInt(index))
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToothMapper
