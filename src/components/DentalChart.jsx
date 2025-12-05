import React, { useState, useRef, useEffect } from 'react'
import './DentalChart.css'

const DentalChart = () => {
  const [selectedTooth, setSelectedTooth] = useState(null)
  const [hoveredTooth, setHoveredTooth] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toothOperations, setToothOperations] = useState({}) // Store operations for each tooth
  const imageRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [fullImageDimensions, setFullImageDimensions] = useState({ width: 0, height: 0 })

  // Tooth definitions with exact coordinates provided by user
  // Coordinates are relative (0-1) within the cropped mouth image
  // Order: Upper jaw left to right (16 teeth), then Lower jaw left to right (16 teeth)
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

  // Mapping data from user
  const coordinateToToothMapping = {
    0: 8, 1: 9, 2: 10, 3: 11, 4: 12, 5: 13, 6: 14, 7: 15, 8: 16,
    9: 7, 10: 6, 11: 5, 12: 4, 13: 3, 14: 2, 15: 1,
    16: 32, 17: 31, 18: 30, 19: 29, 20: 28, 21: 27, 22: 26, 23: 25,
    24: 24, 25: 23, 26: 22, 27: 21, 28: 20, 29: 19, 30: 18, 31: 17
  }

  // Mapping tooth number to image filename (using tooth names with upper/lower distinction)
  const imageMapping = {
    // Upper Right Quadrant (8-1)
    1: "wisdom-tooth-3rd-molar-upper",
    2: "molar-2nd-molar-upper",
    3: "molar-1st-molar-upper",
    4: "bicuspid-2nd-upper",
    5: "bicuspid-1st-upper",
    6: "canine-eye-tooth-cuspid-upper",
    7: "incisor-lateral-upper",
    8: "incisor-central-upper",
    // Upper Left Quadrant (9-16)
    9: "incisor-central-upper",
    10: "incisor-lateral-upper",
    11: "canine-eye-tooth-cuspid-upper",
    12: "bicuspid-1st-upper",
    13: "bicuspid-2nd-upper",
    14: "molar-1st-molar-upper",
    15: "molar-2nd-molar-upper",
    16: "wisdom-tooth-3rd-molar-upper",
    // Lower Left Quadrant (17-24)
    17: "wisdom-tooth-3rd-molar-lower",
    18: "molar-2nd-molar-lower",
    19: "molar-1st-molar-lower",
    20: "bicuspid-2nd-lower",
    21: "bicuspid-1st-lower",
    22: "canine-eye-tooth-cuspid-lower",
    23: "incisor-lateral-lower",
    24: "incisor-central-lower",
    // Lower Right Quadrant (25-32)
    25: "incisor-central-lower",
    26: "incisor-lateral-lower",
    27: "canine-eye-tooth-cuspid-lower",
    28: "bicuspid-1st-lower",
    29: "bicuspid-2nd-lower",
    30: "molar-1st-molar-lower",
    31: "molar-2nd-molar-lower",
    32: "wisdom-tooth-3rd-molar-lower"
  }

  // Dental tooth information
  const dentalTeeth = [
    { number: 8, name: 'Incisor (Central)', quadrant: 'Upper Right', type: 'incisor' },
    { number: 7, name: 'Incisor (Lateral)', quadrant: 'Upper Right', type: 'incisor' },
    { number: 6, name: 'Canine (Eye tooth / Cuspid)', quadrant: 'Upper Right', type: 'canine' },
    { number: 5, name: 'Bicuspid (1st)', quadrant: 'Upper Right', type: 'premolar' },
    { number: 4, name: 'Bicuspid (2nd)', quadrant: 'Upper Right', type: 'premolar' },
    { number: 3, name: 'Molar (1st Molar)', quadrant: 'Upper Right', type: 'molar' },
    { number: 2, name: 'Molar (2nd Molar)', quadrant: 'Upper Right', type: 'molar' },
    { number: 1, name: 'Wisdom Tooth (3rd Molar)', quadrant: 'Upper Right', type: 'molar' },
    { number: 9, name: 'Incisor (Central)', quadrant: 'Upper Left', type: 'incisor' },
    { number: 10, name: 'Incisor (Lateral)', quadrant: 'Upper Left', type: 'incisor' },
    { number: 11, name: 'Canine (Eye tooth / Cuspid)', quadrant: 'Upper Left', type: 'canine' },
    { number: 12, name: 'Bicuspid (1st)', quadrant: 'Upper Left', type: 'premolar' },
    { number: 13, name: 'Bicuspid (2nd)', quadrant: 'Upper Left', type: 'premolar' },
    { number: 14, name: 'Molar (1st Molar)', quadrant: 'Upper Left', type: 'molar' },
    { number: 15, name: 'Molar (2nd Molar)', quadrant: 'Upper Left', type: 'molar' },
    { number: 16, name: 'Wisdom Tooth (3rd Molar)', quadrant: 'Upper Left', type: 'molar' },
    { number: 17, name: 'Wisdom Tooth (3rd Molar)', quadrant: 'Lower Left', type: 'molar' },
    { number: 18, name: 'Molar (2nd Molar)', quadrant: 'Lower Left', type: 'molar' },
    { number: 19, name: 'Molar (1st Molar)', quadrant: 'Lower Left', type: 'molar' },
    { number: 20, name: 'Bicuspid (2nd)', quadrant: 'Lower Left', type: 'premolar' },
    { number: 21, name: 'Bicuspid (1st)', quadrant: 'Lower Left', type: 'premolar' },
    { number: 22, name: 'Canine (Eye tooth / Cuspid)', quadrant: 'Lower Left', type: 'canine' },
    { number: 23, name: 'Incisor (Lateral)', quadrant: 'Lower Left', type: 'incisor' },
    { number: 24, name: 'Incisor (Central)', quadrant: 'Lower Left', type: 'incisor' },
    { number: 25, name: 'Incisor (Central)', quadrant: 'Lower Right', type: 'incisor' },
    { number: 26, name: 'Incisor (Lateral)', quadrant: 'Lower Right', type: 'incisor' },
    { number: 27, name: 'Canine (Eye tooth / Cuspid)', quadrant: 'Lower Right', type: 'canine' },
    { number: 28, name: 'Bicuspid (1st)', quadrant: 'Lower Right', type: 'premolar' },
    { number: 29, name: 'Bicuspid (2nd)', quadrant: 'Lower Right', type: 'premolar' },
    { number: 30, name: 'Molar (1st Molar)', quadrant: 'Lower Right', type: 'molar' },
    { number: 31, name: 'Molar (2nd Molar)', quadrant: 'Lower Right', type: 'molar' },
    { number: 32, name: 'Wisdom Tooth (3rd Molar)', quadrant: 'Lower Right', type: 'molar' },
  ]

  const getToothInfo = (toothNumber) => {
    return dentalTeeth.find(t => t.number === toothNumber) || null
  }

  const getColorForType = (type) => {
    switch(type) {
      case 'incisor': return '#9B59B6'
      case 'canine': return '#FF6B9D'
      case 'premolar': return '#E74C3C'
      case 'molar': return '#4A90E2'
      default: return '#95a5a6'
    }
  }

  // Build teeth array from coordinates and mappings
  const teeth = coordinates.map((coord, index) => {
    const toothNumber = coordinateToToothMapping[index]
    const toothInfo = getToothInfo(toothNumber)
    return {
      id: `tooth-${toothNumber}`,
      coordinateIndex: index,
      toothNumber: toothNumber,
      name: toothInfo ? toothInfo.name : `Tooth ${toothNumber}`,
      type: toothInfo ? toothInfo.type : 'unknown',
      quadrant: toothInfo ? toothInfo.quadrant : 'Unknown',
      position: coord,
      size: { width: 0.05, height: 0.08 },
      color: toothInfo ? getColorForType(toothInfo.type) : '#95a5a6'
    }
  })

  const teeth_old = [
    // Upper jaw - from left to right
    { id: 'upper-molar-1', name: 'Upper Molar 1', type: 'molar', position: coordinates[0], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'upper-molar-2', name: 'Upper Molar 2', type: 'molar', position: coordinates[1], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'upper-molar-3', name: 'Upper Molar 3', type: 'molar', position: coordinates[2], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'upper-premolar-1', name: 'Upper Premolar 1', type: 'premolar', position: coordinates[3], size: { width: 0.07, height: 0.10 }, color: '#E74C3C' },
    { id: 'upper-premolar-2', name: 'Upper Premolar 2', type: 'premolar', position: coordinates[4], size: { width: 0.07, height: 0.10 }, color: '#E74C3C' },
    { id: 'upper-canine-1', name: 'Upper Canine 1', type: 'canine', position: coordinates[5], size: { width: 0.06, height: 0.10 }, color: '#FF6B9D' },
    { id: 'upper-incisor-1', name: 'Upper Incisor 1', type: 'incisor', position: coordinates[6], size: { width: 0.05, height: 0.08 }, color: '#9B59B6' },
    { id: 'upper-incisor-2', name: 'Upper Incisor 2', type: 'incisor', position: coordinates[7], size: { width: 0.05, height: 0.08 }, color: '#9B59B6' },
    { id: 'upper-incisor-3', name: 'Upper Incisor 3', type: 'incisor', position: coordinates[8], size: { width: 0.05, height: 0.08 }, color: '#9B59B6' },
    { id: 'upper-incisor-4', name: 'Upper Incisor 4', type: 'incisor', position: coordinates[9], size: { width: 0.05, height: 0.08 }, color: '#9B59B6' },
    { id: 'upper-canine-2', name: 'Upper Canine 2', type: 'canine', position: coordinates[10], size: { width: 0.06, height: 0.10 }, color: '#FF6B9D' },
    { id: 'upper-premolar-3', name: 'Upper Premolar 3', type: 'premolar', position: coordinates[11], size: { width: 0.07, height: 0.10 }, color: '#E74C3C' },
    { id: 'upper-premolar-4', name: 'Upper Premolar 4', type: 'premolar', position: coordinates[12], size: { width: 0.07, height: 0.10 }, color: '#E74C3C' },
    { id: 'upper-molar-4', name: 'Upper Molar 4', type: 'molar', position: coordinates[13], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'upper-molar-5', name: 'Upper Molar 5', type: 'molar', position: coordinates[14], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'upper-molar-6', name: 'Upper Molar 6', type: 'molar', position: coordinates[15], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    
    // Lower jaw - from left to right
    { id: 'lower-molar-1', name: 'Lower Molar 1', type: 'molar', position: coordinates[16], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'lower-molar-2', name: 'Lower Molar 2', type: 'molar', position: coordinates[17], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'lower-molar-3', name: 'Lower Molar 3', type: 'molar', position: coordinates[18], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'lower-premolar-1', name: 'Lower Premolar 1', type: 'premolar', position: coordinates[19], size: { width: 0.07, height: 0.10 }, color: '#E74C3C' },
    { id: 'lower-premolar-2', name: 'Lower Premolar 2', type: 'premolar', position: coordinates[20], size: { width: 0.07, height: 0.10 }, color: '#E74C3C' },
    { id: 'lower-canine-1', name: 'Lower Canine 1', type: 'canine', position: coordinates[21], size: { width: 0.06, height: 0.10 }, color: '#FF6B9D' },
    { id: 'lower-incisor-1', name: 'Lower Incisor 1', type: 'incisor', position: coordinates[22], size: { width: 0.05, height: 0.08 }, color: '#9B59B6' },
    { id: 'lower-incisor-2', name: 'Lower Incisor 2', type: 'incisor', position: coordinates[23], size: { width: 0.05, height: 0.08 }, color: '#9B59B6' },
    { id: 'lower-incisor-3', name: 'Lower Incisor 3', type: 'incisor', position: coordinates[24], size: { width: 0.05, height: 0.08 }, color: '#9B59B6' },
    { id: 'lower-incisor-4', name: 'Lower Incisor 4', type: 'incisor', position: coordinates[25], size: { width: 0.05, height: 0.08 }, color: '#9B59B6' },
    { id: 'lower-canine-2', name: 'Lower Canine 2', type: 'canine', position: coordinates[26], size: { width: 0.06, height: 0.10 }, color: '#FF6B9D' },
    { id: 'lower-premolar-3', name: 'Lower Premolar 3', type: 'premolar', position: coordinates[27], size: { width: 0.07, height: 0.10 }, color: '#E74C3C' },
    { id: 'lower-premolar-4', name: 'Lower Premolar 4', type: 'premolar', position: coordinates[28], size: { width: 0.07, height: 0.10 }, color: '#E74C3C' },
    { id: 'lower-molar-4', name: 'Lower Molar 4', type: 'molar', position: coordinates[29], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'lower-molar-5', name: 'Lower Molar 5', type: 'molar', position: coordinates[30], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
    { id: 'lower-molar-6', name: 'Lower Molar 6', type: 'molar', position: coordinates[31], size: { width: 0.08, height: 0.12 }, color: '#4A90E2' },
  ] // Old teeth array - kept for reference, now using dynamic teeth array above

  const handleFullImageLoad = () => {
    if (imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight
      
      setFullImageDimensions({
        width: naturalWidth,
        height: naturalHeight
      })
      
      // Calculate displayed dimensions based on actual rendered size
      // Use getBoundingClientRect for accurate mobile dimensions
      const rect = imageRef.current.getBoundingClientRect()
      const displayedWidth = rect.width || imageRef.current.offsetWidth || naturalWidth
      
      // Calculate displayed height based on aspect ratio
      const aspectRatio = naturalHeight / naturalWidth
      const displayedHeight = displayedWidth * aspectRatio
      
      setImageDimensions({
        width: displayedWidth,
        height: displayedHeight
      })
      setImageLoaded(true)
    }
  }

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (imageRef.current && fullImageDimensions.width > 0) {
        // Use getBoundingClientRect for accurate dimensions on mobile
        const rect = imageRef.current.getBoundingClientRect()
        const displayedWidth = rect.width || imageRef.current.offsetWidth || fullImageDimensions.width
        
        // Calculate displayed height based on aspect ratio
        const aspectRatio = fullImageDimensions.height / fullImageDimensions.width
        const displayedHeight = displayedWidth * aspectRatio
        
        if (displayedWidth > 0 && displayedHeight > 0) {
          setImageDimensions({
            width: displayedWidth,
            height: displayedHeight
          })
          setImageLoaded(true)
        }
      }
    }

    // Small delay to ensure layout is complete
    const timer = setTimeout(updateDimensions, 100)
    window.addEventListener('resize', updateDimensions)
    // Also listen for orientation changes on mobile
    window.addEventListener('orientationchange', updateDimensions)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('orientationchange', updateDimensions)
    }
  }, [fullImageDimensions])

  const handleToothClick = (tooth) => {
    setSelectedTooth(tooth)
  }

  // Base path for assets (Vite provides this automatically)
  const basePath = import.meta.env.BASE_URL

  // Get the image file path for a tooth based on the mapping
  const getToothImagePath = (tooth) => {
    const toothNumber = tooth.toothNumber
    const imageName = imageMapping[toothNumber]
    if (imageName) {
      return `${basePath}${imageName}.png`
    }
    return null
  }

  // Get the tooth type image path
  const getToothTypeImagePath = (toothType) => {
    const typeMap = {
      'incisor': 'incisor.png',
      'canine': 'canine.png',
      'premolar': 'premolar.png',
      'molar': 'molar.png'
    }
    const fileName = typeMap[toothType]
    return fileName ? `${basePath}${fileName}` : null
  }

  return (
    <div className="dental-chart-container">
      <div className="chart-main">
        <div className="mouth-image-wrapper">
          <div className="mouth-image-wrapper-inner" onDragStart={(e) => e.preventDefault()}>
            {/* Mouth image - already cropped, no CSS cropping needed */}
            <img
              ref={imageRef}
              src={`${import.meta.env.BASE_URL}dental-schema.png`}
              alt="Dental chart showing all teeth"
              className="mouth-image"
              onLoad={handleFullImageLoad}
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
              onMouseDown={(e) => e.preventDefault()}
            />
            {/* Hover/Selected preview of individual tooth image */}
            {(hoveredTooth || selectedTooth) && imageDimensions.width > 0 && (
              <div className="tooth-hover-preview">
                <img
                  src={getToothImagePath(hoveredTooth || selectedTooth)}
                  alt={`Preview: ${(hoveredTooth || selectedTooth).name}`}
                  className="tooth-hover-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
          {/* Always visible coordinate markers */}
          {imageLoaded && imageDimensions.width > 0 && (
            <div 
              className="coordinate-markers"
              style={{
                width: `${imageDimensions.width}px`,
                height: `${imageDimensions.height}px`
              }}
            >
              {teeth.map((tooth, index) => {
                const x = tooth.position.x * imageDimensions.width
                const y = tooth.position.y * imageDimensions.height
                const isSelected = selectedTooth && selectedTooth.toothNumber === tooth.toothNumber
                return (
                  <div
                    key={`coord-${index}`}
                    className={`coordinate-marker ${isSelected ? 'selected' : ''}`}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      backgroundColor: tooth.color,
                      borderColor: 'white',
                    }}
                    onClick={() => handleToothClick(tooth)}
                    onMouseEnter={() => setHoveredTooth(tooth)}
                    onMouseLeave={() => setHoveredTooth(null)}
                    onTouchStart={() => {
                      setHoveredTooth(tooth)
                      handleToothClick(tooth)
                    }}
                    title={`Tooth ${tooth.toothNumber}: ${tooth.name} (${tooth.quadrant})`}
                  />
                )
              })}
            </div>
          )}
          {/* Clickable areas positioned exactly on each tooth */}
          {imageLoaded && imageDimensions.width > 0 && (
            <div 
              className="tooth-click-areas"
              style={{
                width: `${imageDimensions.width}px`,
                height: `${imageDimensions.height}px`
              }}
            >
              {teeth.map((tooth) => {
                // Calculate position and size based on the displayed (cropped) image dimensions
                const x = tooth.position.x * imageDimensions.width
                const y = tooth.position.y * imageDimensions.height
                const width = (tooth.size?.width || 0.05) * imageDimensions.width
                const height = (tooth.size?.height || 0.08) * imageDimensions.height
                
                return (
                  <div
                    key={tooth.id}
                    className="tooth-click-area"
                    style={{
                      left: `${x - width / 2}px`,
                      top: `${y - height / 2}px`,
                      width: `${width}px`,
                      height: `${height}px`,
                      backgroundColor: tooth.color,
                    }}
                    onClick={() => handleToothClick(tooth)}
                    onMouseEnter={() => setHoveredTooth(tooth)}
                    onMouseLeave={() => setHoveredTooth(null)}
                    onTouchStart={() => {
                      setHoveredTooth(tooth)
                      handleToothClick(tooth)
                    }}
                    title={tooth.name}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {selectedTooth && (
        <div className="tooth-detail-panel">
          <div className="tooth-detail-header">
            <div className="tooth-header-content">
              <div className="tooth-header-left">
                {getToothTypeImagePath(selectedTooth.type) && (
                  <img
                    src={getToothTypeImagePath(selectedTooth.type)}
                    alt={selectedTooth.type}
                    className="tooth-type-header-image"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <div className="tooth-header-text">
                  <h2 className="tooth-number-title">Tooth {selectedTooth.toothNumber}</h2>
                  <h3 className="tooth-name-title">{selectedTooth.name}</h3>
                  <p className="tooth-quadrant-title">{selectedTooth.quadrant}</p>
                </div>
              </div>
            </div>
            <button 
              className="close-button"
              onClick={() => setSelectedTooth(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="tooth-detail-content">
            <div className="tooth-operations-section">
              <button 
                className="add-operation-button"
                onClick={() => setIsModalOpen(true)}
                aria-label="Add operation"
              >
                <span className="plus-icon">+</span>
                <span>Add Operation</span>
              </button>
              {toothOperations[selectedTooth.toothNumber] && toothOperations[selectedTooth.toothNumber].length > 0 && (
                <div className="operations-list">
                  {toothOperations[selectedTooth.toothNumber].map((op, index) => (
                    <div key={index} className="operation-item">
                      <span>{op}</span>
                      <button 
                        className="remove-operation-button"
                        onClick={() => {
                          const updated = { ...toothOperations }
                          updated[selectedTooth.toothNumber] = updated[selectedTooth.toothNumber].filter((_, i) => i !== index)
                          setToothOperations(updated)
                        }}
                        aria-label="Remove operation"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Operations Modal */}
          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Select Dental Operations</h3>
                  <button 
                    className="modal-close-button"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  {[
                    'Filling',
                    'Crown',
                    'Root Canal',
                    'Extraction',
                    'Implant',
                    'Bridge',
                    'Cleaning',
                    'Whitening',
                    'Sealant',
                    'Veneer',
                    'Bonding',
                    'Gum Treatment',
                    'Orthodontic Treatment',
                    'Cavity Treatment',
                    'Tooth Restoration'
                  ].map((operation) => {
                    const currentOps = toothOperations[selectedTooth.toothNumber] || []
                    const isSelected = currentOps.includes(operation)
                    return (
                      <label key={operation} className="operation-option">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const updated = { ...toothOperations }
                            if (!updated[selectedTooth.toothNumber]) {
                              updated[selectedTooth.toothNumber] = []
                            }
                            if (e.target.checked) {
                              updated[selectedTooth.toothNumber].push(operation)
                            } else {
                              updated[selectedTooth.toothNumber] = updated[selectedTooth.toothNumber].filter(op => op !== operation)
                            }
                            setToothOperations(updated)
                          }}
                        />
                        <span>{operation}</span>
                      </label>
                    )
                  })}
                </div>
                <div className="modal-footer">
                  <button 
                    className="modal-save-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DentalChart
