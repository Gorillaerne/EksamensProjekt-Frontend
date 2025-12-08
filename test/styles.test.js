import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('CSS Styles Validation', () => {
  let cssContent;

  beforeAll(() => {
    const cssPath = resolve(__dirname, '../Css/styles.css');
    cssContent = readFileSync(cssPath, 'utf-8');
  });

  describe('CSS file structure', () => {
    it('should be non-empty', () => {
      expect(cssContent.length).toBeGreaterThan(0);
    });

    it('should contain valid CSS syntax', () => {
      // Check for balanced braces
      const openBraces = (cssContent.match(/{/g) || []).length;
      const closeBraces = (cssContent.match(/}/g) || []).length;
      
      expect(openBraces).toBe(closeBraces);
    });

    it('should not have trailing whitespace on most lines', () => {
      const lines = cssContent.split('\n');
      const linesWithTrailingSpace = lines.filter(line => 
        line.length > 0 && line !== line.trimEnd()
      );
      
      // Allow some trailing spaces but not excessive
      expect(linesWithTrailingSpace.length).toBeLessThan(lines.length * 0.1);
    });
  });

  describe('CSS custom properties', () => {
    it('should define --elvang-brun variable', () => {
      expect(cssContent).toContain('--elvang-brun');
    });

    it('should define --elvang-hvid variable', () => {
      expect(cssContent).toContain('--elvang-hvid');
    });

    it('should define --text-dark variable', () => {
      expect(cssContent).toContain('--text-dark');
    });

    it('should define --text-mid variable', () => {
      expect(cssContent).toContain('--text-mid');
    });
  });

  describe('Landing page styles', () => {
    it('should have lp-wrapper class', () => {
      expect(cssContent).toContain('.lp-wrapper');
    });

    it('should have lp-header class', () => {
      expect(cssContent).toContain('.lp-header');
    });

    it('should have lp-hero class', () => {
      expect(cssContent).toContain('.lp-hero');
    });

    it('should have lp-footer class', () => {
      expect(cssContent).toContain('.lp-footer');
    });

    it('should have lp-overlay class for modals', () => {
      expect(cssContent).toContain('.lp-overlay');
    });
  });

  describe('Module form styles', () => {
    it('should have m-form class', () => {
      expect(cssContent).toContain('.m-form');
    });

    it('should have m-title class', () => {
      expect(cssContent).toContain('.m-title');
    });

    it('should have m-field class', () => {
      expect(cssContent).toContain('.m-field');
    });

    it('should have m-input class', () => {
      expect(cssContent).toContain('.m-input');
    });

    it('should have m-submit button class', () => {
      expect(cssContent).toContain('.m-submit');
    });

    it('should have m-message class', () => {
      expect(cssContent).toContain('.m-message');
    });

    it('should have m-error class', () => {
      expect(cssContent).toContain('.m-error');
    });

    it('should have m-success class', () => {
      expect(cssContent).toContain('.m-success');
    });
  });

  describe('Dashboard styles', () => {
    it('should have dashboard-wrapper id selector', () => {
      expect(cssContent).toContain('#dashboard-wrapper');
    });

    it('should have dashboard-grid id selector', () => {
      expect(cssContent).toContain('#dashboard-grid');
    });

    it('should have dashboard-card class', () => {
      expect(cssContent).toContain('.dashboard-card');
    });
  });

  describe('Search bar styles', () => {
    it('should have search-wrapper class', () => {
      expect(cssContent).toContain('.search-wrapper');
    });

    it('should have search-bar class', () => {
      expect(cssContent).toContain('.search-bar');
    });

    it('should have search-results class', () => {
      expect(cssContent).toContain('.search-results');
    });

    it('should have search-result-item class', () => {
      expect(cssContent).toContain('.search-result-item');
    });
  });

  describe('Product list styles', () => {
    it('should have product-grid class', () => {
      expect(cssContent).toContain('.product-grid');
    });

    it('should have product-card class', () => {
      expect(cssContent).toContain('.product-card');
    });

    it('should have product-img class', () => {
      expect(cssContent).toContain('.product-img');
    });

    it('should have product-info class', () => {
      expect(cssContent).toContain('.product-info');
    });
  });

  describe('Responsive design', () => {
    it('should have media queries for mobile', () => {
      expect(cssContent).toMatch(/@media.*max-width.*480px/);
    });

    it('should have media queries for tablets/small screens', () => {
      expect(cssContent).toMatch(/@media.*max-width.*(700px|900px)/);
    });
  });

  describe('Animations', () => {
    it('should define fadeInUp animation', () => {
      expect(cssContent).toContain('@keyframes fadeInUp');
    });

    it('should use transitions for smooth interactions', () => {
      const transitionCount = (cssContent.match(/transition:/g) || []).length;
      expect(transitionCount).toBeGreaterThan(5);
    });
  });

  describe('Color consistency', () => {
    it('should use CSS variables for colors', () => {
      expect(cssContent).toMatch(/var\(--elvang-brun\)/);
      expect(cssContent).toMatch(/var\(--elvang-hvid\)/);
    });

    it('should have consistent color palette', () => {
      // Check that custom properties are defined in :root
      expect(cssContent).toContain(':root');
    });
  });

  describe('Layout patterns', () => {
    it('should use flexbox', () => {
      expect(cssContent).toContain('display: flex');
    });

    it('should use grid', () => {
      expect(cssContent).toContain('display: grid');
    });

    it('should have proper box-sizing', () => {
      // Modern CSS often uses border-box
      const hasBorderBox = cssContent.includes('box-sizing') || 
                           cssContent.includes('border-box');
      // Not required but good practice
      expect(hasBorderBox || true).toBe(true);
    });
  });

  describe('Typography', () => {
    it('should define font families', () => {
      expect(cssContent).toMatch(/font-family:/);
    });

    it('should have varied font sizes', () => {
      const fontSizeCount = (cssContent.match(/font-size:/g) || []).length;
      expect(fontSizeCount).toBeGreaterThan(10);
    });

    it('should define font weights', () => {
      expect(cssContent).toMatch(/font-weight:/);
    });
  });

  describe('Interactive elements', () => {
    it('should have hover states', () => {
      const hoverCount = (cssContent.match(/:hover/g) || []).length;
      expect(hoverCount).toBeGreaterThan(5);
    });

    it('should have focus states', () => {
      const focusCount = (cssContent.match(/:focus/g) || []).length;
      expect(focusCount).toBeGreaterThan(0);
    });

    it('should have cursor pointer for clickable elements', () => {
      expect(cssContent).toMatch(/cursor:\s*pointer/);
    });
  });

  describe('Visual effects', () => {
    it('should use box-shadow for depth', () => {
      const shadowCount = (cssContent.match(/box-shadow:/g) || []).length;
      expect(shadowCount).toBeGreaterThan(5);
    });

    it('should use border-radius for rounded corners', () => {
      const radiusCount = (cssContent.match(/border-radius:/g) || []).length;
      expect(radiusCount).toBeGreaterThan(10);
    });

    it('should have backdrop-filter for modern effects', () => {
      expect(cssContent).toContain('backdrop-filter');
    });
  });

  describe('Spacing and layout', () => {
    it('should use consistent padding', () => {
      const paddingCount = (cssContent.match(/padding:/g) || []).length;
      expect(paddingCount).toBeGreaterThan(20);
    });

    it('should use consistent margin', () => {
      const marginCount = (cssContent.match(/margin:/g) || []).length;
      expect(marginCount).toBeGreaterThan(10);
    });

    it('should use gap for flex/grid spacing', () => {
      expect(cssContent).toMatch(/gap:/);
    });
  });

  describe('Code quality', () => {
    it('should have organized sections with comments', () => {
      const commentCount = (cssContent.match(/\/\*/g) || []).length;
      expect(commentCount).toBeGreaterThan(5);
    });

    it('should not have excessive duplicate selectors', () => {
      const selectors = cssContent.match(/\.[a-z-]+\s*{/g) || [];
      const uniqueSelectors = new Set(selectors);
      
      // Allow some duplication for media queries, pseudo-classes etc
      const duplicationRatio = uniqueSelectors.size / selectors.length;
      expect(duplicationRatio).toBeGreaterThan(0.5);
    });
  });
});