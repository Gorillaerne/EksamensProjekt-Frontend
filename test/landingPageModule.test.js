import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLandingPage } from '../Javascript/landingPageModule.js';

describe('landingPageModule', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('page structure', () => {
    it('should create landing page wrapper', () => {
      const page = createLandingPage();

      expect(page.classList.contains('lp-wrapper')).toBe(true);
    });

    it('should create header section', () => {
      const page = createLandingPage();
      const header = page.querySelector('.lp-header');

      expect(header).not.toBeNull();
      expect(header.tagName).toBe('HEADER');
    });

    it('should create hero section', () => {
      const page = createLandingPage();
      const hero = page.querySelector('.lp-hero');

      expect(hero).not.toBeNull();
      expect(hero.tagName).toBe('SECTION');
    });

    it('should create story section', () => {
      const page = createLandingPage();
      const story = page.querySelector('.lp-story');

      expect(story).not.toBeNull();
      expect(story.tagName).toBe('SECTION');
    });

    it('should create footer section', () => {
      const page = createLandingPage();
      const footer = page.querySelector('.lp-footer');

      expect(footer).not.toBeNull();
      expect(footer.tagName).toBe('FOOTER');
    });
  });

  describe('header section', () => {
    it('should display logo with correct src', () => {
      const page = createLandingPage();
      const logo = page.querySelector('.lp-logo');

      expect(logo).not.toBeNull();
      expect(logo.src).toContain('pictures/elvangLogo.png');
      expect(logo.tagName).toBe('IMG');
    });

    it('should show login button when token is expired', () => {
      // No token = expired
      const page = createLandingPage();
      const loginBtn = page.querySelector('.lp-login-btn');

      expect(loginBtn).not.toBeNull();
      expect(loginBtn.textContent).toBe('Login');
    });

    it('should show dashboard button when token is valid', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      const page = createLandingPage();
      const navBtn = page.querySelector('.lp-nav-btn');

      expect(navBtn).not.toBeNull();
      expect(navBtn.textContent).toBe('Dashboard');
    });

    it('should trigger login module when login button is clicked', () => {
      const page = createLandingPage();
      document.body.appendChild(page);
      
      const loginBtn = page.querySelector('.lp-login-btn');
      loginBtn.click();

      const overlay = document.querySelector('.lp-overlay');
      expect(overlay).not.toBeNull();
    });
  });

  describe('hero section', () => {
    it('should have hero left and right sections', () => {
      const page = createLandingPage();
      const hero = page.querySelector('.lp-hero');
      const heroLeft = hero.querySelector('.lp-hero-left');
      const heroRight = hero.querySelector('.lp-hero-img');

      expect(heroLeft).not.toBeNull();
      expect(heroRight).not.toBeNull();
    });

    it('should display correct hero title', () => {
      const page = createLandingPage();
      const heroTitle = page.querySelector('.lp-hero-left h1');

      expect(heroTitle.textContent).toBe('Elvang Lagerstyringssystem');
    });

    it('should display hero quote', () => {
      const page = createLandingPage();
      const heroQuote = page.querySelector('.lp-hero-left p');

      expect(heroQuote.textContent).toBe('"Fordi et godt overblik baner vej for gode og bæredygtige beslutninger"');
    });

    it('should display hero image with correct src', () => {
      const page = createLandingPage();
      const heroImg = page.querySelector('.lp-hero-img');

      expect(heroImg.tagName).toBe('IMG');
      expect(heroImg.src).toContain('/pictures/elvang.jpg');
    });
  });

  describe('story section', () => {
    it('should have story image and text', () => {
      const page = createLandingPage();
      const story = page.querySelector('.lp-story');
      const storyImg = story.querySelector('.lp-story-img');
      const storyText = story.querySelector('.lp-story-text');

      expect(storyImg).not.toBeNull();
      expect(storyText).not.toBeNull();
    });

    it('should display story image with correct src', () => {
      const page = createLandingPage();
      const storyImg = page.querySelector('.lp-story-img');

      expect(storyImg.tagName).toBe('IMG');
      expect(storyImg.src).toContain('/pictures/elvangv2.jpg');
    });

    it('should display story text content', () => {
      const page = createLandingPage();
      const storyText = page.querySelector('.lp-story-text');

      expect(storyText.textContent).toContain('Vores historie handler om etik');
      expect(storyText.textContent).toContain('alpakauldens kvaliteter');
      expect(storyText.textContent).toContain('Peru');
    });

    it('should have complete story narrative', () => {
      const page = createLandingPage();
      const storyText = page.querySelector('.lp-story-text');

      expect(storyText.textContent.length).toBeGreaterThan(100);
      expect(storyText.textContent).toContain('2002');
      expect(storyText.textContent).toContain('Tina og Lasse Elvang');
    });
  });

  describe('footer section', () => {
    it('should have 5 footer columns', () => {
      const page = createLandingPage();
      const footerCols = page.querySelectorAll('.lp-footer-col');

      expect(footerCols.length).toBe(5);
    });

    it('should have "Elvang" column', () => {
      const page = createLandingPage();
      const footerCols = page.querySelectorAll('.lp-footer-col');
      const titles = Array.from(footerCols).map(col => col.querySelector('h4').textContent);

      expect(titles).toContain('Elvang');
    });

    it('should have "Kundeservice" column', () => {
      const page = createLandingPage();
      const footerCols = page.querySelectorAll('.lp-footer-col');
      const titles = Array.from(footerCols).map(col => col.querySelector('h4').textContent);

      expect(titles).toContain('Kundeservice');
    });

    it('should have "Forhandlere" column', () => {
      const page = createLandingPage();
      const footerCols = page.querySelectorAll('.lp-footer-col');
      const titles = Array.from(footerCols).map(col => col.querySelector('h4').textContent);

      expect(titles).toContain('Forhandlere');
    });

    it('should have "Følg os" column', () => {
      const page = createLandingPage();
      const footerCols = page.querySelectorAll('.lp-footer-col');
      const titles = Array.from(footerCols).map(col => col.querySelector('h4').textContent);

      expect(titles).toContain('Følg os');
    });

    it('should have "Land" column', () => {
      const page = createLandingPage();
      const footerCols = page.querySelectorAll('.lp-footer-col');
      const titles = Array.from(footerCols).map(col => col.querySelector('h4').textContent);

      expect(titles).toContain('Land');
    });

    it('should have 3 items per column', () => {
      const page = createLandingPage();
      const footerCols = page.querySelectorAll('.lp-footer-col');

      footerCols.forEach(col => {
        const items = col.querySelectorAll('p');
        expect(items.length).toBe(3);
      });
    });

    it('should have placeholder text in footer items', () => {
      const page = createLandingPage();
      const firstCol = page.querySelector('.lp-footer-col');
      const items = firstCol.querySelectorAll('p');

      items.forEach(item => {
        expect(item.textContent).toBe('Knap');
      });
    });
  });

  describe('responsive behavior', () => {
    it('should maintain structure when appended to DOM', () => {
      const page = createLandingPage();
      document.body.appendChild(page);

      expect(document.body.contains(page)).toBe(true);
      expect(page.querySelector('.lp-header')).not.toBeNull();
      expect(page.querySelector('.lp-hero')).not.toBeNull();
      expect(page.querySelector('.lp-story')).not.toBeNull();
      expect(page.querySelector('.lp-footer')).not.toBeNull();
    });

    it('should create independent instances on multiple calls', () => {
      const page1 = createLandingPage();
      const page2 = createLandingPage();

      expect(page1).not.toBe(page2);
      expect(page1.querySelector('.lp-header')).not.toBe(page2.querySelector('.lp-header'));
    });
  });

  describe('edge cases', () => {
    it('should handle expired token correctly', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600;
      const payload = { exp: pastTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      const page = createLandingPage();
      const loginBtn = page.querySelector('.lp-login-btn');

      expect(loginBtn).not.toBeNull();
      expect(loginBtn.textContent).toBe('Login');
    });

    it('should handle malformed token', () => {
      localStorage.setItem('token', 'invalid-token');

      const page = createLandingPage();
      const loginBtn = page.querySelector('.lp-login-btn');

      expect(loginBtn).not.toBeNull();
    });

    it('should not throw when token check fails', () => {
      localStorage.setItem('token', 'malformed');

      expect(() => createLandingPage()).not.toThrow();
    });
  });

  describe('content integrity', () => {
    it('should have all images with proper paths', () => {
      const page = createLandingPage();
      const images = page.querySelectorAll('img');

      expect(images.length).toBe(3); // logo, hero img, story img
      images.forEach(img => {
        expect(img.src).toBeTruthy();
      });
    });

    it('should have proper text content in all sections', () => {
      const page = createLandingPage();
      
      expect(page.textContent).toContain('Elvang Lagerstyringssystem');
      expect(page.textContent).toContain('Vores historie');
      expect(page.textContent).toContain('Kundeservice');
    });

    it('should maintain proper DOM hierarchy', () => {
      const page = createLandingPage();
      
      const header = page.querySelector('header');
      const sections = page.querySelectorAll('section');
      const footer = page.querySelector('footer');

      expect(header.parentElement).toBe(page);
      sections.forEach(section => {
        expect(section.parentElement).toBe(page);
      });
      expect(footer.parentElement).toBe(page);
    });
  });
});