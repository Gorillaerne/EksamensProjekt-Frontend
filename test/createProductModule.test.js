import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductModule } from '../Javascript/createProductModule.js';

describe('createProductModule', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch.mockClear();
    document.body.innerHTML = '';
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('module structure', () => {
    it('should create product form with correct structure', () => {
      const module = createProductModule();

      expect(module.classList.contains('m-form')).toBe(true);
      expect(module.querySelector('.m-title').textContent).toBe('Opret Produkt');
    });

    it('should create content row with fields and preview containers', () => {
      const module = createProductModule();
      const contentRow = module.querySelector('.m-content-row');

      expect(contentRow).not.toBeNull();
      expect(contentRow.querySelector('.m-fields-container')).not.toBeNull();
      expect(contentRow.querySelector('.m-preview-container')).not.toBeNull();
    });

    it('should create all required input fields', () => {
      const module = createProductModule();
      const fields = module.querySelectorAll('.m-field');

      expect(fields.length).toBe(5); // name, description, picture, sku, price
    });

    it('should create name input field', () => {
      const module = createProductModule();
      const fields = module.querySelectorAll('.m-field');
      const nameField = fields[0];

      expect(nameField.querySelector('.m-label').textContent).toBe('Navn');
      expect(nameField.querySelector('input').required).toBe(true);
    });

    it('should create description textarea', () => {
      const module = createProductModule();
      const fields = module.querySelectorAll('.m-field');
      const descField = fields[1];

      expect(descField.querySelector('.m-label').textContent).toBe('Beskrivelse');
      expect(descField.querySelector('textarea').required).toBe(true);
    });

    it('should create picture file input with correct attributes', () => {
      const module = createProductModule();
      const fields = module.querySelectorAll('.m-field');
      const picField = fields[2];
      const fileInput = picField.querySelector('input[type="file"]');

      expect(picField.querySelector('.m-label').textContent).toBe('Billede');
      expect(fileInput.accept).toBe('image/*');
      expect(fileInput.classList.contains('pm-file-input')).toBe(true);
    });

    it('should create SKU input field', () => {
      const module = createProductModule();
      const fields = module.querySelectorAll('.m-field');
      const skuField = fields[3];

      expect(skuField.querySelector('.m-label').textContent).toBe('SKU (unik)');
      expect(skuField.querySelector('input')).not.toBeNull();
    });

    it('should create price input field with correct type', () => {
      const module = createProductModule();
      const fields = module.querySelectorAll('.m-field');
      const priceField = fields[4];
      const priceInput = priceField.querySelector('input');

      expect(priceField.querySelector('.m-label').textContent).toBe('Pris');
      expect(priceInput.type).toBe('number');
      expect(priceInput.step).toBe('0.01');
    });

    it('should create image preview with default image', () => {
      const module = createProductModule();
      const preview = module.querySelector('.m-preview');

      expect(preview.tagName).toBe('IMG');
      expect(preview.src).toContain('/pictures/missing picture.jpg');
    });

    it('should create submit button', () => {
      const module = createProductModule();
      const button = module.querySelector('.m-submit');

      expect(button.textContent).toBe('Opret Produkt');
    });

    it('should create message container', () => {
      const module = createProductModule();
      const message = module.querySelector('.m-message');

      expect(message).not.toBeNull();
    });
  });

  describe('image preview functionality', () => {
    it('should update preview when image is selected', async () => {
      const module = createProductModule();
      const fields = module.querySelectorAll('.m-field');
      const fileInput = fields[2].querySelector('input[type="file"]');
      const preview = module.querySelector('.m-preview');

      const mockFile = new File(['image content'], 'test.png', { type: 'image/png' });
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: false
      });

      fileInput.dispatchEvent(new Event('change'));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(preview.src).toContain('data:image/png;base64,mock');
    });

    it('should reset preview to default when file input is cleared', () => {
      const module = createProductModule();
      const fields = module.querySelectorAll('.m-field');
      const fileInput = fields[2].querySelector('input[type="file"]');
      const preview = module.querySelector('.m-preview');

      Object.defineProperty(fileInput, 'files', {
        value: [],
        writable: false
      });

      fileInput.dispatchEvent(new Event('change'));

      expect(preview.src).toContain('/pictures/missing picture.jpg');
    });
  });

  describe('form validation', () => {
    it('should show error when name is empty', async () => {
      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const descInput = fields[1].querySelector('textarea');
      const priceInput = fields[4].querySelector('input');

      descInput.value = 'Test description';
      priceInput.value = '100';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Navn, beskrivelse og pris skal udfyldes.');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should show error when description is empty', async () => {
      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Test Product';
      priceInput.value = '100';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Navn, beskrivelse og pris skal udfyldes.');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should show error when price is empty', async () => {
      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');

      nameInput.value = 'Test Product';
      descInput.value = 'Test description';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Navn, beskrivelse og pris skal udfyldes.');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should trim whitespace from inputs', async () => {
      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');

      nameInput.value = '   ';
      descInput.value = '   ';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.classList.contains('m-error')).toBe(true);
    });
  });

  describe('product creation', () => {
    it('should send POST request with product data', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const skuInput = fields[3].querySelector('input');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Alpaca Blanket';
      descInput.value = 'Soft and warm';
      skuInput.value = 'ALB-001';
      priceInput.value = '599.99';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/products',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"name":"Alpaca Blanket"')
        })
      );
    });

    it('should include encoded picture in request', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const fileInput = fields[2].querySelector('input[type="file"]');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Test Product';
      descInput.value = 'Test description';
      priceInput.value = '100';

      const mockFile = new File(['image'], 'test.png', { type: 'image/png' });
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: false
      });

      fileInput.dispatchEvent(new Event('change'));
      await new Promise(resolve => setTimeout(resolve, 10));

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/products',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('data:image/png;base64,mock')
        })
      );
    });

    it('should use default image when no picture is selected', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Test Product';
      descInput.value = 'Test description';
      priceInput.value = '100';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/products',
        expect.objectContaining({
          body: expect.stringContaining('/pictures/missing picture.jpg')
        })
      );
    });

    it('should show success message on successful creation', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Test Product';
      descInput.value = 'Test description';
      priceInput.value = '100';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Produktet blev oprettet!');
      expect(message.classList.contains('m-success')).toBe(true);
    });

    it('should show error message on failed creation', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'SKU already exists'
      });

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Test Product';
      descInput.value = 'Test description';
      priceInput.value = '100';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Fejl: SKU already exists');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should handle network errors', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Test Product';
      descInput.value = 'Test description';
      priceInput.value = '100';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Netværksfejl – kunne ikke oprette produktet.');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should handle decimal prices correctly', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Test Product';
      descInput.value = 'Test description';
      priceInput.value = '99.95';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      const callArgs = global.fetch.mock.calls[0][1].body;
      const productData = JSON.parse(callArgs);
      expect(productData.price).toBe(99.95);
    });

    it('should handle price with no decimal places', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Test Product';
      descInput.value = 'Test description';
      priceInput.value = '100';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      const callArgs = global.fetch.mock.calls[0][1].body;
      const productData = JSON.parse(callArgs);
      expect(productData.price).toBe(100);
    });

    it('should handle empty SKU field', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const priceInput = fields[4].querySelector('input');

      nameInput.value = 'Test Product';
      descInput.value = 'Test description';
      priceInput.value = '100';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      const callArgs = global.fetch.mock.calls[0][1].body;
      const productData = JSON.parse(callArgs);
      expect(productData.sku).toBe('');
    });

    it('should handle very long product names', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createProductModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const priceInput = fields[4].querySelector('input');

      const longName = 'A'.repeat(500);
      nameInput.value = longName;
      descInput.value = 'Test description';
      priceInput.value = '100';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      const callArgs = global.fetch.mock.calls[0][1].body;
      const productData = JSON.parse(callArgs);
      expect(productData.name).toBe(longName);
    });
  });
});