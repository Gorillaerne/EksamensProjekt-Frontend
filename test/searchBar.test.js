import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSearchBar } from '../Javascript/searchBar.js';

describe('searchBar', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch.mockClear();
    document.body.innerHTML = '';
  });

  describe('createSearchBar', () => {
    const mockProducts = [
      { id: 1, name: 'Alpaca Blanket', description: 'Soft blanket', SKU: 'ALB-001', price: 599, picture: 'data:image/png;base64,mock1' },
      { id: 2, name: 'Wool Throw', description: 'Warm throw', SKU: 'WLT-002', price: 399, picture: 'data:image/png;base64,mock2' },
      { id: 3, name: 'Alpaca Scarf', description: 'Winter scarf', SKU: 'ALS-003', price: 199, picture: 'data:image/png;base64,mock3' },
      { id: 4, name: 'Cotton Pillow', description: 'Comfortable pillow', SKU: 'CTP-004', price: 149, picture: 'data:image/png;base64,mock4' },
      { id: 5, name: 'Silk Cushion', description: 'Luxury cushion', SKU: 'SLC-005', price: 249, picture: 'data:image/png;base64,mock5' },
      { id: 6, name: 'Velvet Throw', description: 'Elegant throw', SKU: 'VLT-006', price: 299, picture: 'data:image/png;base64,mock6' }
    ];

    it('should fetch products from API on initialization', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      await createSearchBar();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/products/searchBar',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });

    it('should return undefined and log error when fetch fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({ ok: false });

      const result = await createSearchBar();

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch search products');
    });

    it('should create search wrapper with correct structure', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();

      expect(wrapper.classList.contains('search-wrapper')).toBe(true);
      expect(wrapper.querySelector('.search-bar')).not.toBeNull();
      expect(wrapper.querySelector('.search-results')).not.toBeNull();
    });

    it('should create search input with correct attributes', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');

      expect(searchInput.type).toBe('search');
      expect(searchInput.placeholder).toBe('Søg efter produkter');
    });

    it('should filter products by name', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'alpaca';
      searchInput.dispatchEvent(new Event('input'));

      const items = resultsBox.querySelectorAll('.search-result-item');
      expect(items.length).toBe(2);
    });

    it('should filter products by description', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'warm';
      searchInput.dispatchEvent(new Event('input'));

      const items = resultsBox.querySelectorAll('.search-result-item');
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain('Wool Throw');
    });

    it('should filter products by SKU', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'ALB-001';
      searchInput.dispatchEvent(new Event('input'));

      const items = resultsBox.querySelectorAll('.search-result-item');
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain('ALB-001');
    });

    it('should filter products by price', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = '599';
      searchInput.dispatchEvent(new Event('input'));

      const items = resultsBox.querySelectorAll('.search-result-item');
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain('599 kr');
    });

    it('should filter products by ID', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = '3';
      searchInput.dispatchEvent(new Event('input'));

      const items = resultsBox.querySelectorAll('.search-result-item');
      expect(items.length).toBeGreaterThanOrEqual(1);
    });

    it('should be case insensitive when filtering', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'ALPACA';
      searchInput.dispatchEvent(new Event('input'));

      const items = resultsBox.querySelectorAll('.search-result-item');
      expect(items.length).toBe(2);
    });

    it('should limit results to top 5', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      // Search for something that matches many items
      searchInput.value = '0'; // Will match many IDs and SKUs
      searchInput.dispatchEvent(new Event('input'));

      const items = resultsBox.querySelectorAll('.search-result-item');
      expect(items.length).toBeLessThanOrEqual(5);
    });

    it('should clear results when search is empty', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      // First search for something
      searchInput.value = 'alpaca';
      searchInput.dispatchEvent(new Event('input'));
      expect(resultsBox.querySelectorAll('.search-result-item').length).toBeGreaterThan(0);

      // Then clear the search
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      expect(resultsBox.innerHTML).toBe('');
    });

    it('should display product information correctly', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'Alpaca Blanket';
      searchInput.dispatchEvent(new Event('input'));

      const item = resultsBox.querySelector('.search-result-item');
      expect(item.querySelector('.result-name').textContent).toBe('Alpaca Blanket');
      expect(item.querySelector('.result-price').textContent).toBe('599 kr');
      expect(item.querySelector('.result-sku').textContent).toBe('ALB-001');
    });

    it('should display product image', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'Alpaca Blanket';
      searchInput.dispatchEvent(new Event('input'));

      const img = resultsBox.querySelector('.result-image');
      expect(img).not.toBeNull();
      expect(img.src).toContain('data:image/png;base64,mock1');
      expect(img.alt).toBe('Alpaca Blanket');
    });

    it('should fill search input when result is clicked', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'alpaca';
      searchInput.dispatchEvent(new Event('input'));

      const firstItem = resultsBox.querySelector('.search-result-item');
      firstItem.click();

      expect(searchInput.value).toBe('Alpaca Blanket');
    });

    it('should close dropdown when result is clicked', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'alpaca';
      searchInput.dispatchEvent(new Event('input'));

      expect(resultsBox.style.display).toBe('block');

      const firstItem = resultsBox.querySelector('.search-result-item');
      firstItem.click();

      expect(resultsBox.innerHTML).toBe('');
      expect(resultsBox.style.display).toBe('none');
    });

    it('should handle empty product list', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'anything';
      searchInput.dispatchEvent(new Event('input'));

      expect(resultsBox.querySelectorAll('.search-result-item').length).toBe(0);
    });

    it('should handle products with no matches', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'nonexistent product xyz123';
      searchInput.dispatchEvent(new Event('input'));

      expect(resultsBox.querySelectorAll('.search-result-item').length).toBe(0);
    });

    it('should handle whitespace-only search queries', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = '   ';
      searchInput.dispatchEvent(new Event('input'));

      expect(resultsBox.innerHTML).toBe('');
    });

    it('should handle special characters in search', async () => {
      localStorage.setItem('token', 'test-token');
      const specialProduct = {
        id: 7,
        name: 'Special-Product (2024)',
        description: 'Product with special chars!',
        SKU: 'SP-007',
        price: 100,
        picture: 'data:image/png;base64,mock7'
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [specialProduct]
      });

      const wrapper = await createSearchBar();
      const searchInput = wrapper.querySelector('.search-bar');
      const resultsBox = wrapper.querySelector('.search-results');

      searchInput.value = 'special-product';
      searchInput.dispatchEvent(new Event('input'));

      const items = resultsBox.querySelectorAll('.search-result-item');
      expect(items.length).toBe(1);
    });

    it('should handle network errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('token', 'test-token');
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await createSearchBar();

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});