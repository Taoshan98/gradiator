# <p align="center"><img src="public/logo.png" alt="Gradietor Logo" width="120" /><br>Gradietor</p>

> **Gradietor** is a modern, premium web application for generating **perceptually uniform** multi-stop color gradients in advanced color spaces like **Oklch** and **Oklab**, designed to avoid the muddy "gray dead zones" typical of standard sRGB interpolation.

---

## 🎨 Table of Contents
1. [What is Gradietor & How It Works](#-what-is-gradietor--how-it-works)
2. [Supported Color Spaces](#-supported-color-spaces)
3. [Key Features](#-key-features)
4. [User Interface (UI)](#-user-interface-ui)
5. [How to Use It](#-how-to-use-it)
6. [Local Installation Guide](#-local-installation-guide)
7. [Technologies Used](#-technologies-used)

---

## 💡 What is Gradietor & How It Works

Traditionally, web browser gradients are computed by interpolating values in the **sRGB** color space. While simple, this method has a major drawback: sRGB is not **perceptually linear**. Consequently, the transition between two opposing colors (e.g., blue and yellow) often passes through a grayish, dull, or muddy region known as the "gradient dead zone."

**Gradietor** solves this issue by allowing you to calculate intermediate steps in **Oklab** and **Oklch** color spaces, which are specifically designed to emulate human visual perception.

### Cylindrical Interpolation and Hue Paths
In cylindrical color spaces (such as *Oklch*, *HSL*, *HSV*, *LCH*), colors include an angular coordinate for hue. When interpolating between two hues, Gradietor offers two main options:
- **Shorter Path**: Interpolates along the smaller arc of the color wheel (avoiding excessive hue shifts).
- **Longer Path**: Interpolates along the larger arc of the color wheel, producing a rich transition that spans a wider variety of intermediate hues (controlled rainbow effect).

---

## 🌈 Supported Color Spaces

Gradietor allows you to experiment with color interpolation across a wide variety of color spaces:

- **Oklch** (Recommended / Default): A perceptually uniform cylindrical space. Excellent for maintaining consistent lightness and chroma during hue transitions.
- **Oklab**: The Cartesian counterpart to Oklch, ideal for linear, smooth transitions without perceptual spikes.
- **Lab (CIELAB)**: The historical standard for perceptual uniformity.
- **Lch (CIELCh)**: The cylindrical version of CIELAB.
- **sRGB Linear**: Removes sRGB gamma compression before interpolating, yielding significantly better physical light gradients.
- **sRGB**: Standard web interpolation (clearly showing flaws and gray zones for comparison).
- **HSL / HSV / HWB**: Traditional human-friendly cylindrical spaces, convenient but not perceptually linear.
- **XYZ**: The CIE foundational color space based on human photoreceptor responses.

---

## ✨ Key Features

- **Full Multi-Stop Management**: Add infinite color stops by clicking on the preview bar or using the dedicated manager. Adjust stop positions by dragging sliders or entering numeric values.
- **Even Distribution**: A dedicated button lets you distribute stops evenly along the 0-100% range with a single click.
- **Smart Randomizer**: Generate random colors across all existing stops while keeping the gradient structure.
- **Trending Presets**: Instantly load curated, modern gradient combinations to jumpstart your experiments.
- **Advanced Exporter**:
  - **Color Grid**: View and copy individual color codes (HEX or RGB) with auto-calculated text contrast for optimal readability.
  - **CSS Code**: Generates copy-paste ready CSS `linear-gradient` code for your stylesheets.
  - **Multi-Format Export**: Export the entire palette as **HEX**, **RGB**, **HSL**, **Oklch**, or a **JavaScript Array** (perfect for developer workflows and Tailwind CSS configurations).
  - **Custom Separators**: Configure the text output to be separated by newlines, commas, or spaces.

---

## 🖥️ User Interface (UI)

The application is built to offer a **premium** and fluid user experience:
- **Aesthetic Glassmorphism**: Semitransparent panels with blurs, soft shadows, and reactive color glows that adapt to the active theme.
- **Light & Dark Mode**: Seamless transitions between light and dark themes that adapt to system settings or can be manually toggled via the header controls.
- **Micro-animations**: Smooth transitions for adding stops, hovering over color chips, and toggling export tabs.
- **Fully Responsive**: Optimized for both full-screen desktop use and mobile devices, with flexible menus and adaptive grids.

---

## 📖 How to Use It

1. **Define Main Colors (Stops)**: Click on the gradient bar to add a new intermediate color stop, or drag the control circles to shift transition positions.
2. **Customize Colors**: Use the "Stop Manager" panel on the right to edit hex values or remove unwanted stops.
3. **Configure Parameters**:
   - Change the **Color Space** to see how intermediate tones morph.
   - Adjust the **Hue Path** if you are using a cylindrical space.
   - Choose the exact number of **Steps** for the generated palette (e.g., 5 for a clean design palette, 16 for ultra-smooth steps).
4. **Export the Palette**: Scroll down to copy the CSS gradient code or fetch the formatted list of calculated colors.

---

## ⚙️ Local Installation Guide

If you want to run Gradietor locally, make modifications, or host it yourself, follow these steps:

### Prerequisites
Make sure you have **Node.js** (v18 or higher recommended) and **npm** (included with Node.js) installed.

### 1. Clone the Project
Download the project code to your local machine:
```bash
git clone <repository-url>
cd gradietor
```

*(Note: If you are already inside the development directory `/home/ntm/Develop/Taoshan/gradietor`, skip cloning and run the commands directly).*

### 2. Install Dependencies
Run the install command to download all required packages (Vite, React, Lucide-React, etc.):
```bash
npm install
```

### 3. Start Development Server
Run the local dev server. The app will be available at `http://localhost:5173` (or similar):
```bash
npm run dev
```

### 4. Build for Production
To compile the project for static hosting (e.g., GitHub Pages, Netlify, or Vercel):
```bash
npm run build
```
The distribution files will be generated inside the `dist/` folder.

### 5. Preview the Production Build
To test the production build locally before deploying:
```bash
npm run preview
```

---

## 🛠️ Technologies Used

- **React 19**: Core framework for reactive state management.
- **Vite 8**: Ultra-fast build tool for modern web development.
- **Vanilla CSS**: Pure stylesheets structured with **Cascade Layers** (`@layer`) and CSS custom properties (variables) for optimal maintainability and performance.
- **Lucide React**: Clean, modern, lightweight vector icon set.
- **Custom Color Conversion Algorithms**: Implemented from scratch in pure JavaScript for maximum performance without relying on heavy external libraries.
