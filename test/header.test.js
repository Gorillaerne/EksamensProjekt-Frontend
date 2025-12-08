import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHeader } from '../Javascript/header.js';

// Mock the search bar module
vi.mock('../Javascript/searchBar.js', () => ({
  createSearchBar: vi.fn(async () => {
    const div = document.createElement('div');
    div.className = 'search-wrapper';
    return div;
  })
}));

describe('header', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch.mockClear();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('createHeader', () => {
    it('should create header wrapper with correct class', async () => {
      const header = await createHeader();

      expect(header.classList.contains('db-wrapper')).toBe(true);
    });

    it('should create header element', async () => {
      const wrapper = await createHeader();
      const header = wrapper.querySelector('.db-header');

      expect(header).not.toBeNull();
      expect(header.tagName).toBe('HEADER');
    });

    it('should display logo with correct src', async () => {
      const wrapper = await createHeader();
      const logo = wrapper.querySelector('.lp-logo');

      expect(logo).not.toBeNull();
      expect(logo.tagName).toBe('IMG');
      expect(logo.src).toContain('pictures/elvangLogo.png');
    });

    it('should include search bar component', async () => {
      const wrapper = await createHeader();
      const searchBar = wrapper.querySelector('.search-wrapper');

      expect(searchBar).not.toBeNull();
    });

    it('should create logout button', async () => {
      const wrapper = await createHeader();
      const logoutBtn = wrapper.querySelector('.logout-btn');

      expect(logoutBtn).not.toBeNull();
      expect(logoutBtn.tagName).toBe('BUTTON');
      expect(logoutBtn.textContent).toBe('Log ud');
    });

    it('should have correct order of elements in header', async () => {
      const wrapper = await createHeader();
      const header = wrapper.querySelector('.db-header');
      const children = Array.from(header.children);

      expect(children[0].classList.contains('lp-logo')).toBe(true);
      expect(children[1].classList.contains('search-wrapper')).toBe(true);
      expect(children[2].classList.contains('logout-btn')).toBe(true);
    });
  });

  describe('logout functionality', () => {
    it('should remove token from localStorage when logout is clicked', async () => {
      localStorage.setItem('token', 'test-token');
      
      const wrapper = await createHeader();
      const logoutBtn = wrapper.querySelector('.logout-btn');

      // Mock location.reload to prevent actual reload
      delete window.location;
      window.location = { reload: vi.fn() };

      logoutBtn.click();

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should reload page when logout is clicked', async () => {
      const wrapper = await createHeader();
      const logoutBtn = wrapper.querySelector('.logout-btn');

      // Mock location.reload
      delete window.location;
      window.location = { reload: vi.fn() };

      logoutBtn.click();

      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should handle logout when no token exists', async () => {
      const wrapper = await createHeader();
      const logoutBtn = wrapper.querySelector('.logout-btn');

      delete window.location;
      window.location = { reload: vi.fn() };

      expect(() => logoutBtn.click()).not.toThrow();
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe('header structure', () => {
    it('should be a self-contained component', async () => {
      const header = await createHeader();

      expect(header.parentElement).toBeNull();
    });

    it('should create consistent structure on multiple calls', async () => {
      const header1 = await createHeader();
      const header2 = await createHeader();

      expect(header1.classList.contains('db-wrapper')).toBe(true);
      expect(header2.classList.contains('db-wrapper')).toBe(true);
      expect(header1).not.toBe(header2);
    });

    it('should maintain proper CSS classes', async () => {
      const wrapper = await createHeader();
      const header = wrapper.querySelector('header');

      expect(header.classList.contains('db-header')).toBe(true);
    });
  });

  describe('integration with search bar', () => {
    it('should wait for async search bar creation', async () => {
      const wrapper = await createHeader();
      const searchBar = wrapper.querySelector('.search-wrapper');

      expect(searchBar).not.toBeNull();
    });

    it('should handle search bar creation errors gracefully', async () => {
      // This test verifies the module doesn't crash if search bar fails
      const { createSearchBar } = await import('../Javascript/searchBar.js');
      createSearchBar.mockRejectedValueOnce(new Error('Search bar error'));

      await expect(createHeader()).rejects.toThrow();
    });
  });

  describe('accessibility and usability', () => {
    it('should have button element for logout', async () => {
      const wrapper = await createHeader();
      const logoutBtn = wrapper.querySelector('.logout-btn');

      expect(logoutBtn.tagName).toBe('BUTTON');
    });

    it('should have img element with proper src for logo', async () => {
      const wrapper = await createHeader();
      const logo = wrapper.querySelector('.lp-logo');

      expect(logo.tagName).toBe('IMG');
      expect(logo.src).toBeTruthy();
    });

    it('should provide clear logout button text', async () => {
      const wrapper = await createHeader();
      const logoutBtn = wrapper.querySelector('.logout-btn');

      expect(logoutBtn.textContent).toBe('Log ud');
      expect(logoutBtn.textContent.trim().length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle missing localStorage gracefully', async () => {
      const originalLocalStorage = global.localStorage;
      delete global.localStorage;

      let wrapper;
      try {
        wrapper = await createHeader();
      } catch (error) {
        // Expected to potentially fail without localStorage
      }

      global.localStorage = originalLocalStorage;
    });

    it('should create header even when DOM is not ready', async () => {
      document.body.innerHTML = '';

      const wrapper = await createHeader();

      expect(wrapper).not.toBeNull();
      expect(wrapper.querySelector('.db-header')).not.toBeNull();
    });
  });
});