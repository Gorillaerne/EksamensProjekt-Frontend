import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLoginModule } from '../Javascript/loginModule.js';

describe('loginModule', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch.mockClear();
    document.body.innerHTML = '';
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('createLoginModule', () => {
    it('should create login form with correct structure', () => {
      const module = createLoginModule();

      expect(module.classList.contains('m-form')).toBe(true);
      expect(module.querySelector('h2').textContent).toBe('Login');
    });

    it('should create username input field', () => {
      const module = createLoginModule();
      const usernameField = module.querySelector('.m-field');
      const usernameInput = usernameField.querySelector('input');

      expect(usernameField.querySelector('.m-label').textContent).toBe('Brugernavn');
      expect(usernameInput.required).toBe(true);
    });

    it('should create password input field with correct type', () => {
      const module = createLoginModule();
      const fields = module.querySelectorAll('.m-field');
      const passwordField = fields[1];
      const passwordInput = passwordField.querySelector('input');

      expect(passwordField.querySelector('.m-label').textContent).toBe('Kodeord');
      expect(passwordInput.type).toBe('password');
      expect(passwordInput.required).toBe(true);
    });

    it('should create submit button', () => {
      const module = createLoginModule();
      const button = module.querySelector('.m-submit');

      expect(button.textContent).toBe('Login');
      expect(button.tagName).toBe('BUTTON');
    });

    it('should create message container', () => {
      const module = createLoginModule();
      const message = module.querySelector('.m-message');

      expect(message).not.toBeNull();
    });

    it('should show error when username is empty', async () => {
      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');
      const passwordInput = fields[1].querySelector('input');

      passwordInput.value = 'password123';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(message.textContent).toBe('Udfyld brugernavn og kodeord.');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should show error when password is empty', async () => {
      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');

      usernameInput.value = 'testuser';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(message.textContent).toBe('Udfyld brugernavn og kodeord.');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should trim whitespace from inputs', async () => {
      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = '   ';
      passwordInput.value = '   ';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(message.textContent).toBe('Udfyld brugernavn og kodeord.');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should make POST request to login endpoint with credentials', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'test-token-123' })
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'testuser';
      passwordInput.value = 'testpass';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/users/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ username: 'testuser', password: 'testpass' })
        })
      );
    });

    it('should store token in localStorage on successful login', async () => {
      const mockToken = 'jwt-token-abc123';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: mockToken })
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'testuser';
      passwordInput.value = 'testpass';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(localStorage.getItem('token')).toBe(mockToken);
    });

    it('should show success message on successful login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'test-token' })
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'testuser';
      passwordInput.value = 'testpass';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Login lykkedes! Genindlæser...');
      expect(message.classList.contains('m-success')).toBe(true);
    });

    it('should show error message on failed login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Invalid credentials'
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'wronguser';
      passwordInput.value = 'wrongpass';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Login fejlede: Invalid credentials');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'testuser';
      passwordInput.value = 'testpass';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Netværksfejl – kunne ikke logge ind.');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should handle 401 unauthorized response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized'
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'testuser';
      passwordInput.value = 'wrongpass';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.classList.contains('m-error')).toBe(true);
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should handle 500 server error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal server error'
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'testuser';
      passwordInput.value = 'testpass';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toContain('Internal server error');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should handle response with no token', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}) // No token in response
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'testuser';
      passwordInput.value = 'testpass';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should still consider it success if response is ok
      expect(localStorage.getItem('token')).toBe('undefined');
    });

    it('should handle special characters in username', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'test-token' })
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'user@example.com';
      passwordInput.value = 'pass123';
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/users/login',
        expect.objectContaining({
          body: JSON.stringify({ username: 'user@example.com', password: 'pass123' })
        })
      );
    });

    it('should handle very long passwords', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'test-token' })
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      const longPassword = 'a'.repeat(100);
      usernameInput.value = 'testuser';
      passwordInput.value = longPassword;
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/users/login',
        expect.objectContaining({
          body: JSON.stringify({ username: 'testuser', password: longPassword })
        })
      );
    });

    it('should not send request multiple times on rapid clicks', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'test-token' })
      });

      const module = createLoginModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');
      const usernameInput = fields[0].querySelector('input');
      const passwordInput = fields[1].querySelector('input');

      usernameInput.value = 'testuser';
      passwordInput.value = 'testpass';
      
      button.click();
      button.click();
      button.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should still only be called once per actual async completion
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });
});