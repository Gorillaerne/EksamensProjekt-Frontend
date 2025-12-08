import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isTokenExpired, authorizedFetch, showOverlay } from '../Javascript/ReusableFunctions.js';

describe('ReusableFunctions', () => {
  describe('isTokenExpired', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return true when no token exists', () => {
      expect(isTokenExpired()).toBe(true);
    });

    it('should return false when token is valid and not expired', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = { exp: futureTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      expect(isTokenExpired()).toBe(false);
      expect(localStorage.getItem('token')).toBe(token);
    });

    it('should return true and remove token when expired', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const payload = { exp: pastTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      expect(isTokenExpired()).toBe(true);
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should handle token exactly at expiration time', () => {
      const nowTimestamp = Math.floor(Date.now() / 1000);
      const payload = { exp: nowTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      expect(isTokenExpired()).toBe(true);
    });

    it('should return true and remove token on malformed token', () => {
      localStorage.setItem('token', 'invalid.token.format');

      expect(isTokenExpired()).toBe(true);
      expect(localStorage.getItem('token')).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Invalid token:', expect.any(Error));
    });

    it('should return true and remove token when token has no payload', () => {
      localStorage.setItem('token', 'only-one-part');

      expect(isTokenExpired()).toBe(true);
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should return true and remove token when payload is not valid JSON', () => {
      const token = `header.not-valid-base64.signature`;
      localStorage.setItem('token', token);

      expect(isTokenExpired()).toBe(true);
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should return true when token payload has no exp field', () => {
      const payload = { user: 'test' }; // no exp field
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      expect(isTokenExpired()).toBe(true);
    });

    it('should handle token with exp as string', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTimestamp.toString() };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      // String gets multiplied by 1000, should still work
      expect(isTokenExpired()).toBe(false);
    });

    it('should handle very large expiration timestamps', () => {
      const farFutureTimestamp = Math.floor(Date.now() / 1000) + 999999999;
      const payload = { exp: farFutureTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      expect(isTokenExpired()).toBe(false);
    });
  });

  describe('authorizedFetch', () => {
    beforeEach(() => {
      localStorage.clear();
      global.fetch.mockClear();
    });

    it('should make fetch request with authorization header', async () => {
      const token = 'test-token-123';
      localStorage.setItem('token', token);
      
      global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      const url = 'http://localhost:8080/api/test';
      await authorizedFetch(url);

      expect(global.fetch).toHaveBeenCalledWith(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    });

    it('should preserve existing headers and add authorization', async () => {
      const token = 'test-token-456';
      localStorage.setItem('token', token);
      
      global.fetch.mockResolvedValueOnce({ ok: true });

      const url = 'http://localhost:8080/api/test';
      const options = {
        headers: { 'X-Custom-Header': 'custom-value' }
      };

      await authorizedFetch(url, options);

      expect(global.fetch).toHaveBeenCalledWith(url, {
        headers: {
          'X-Custom-Header': 'custom-value',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    });

    it('should handle POST requests with body', async () => {
      const token = 'test-token-789';
      localStorage.setItem('token', token);
      
      global.fetch.mockResolvedValueOnce({ ok: true });

      const url = 'http://localhost:8080/api/products';
      const body = JSON.stringify({ name: 'Test Product' });
      
      await authorizedFetch(url, { method: 'POST', body });

      expect(global.fetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        body,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    });

    it('should return the fetch response', async () => {
      localStorage.setItem('token', 'test-token');
      const mockResponse = { ok: true, status: 200, json: async () => ({ data: 'test' }) };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const response = await authorizedFetch('http://localhost:8080/api/test');

      expect(response).toBe(mockResponse);
    });

    it('should handle fetch with null token', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      await authorizedFetch('http://localhost:8080/api/test');

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/test', {
        headers: {
          'Authorization': 'Bearer null',
          'Content-Type': 'application/json'
        }
      });
    });

    it('should preserve all options like method, credentials, etc', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({ ok: true });

      const options = {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors'
      };

      await authorizedFetch('http://localhost:8080/api/test', options);

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/test', {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
    });

    it('should handle network errors', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(authorizedFetch('http://localhost:8080/api/test'))
        .rejects.toThrow('Network error');
    });
  });

  describe('showOverlay', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should create and append overlay to document body', () => {
      const testComponent = document.createElement('div');
      testComponent.textContent = 'Test Component';

      const overlay = showOverlay(testComponent);

      expect(document.body.contains(overlay)).toBe(true);
      expect(overlay.classList.contains('lp-overlay')).toBe(true);
    });

    it('should wrap component in overlay box', () => {
      const testComponent = document.createElement('div');
      testComponent.id = 'test-component';

      const overlay = showOverlay(testComponent);
      const box = overlay.querySelector('.lp-overlay-box');

      expect(box).not.toBeNull();
      expect(box.contains(testComponent)).toBe(true);
    });

    it('should return the overlay element', () => {
      const testComponent = document.createElement('div');
      const overlay = showOverlay(testComponent);

      expect(overlay).toBeInstanceOf(HTMLElement);
      expect(overlay.tagName).toBe('DIV');
    });

    it('should remove overlay when clicking on overlay background', () => {
      const testComponent = document.createElement('div');
      const overlay = showOverlay(testComponent);

      expect(document.body.contains(overlay)).toBe(true);

      // Simulate click on overlay (not on the box)
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: overlay, enumerable: true });
      overlay.dispatchEvent(clickEvent);

      expect(document.body.contains(overlay)).toBe(false);
    });

    it('should not remove overlay when clicking inside the component', () => {
      const testComponent = document.createElement('div');
      testComponent.id = 'test-component';
      const overlay = showOverlay(testComponent);

      const box = overlay.querySelector('.lp-overlay-box');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: box, enumerable: true });
      overlay.dispatchEvent(clickEvent);

      expect(document.body.contains(overlay)).toBe(true);
    });

    it('should handle multiple overlays', () => {
      const component1 = document.createElement('div');
      const component2 = document.createElement('div');

      const overlay1 = showOverlay(component1);
      const overlay2 = showOverlay(component2);

      expect(document.body.contains(overlay1)).toBe(true);
      expect(document.body.contains(overlay2)).toBe(true);
      expect(document.querySelectorAll('.lp-overlay').length).toBe(2);
    });

    it('should handle complex component structures', () => {
      const complexComponent = document.createElement('div');
      const child1 = document.createElement('p');
      child1.textContent = 'Child 1';
      const child2 = document.createElement('button');
      child2.textContent = 'Button';
      
      complexComponent.appendChild(child1);
      complexComponent.appendChild(child2);

      const overlay = showOverlay(complexComponent);
      const box = overlay.querySelector('.lp-overlay-box');

      expect(box.contains(child1)).toBe(true);
      expect(box.contains(child2)).toBe(true);
    });

    it('should allow manual removal via returned reference', () => {
      const testComponent = document.createElement('div');
      const overlay = showOverlay(testComponent);

      expect(document.body.contains(overlay)).toBe(true);

      overlay.remove();

      expect(document.body.contains(overlay)).toBe(false);
    });
  });
});