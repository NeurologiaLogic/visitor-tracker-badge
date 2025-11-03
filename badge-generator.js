// --- BADGE STYLE ENGINE ---

const badgeHelpers = {
  // Global number formatter
  formatter: Intl.NumberFormat('en', { 
    notation: 'compact',
    compactDisplay: 'short' 
  }),
  
  // Helper to calculate widths for classic-style badges
  calcWidths: (label, countStr) => {
    // 11px font size. Avg char width ~6px.
    const labelTextWidth = label.length * 6.5; 
    const countTextWidth = countStr.length * 7;
    const labelWidth = Math.round(labelTextWidth + 20); // 10px padding each side
    const countWidth = Math.round(countTextWidth + 20);
    const totalWidth = labelWidth + countWidth;
    // X positions are scaled by 10 in the SVG
    const labelX = Math.round((labelWidth / 2) * 10);
    const countX = Math.round((labelWidth + countWidth / 2) * 10);
    // textLength is also scaled
    const labelTextLength = Math.round(labelTextWidth * 10);
    const countTextLength = Math.round(countTextWidth * 10);

    return { labelWidth, countWidth, totalWidth, labelX, countX, labelTextLength, countTextLength };
  },

  // Base template function for "shields.io" style badges
  createBadge: (label, countStr, {
    labelColor = '#555',
    countColor = '#007ec6',
    labelTextColor = '#fff',
    countTextColor = '#fff',
    shadow = true,
    radius = 3,
    fontFamily = 'Verdana,Geneva,DejaVu Sans,sans-serif',
    fontCSS = ''
  }) => {
    const { labelWidth, countWidth, totalWidth, labelX, countX, labelTextLength, countTextLength } = badgeHelpers.calcWidths(label, countStr);
    
    const shadowGradient = shadow ? 
      `<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>` : '';
    const shadowRect = shadow ? `<rect width="${totalWidth}" height="20" fill="url(#s)"/>` : '';
    const styleTag = fontCSS ? `<style>${fontCSS}</style>` : '';

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${countStr}">
        ${styleTag}
        <title>${label}: ${countStr}</title>
        ${shadowGradient}
        <clipPath id="r"><rect width="${totalWidth}" height="20" rx="${radius}" fill="#fff"/></clipPath>
        <g clip-path="url(#r)">
          <rect width="${labelWidth}" height="20" fill="${labelColor}"/>
          <rect x="${labelWidth}" width="${countWidth}" height="20" fill="${countColor}"/>
          ${shadowRect}
        </g>
        <g text-anchor="middle" font-family="${fontFamily}" text-rendering="geometricPrecision" font-size="110">
          <text aria-hidden="true" x="${labelX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${labelTextLength}">${label}</text>
          <text x="${labelX}" y="140" transform="scale(.1)" fill="${labelTextColor}" textLength="${labelTextLength}">${label}</text>
          <text aria-hidden="true" x="${countX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${countTextLength}">${countStr}</text>
          <text x="${countX}" y="140" transform="scale(.1)" fill="${countTextColor}" textLength="${countTextLength}">${countStr}</text>
        </g>
      </svg>`;
  }
};

/**
 * Registry of all available badge styles.
 * Each key is a style name, and the value is a function
 * that takes (label, countStr) and returns an SVG string.
 */
const svgStyles = {
  // 1. Classic Blue (Default)
  'classic': (l, c) => badgeHelpers.createBadge(l, c, { 
    labelColor: '#555', countColor: '#007ec6' 
  }),
  
  // 2. Flat Green
  'flat-green': (l, c) => badgeHelpers.createBadge(l, c, { 
    labelColor: '#555', countColor: '#4c1', shadow: false 
  }),
  
  // 3. Flat Red
  'flat-red': (l, c) => badgeHelpers.createBadge(l, c, { 
    labelColor: '#555', countColor: '#e05d44', shadow: false 
  }),
  
  // 4. Flat Yellow
  'flat-yellow': (l, c) => badgeHelpers.createBadge(l, c, { 
    labelColor: '#555', countColor: '#dfb317', shadow: false, countTextColor: '#333' 
  }),
  
  // 5. Flat Purple
  'flat-purple': (l, c) => badgeHelpers.createBadge(l, c, { 
    labelColor: '#555', countColor: '#9778cd', shadow: false 
  }),
  
  // 6. Pill Blue
  'pill-blue': (l, c) => badgeHelpers.createBadge(l, c, { 
    labelColor: '#555', countColor: '#007ec6', radius: 10 
  }),
  
  // 7. Pill Green (Flat)
  'pill-green': (l, c) => badgeHelpers.createBadge(l, c, { 
    labelColor: '#555', countColor: '#4c1', shadow: false, radius: 10 
  }),
  
  // 8. Dark Mode
  'dark-mode': (l, c) => badgeHelpers.createBadge(l, c, { 
    labelColor: '#222', countColor: '#333', shadow: false, radius: 4 
  }),

  // 9. Corporate Clean
  'corporate': (l, c) => badgeHelpers.createBadge(l, c, { 
    labelColor: '#f0f0f0', countColor: '#f0f0f0', labelTextColor: '#004a99', countTextColor: '#004a99', shadow: false, radius: 0 
  }),

  // 10. Retro Pixel
  'retro-pixel': (l, c) => badgeHelpers.createBadge(l, c, {
    labelColor: '#333', countColor: '#E47911', shadow: false, radius: 0, 
    fontFamily: "'VT323', monospace",
    fontCSS: "@import url('https://fonts.googleapis.com/css2?family=VT323');"
  }),

  // 11. Minimalist Text
  'minimalist-text': (label, countStr) => {
    const text = `${label}: ${countStr}`;
    const width = text.length * 8;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${text}">
        <title>${text}</title>
        <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="12" fill="#333">
          ${text}
        </text>
      </svg>`;
  },

  
  // 13. Simple Box
  'simple-box': (label, countStr) => {
    const width = (countStr.length * 8) + 20;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${label}: ${countStr}">
        <title>${label}: ${countStr}</title>
        <rect width="100%" height="100%" rx="3" fill="#007ec6" />
        <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" fill="#fff">
          ${countStr}
        </text>
      </svg>`;
  },

  // 14. Simple Text
  'simple-text': (label, countStr) => {
    const width = countStr.length * 9;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${label}: ${countStr}">
        <title>${label}: ${countStr}</title>
        <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="14" font-weight="bold" fill="#007ec6">
          ${countStr}
        </text>
      </svg>`;
  },


  // 20. Outline Blue
  'outline-blue': (label, countStr) => {
    const { totalWidth } = badgeHelpers.calcWidths(label, countStr);
    return badgeHelpers.createBadge(label, countStr, { 
      labelColor: 'transparent', countColor: 'transparent', labelTextColor: '#007ec6', countTextColor: '#007ec6', shadow: false 
    })
    .replace('<g clip-path="url(#r)">', 
      `<g clip-path="url(#r)">
       <rect width="${totalWidth - 1}" height="19" x="0.5" y="0.5" rx="3" fill="transparent" stroke="#007ec6" stroke-width="1"/>`
    );
  }
};


/**
 * Generates a dynamic SVG badge displaying a count, with a selectable style.
 * @param {string | number} count - The text or number to display on the badge.
 *Additionaly, the selected code (between  and ) is in `visitor-counter.js` * @param {string} style - The name of the style to use (e.g., 'classic', 'minimalist-icon').
 * @returns {string} - A full SVG string.
 */
function generateSvgBadge(label,count, style = 'classic') {
  try {
    // Format the count (e.g., 10000 -> 10K)
    const countStr = badgeHelpers.formatter.format(count);
    const defaultLabel = label??"Visitors";

    // Find the style function from the registry.
    // If the style doesn't exist, default to 'classic'.
    const styleFunc = svgStyles[style] || svgStyles['classic'];
    
    // Generate and return the SVG string
    return styleFunc(defaultLabel, countStr);

  } catch (err) {
    console.error(`Error in generateSvgBadge (style: ${style}):`, err);
    // Return an error badge if something goes wrong
    return svgStyles['flat-red']("Error", "SVG");
  }
}

// Export the function to be used in other files
module.exports = {
  generateSvgBadge
};
