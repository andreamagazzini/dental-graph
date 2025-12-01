import React, { useState, useRef, useEffect } from 'react'
import './ImageCropper.css'

const ImageCropper = () => {
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selection, setSelection] = useState(null)
  const [startPoint, setStartPoint] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const getMousePos = (e) => {
    if (!containerRef.current) return { x: 0, y: 0 }
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleMouseDown = (e) => {
    if (!imageLoaded) return
    const pos = getMousePos(e)
    setIsSelecting(true)
    setStartPoint(pos)
    setSelection({ x: pos.x, y: pos.y, width: 0, height: 0 })
  }

  const handleMouseMove = (e) => {
    if (!isSelecting || !startPoint) return
    const pos = getMousePos(e)
    const width = pos.x - startPoint.x
    const height = pos.y - startPoint.y
    
    setSelection({
      x: width < 0 ? pos.x : startPoint.x,
      y: height < 0 ? pos.y : startPoint.y,
      width: Math.abs(width),
      height: Math.abs(height)
    })
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
    if (selection && selection.width > 10 && selection.height > 10) {
      generatePreview()
    }
  }

  const generatePreview = () => {
    if (!imageRef.current || !selection) return

    const img = imageRef.current
    const canvas = canvasRef.current
    if (!canvas) return

    const scaleX = img.naturalWidth / img.offsetWidth
    const scaleY = img.naturalHeight / img.offsetHeight

    const cropX = selection.x * scaleX
    const cropY = selection.y * scaleY
    const cropWidth = selection.width * scaleX
    const cropHeight = selection.height * scaleY

    canvas.width = cropWidth
    canvas.height = cropHeight

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, cropWidth, cropHeight)
    
    // Draw the cropped portion
    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    )

    // Convert to data URL for preview
    const dataUrl = canvas.toDataURL('image/png')
    setPreview(dataUrl)
  }

  const downloadCrop = () => {
    if (!preview) return

    const link = document.createElement('a')
    link.download = 'dental-crop.png'
    link.href = preview
    link.click()
  }

  const clearSelection = () => {
    setSelection(null)
    setPreview(null)
    setStartPoint(null)
  }

  const formatSelectionInfo = () => {
    if (!selection || !imageRef.current) return null

    const img = imageRef.current
    const scaleX = img.naturalWidth / img.offsetWidth
    const scaleY = img.naturalHeight / img.offsetHeight

    return {
      x: Math.round(selection.x * scaleX),
      y: Math.round(selection.y * scaleY),
      width: Math.round(selection.width * scaleX),
      height: Math.round(selection.height * scaleY),
      relativeX: (selection.x / img.offsetWidth).toFixed(4),
      relativeY: (selection.y / img.offsetHeight).toFixed(4),
      relativeWidth: (selection.width / img.offsetWidth).toFixed(4),
      relativeHeight: (selection.height / img.offsetHeight).toFixed(4)
    }
  }

  useEffect(() => {
    if (selection && selection.width > 10 && selection.height > 10 && !isSelecting) {
      generatePreview()
    }
  }, [selection, isSelecting])

  const selectionInfo = formatSelectionInfo()

  return (
    <div className="image-cropper-container">
      <div className="cropper-header">
        <h2>Image Cropper</h2>
        <p>Click and drag on the image to select the area you want to crop</p>
        <div className="cropper-controls">
          <button onClick={clearSelection} disabled={!selection}>
            Clear Selection
          </button>
          <button onClick={downloadCrop} disabled={!preview} className="download-btn">
            Download Cropped Image
          </button>
        </div>
      </div>

      <div className="cropper-main">
        <div className="cropper-image-section">
          <div
            ref={containerRef}
            className="cropper-image-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={`${import.meta.env.BASE_URL}dental-schema_full.png`}
              alt="Dental schema"
              className="cropper-image"
              onLoad={handleImageLoad}
            />
            {selection && (
              <div
                className="selection-box"
                style={{
                  left: `${selection.x}px`,
                  top: `${selection.y}px`,
                  width: `${selection.width}px`,
                  height: `${selection.height}px`,
                }}
              >
                <div className="selection-handle handle-nw"></div>
                <div className="selection-handle handle-ne"></div>
                <div className="selection-handle handle-sw"></div>
                <div className="selection-handle handle-se"></div>
              </div>
            )}
          </div>
          {selectionInfo && (
            <div className="selection-info">
              <h3>Selection Info</h3>
              <div className="info-grid">
                <div>
                  <strong>Position:</strong> {selectionInfo.x}px, {selectionInfo.y}px
                </div>
                <div>
                  <strong>Size:</strong> {selectionInfo.width}px × {selectionInfo.height}px
                </div>
                <div>
                  <strong>Relative Position:</strong> ({selectionInfo.relativeX}, {selectionInfo.relativeY})
                </div>
                <div>
                  <strong>Relative Size:</strong> {selectionInfo.relativeWidth} × {selectionInfo.relativeHeight}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="cropper-preview-section">
          <h3>Preview</h3>
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Cropped preview" className="preview-image" />
              <div className="preview-info">
                <p>Ready to download!</p>
                <p className="preview-size">
                  {selectionInfo?.width}px × {selectionInfo?.height}px
                </p>
              </div>
            </div>
          ) : (
            <div className="preview-placeholder">
              <p>Select an area on the image to see the preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default ImageCropper
