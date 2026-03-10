# Recursive Menger Sponge

## Team Members
Lauren Camper
Emily Tutt
Rudwika Manne
Danielle M. McIntyre
Daniel Kee Tam

## Libraries and Build Script
They are left unchanged from the original starter zip

## Project Overview
This is a WebGL-based renderer for a Menger Sponge. It features a recursive geometry system, a custom FPS camera, and a procedural checkerboard floor.

## Key Features
* **Menger Geometry**: Corrected triangle winding to fix "hollow" face bugs.
* **FPS Camera**: Custom controls using cross-product math for smooth rotation and navigation.
* **Shaders**: 
    * Axis-aligned coloring (X=Red, Y=Green, Z=Blue) with diffuse lighting.
    * Procedural 5x5 checkerboard floor calculated in the fragment shader using world coordinates.

## Controls
* **WASD**: Standard movement (Forward/Left/Back/Right).
* **Arrows**: Pan (Up/Down) and Roll (Left/Right).
* **Mouse**: Left-click drag to rotate, Right-click drag to zoom.
* **1-4**: Set recursion level.
* **R**: Reset scene.

## Build Instructions
1. Run `python3 make-menger.py` to compile.
2. Open `index.html` via a local server (like VS Code Live Server).
Note: No external libraries were added; uses the provided TSM.js and webglutils.
