# Interactive Dental Chart

An interactive React application that displays a dental chart with clickable teeth. Click on any tooth to see its detailed view.

## Features

- Interactive mouth image with clickable teeth areas
- Side panel showing selected tooth details
- Support for individual tooth images
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## How It Works

The component uses the `dental-schema.png` image which contains:
- **Left side**: Full dental arch showing all teeth
- **Right side**: Individual tooth representations in three rows:
  - Top row: Crown views only
  - Middle row: Upper jaw teeth (full with roots)
  - Bottom row: Lower jaw teeth (full with roots)

When you click on a tooth in the left panel, the component automatically crops and displays the corresponding tooth from the right panel using CSS background positioning. This eliminates the need for separate tooth image files!

## Adjusting Tooth Crop Positions

If the cropped tooth images don't align perfectly, you can adjust the crop coordinates in `src/components/DentalChart.jsx` in the `getToothCropCoordinates` function. The key parameters to adjust are:

- `leftPanelWidth`: Width of the left panel (dental arch) - default 55%
- `topRowY`, `middleRowY`, `bottomRowY`: Vertical positions of the three rows
- `topRowHeight`, `middleRowHeight`, `bottomRowHeight`: Heights of each row
- Tooth index mapping: How each tooth maps to its position in the row (0-7)

## Tooth IDs

The application recognizes the following tooth IDs:

**Upper Jaw:**
- `upper-molar-1` through `upper-molar-6`
- `upper-premolar-1` through `upper-premolar-4`
- `upper-canine-1`, `upper-canine-2`
- `upper-incisor-1` through `upper-incisor-4`

**Lower Jaw:**
- `lower-molar-1` through `lower-molar-6`
- `lower-premolar-1` through `lower-premolar-4`
- `lower-canine-1`, `lower-canine-2`
- `lower-incisor-1` through `lower-incisor-4`

## Adjusting Tooth Positions

If the clickable areas don't align perfectly with the teeth in your image, you can adjust the positions in `src/components/DentalChart.jsx`. The positions are defined as relative coordinates (0-1) in the `teeth` array.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.
