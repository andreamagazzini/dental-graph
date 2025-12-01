#!/bin/bash

# Script to rename all 16 tooth images with upper/lower distinction
# Run this AFTER recovering the deleted files from Trash

cd /Users/andreamagazzini/dev/dental-graph/public

# Upper jaw images (1-8) -> add -upper suffix
# Lower jaw images (9-16) -> add -lower suffix

echo "Renaming upper jaw images (1-8)..."
mv "dental-crop (1).png" "incisor-central-upper.png" 2>/dev/null && echo "  ✓ Renamed 1 -> incisor-central-upper.png" || echo "  ✗ File 1 not found"
mv "dental-crop (2).png" "incisor-lateral-upper.png" 2>/dev/null && echo "  ✓ Renamed 2 -> incisor-lateral-upper.png" || echo "  ✗ File 2 not found"
mv "dental-crop (3).png" "canine-eye-tooth-cuspid-upper.png" 2>/dev/null && echo "  ✓ Renamed 3 -> canine-eye-tooth-cuspid-upper.png" || echo "  ✗ File 3 not found"
mv "dental-crop (4).png" "bicuspid-1st-upper.png" 2>/dev/null && echo "  ✓ Renamed 4 -> bicuspid-1st-upper.png" || echo "  ✗ File 4 not found"
mv "dental-crop (5).png" "bicuspid-2nd-upper.png" 2>/dev/null && echo "  ✓ Renamed 5 -> bicuspid-2nd-upper.png" || echo "  ✗ File 5 not found"
mv "dental-crop (6).png" "molar-1st-molar-upper.png" 2>/dev/null && echo "  ✓ Renamed 6 -> molar-1st-molar-upper.png" || echo "  ✗ File 6 not found"
mv "dental-crop (7).png" "molar-2nd-molar-upper.png" 2>/dev/null && echo "  ✓ Renamed 7 -> molar-2nd-molar-upper.png" || echo "  ✗ File 7 not found"
mv "dental-crop (8).png" "wisdom-tooth-3rd-molar-upper.png" 2>/dev/null && echo "  ✓ Renamed 8 -> wisdom-tooth-3rd-molar-upper.png" || echo "  ✗ File 8 not found"

echo ""
echo "Renaming lower jaw images (9-16)..."
mv "dental-crop (9).png" "incisor-central-lower.png" 2>/dev/null && echo "  ✓ Renamed 9 -> incisor-central-lower.png" || echo "  ✗ File 9 not found"
mv "dental-crop (10).png" "incisor-lateral-lower.png" 2>/dev/null && echo "  ✓ Renamed 10 -> incisor-lateral-lower.png" || echo "  ✗ File 10 not found"
mv "dental-crop (11).png" "canine-eye-tooth-cuspid-lower.png" 2>/dev/null && echo "  ✓ Renamed 11 -> canine-eye-tooth-cuspid-lower.png" || echo "  ✗ File 11 not found"
mv "dental-crop (12).png" "bicuspid-1st-lower.png" 2>/dev/null && echo "  ✓ Renamed 12 -> bicuspid-1st-lower.png" || echo "  ✗ File 12 not found"
mv "dental-crop (13).png" "bicuspid-2nd-lower.png" 2>/dev/null && echo "  ✓ Renamed 13 -> bicuspid-2nd-lower.png" || echo "  ✗ File 13 not found"
mv "dental-crop (14).png" "molar-1st-molar-lower.png" 2>/dev/null && echo "  ✓ Renamed 14 -> molar-1st-molar-lower.png" || echo "  ✗ File 14 not found"
mv "dental-crop (15).png" "molar-2nd-molar-lower.png" 2>/dev/null && echo "  ✓ Renamed 15 -> molar-2nd-molar-lower.png" || echo "  ✗ File 15 not found"
mv "dental-crop (16).png" "wisdom-tooth-3rd-molar-lower.png" 2>/dev/null && echo "  ✓ Renamed 16 -> wisdom-tooth-3rd-molar-lower.png" || echo "  ✗ File 16 not found"

echo ""
echo "Renaming complete! Checking results..."
ls -la *-upper.png *-lower.png 2>/dev/null | wc -l | xargs echo "Total renamed files:"

