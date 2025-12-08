import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWarehouseModule } from '../Javascript/createWarehouseModule.js';

describe('createWarehouseModule', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch.mockClear();
    document.body.innerHTML = '';
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('module structure', () => {
    it('should create warehouse form with correct structure', () => {
      const module = createWarehouseModule();

      expect(module.classList.contains('m-form')).toBe(true);
      expect(module.querySelector('.m-title').textContent).toBe('Opret varehus');
    });

    it('should create all required input fields', () => {
      const module = createWarehouseModule();
      const fields = module.querySelectorAll('.m-field');

      expect(fields.length).toBe(3); // name, description, address
    });

    it('should create name input field', () => {
      const module = createWarehouseModule();
      const fields = module.querySelectorAll('.m-field');
      const nameField = fields[0];

      expect(nameField.querySelector('.m-label').textContent).toBe('Navn');
      expect(nameField.querySelector('input').required).toBe(true);
    });

    it('should create description textarea', () => {
      const module = createWarehouseModule();
      const fields = module.querySelectorAll('.m-field');
      const descField = fields[1];

      expect(descField.querySelector('.m-label').textContent).toBe('Beskrivelse');
      expect(descField.querySelector('textarea').required).toBe(true);
    });

    it('should create address input field', () => {
      const module = createWarehouseModule();
      const fields = module.querySelectorAll('.m-field');
      const addressField = fields[2];

      expect(addressField.querySelector('.m-label').textContent).toBe('Adresse');
      expect(addressField.querySelector('input').required).toBe(true);
    });

    it('should create submit button', () => {
      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');

      expect(button.textContent).toBe('Opret Warehouse');
    });

    it('should create message container', () => {
      const module = createWarehouseModule();
      const message = module.querySelector('.m-message');

      expect(message).not.toBeNull();
    });
  });

  describe('form validation', () => {
    it('should show error when name is empty', async () => {
      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const descInput = fields[1].querySelector('textarea');
      const addressInput = fields[2].querySelector('input');

      descInput.value = 'Test description';
      addressInput.value = 'Test address';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Navn, beskrivelse og addresse');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should show error when description is empty', async () => {
      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const addressInput = fields[2].querySelector('input');

      nameInput.value = 'Test Warehouse';
      addressInput.value = 'Test address';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Navn, beskrivelse og addresse');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should show error when address is empty', async () => {
      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');

      nameInput.value = 'Test Warehouse';
      descInput.value = 'Test description';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Navn, beskrivelse og addresse');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should trim whitespace from all inputs', async () => {
      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const addressInput = fields[2].querySelector('input');

      nameInput.value = '   ';
      descInput.value = '   ';
      addressInput.value = '   ';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.classList.contains('m-error')).toBe(true);
    });
  });

  describe('warehouse creation', () => {
    it('should send POST request with warehouse data', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const addressInput = fields[2].querySelector('input');

      nameInput.value = 'Copenhagen Warehouse';
      descInput.value = 'Main storage facility';
      addressInput.value = 'Vesterbrogade 123, Copenhagen';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/warehouses',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Copenhagen Warehouse',
            description: 'Main storage facility',
            address: 'Vesterbrogade 123, Copenhagen'
          })
        })
      );
    });

    it('should show success message on successful creation', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const addressInput = fields[2].querySelector('input');

      nameInput.value = 'Test Warehouse';
      descInput.value = 'Test description';
      addressInput.value = 'Test address';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Varehuset blev oprettet!');
      expect(message.classList.contains('m-success')).toBe(true);
    });

    it('should show error message on failed creation', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Warehouse already exists'
      });

      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const addressInput = fields[2].querySelector('input');

      nameInput.value = 'Test Warehouse';
      descInput.value = 'Test description';
      addressInput.value = 'Test address';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Fejl: Warehouse already exists');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should handle network errors', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const message = module.querySelector('.m-message');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const addressInput = fields[2].querySelector('input');

      nameInput.value = 'Test Warehouse';
      descInput.value = 'Test description';
      addressInput.value = 'Test address';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(message.textContent).toBe('Netværksfejl – kunne ikke oprette varehuset.');
      expect(message.classList.contains('m-error')).toBe(true);
    });

    it('should handle special characters in address', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const addressInput = fields[2].querySelector('input');

      nameInput.value = 'Test Warehouse';
      descInput.value = 'Test description';
      addressInput.value = 'Østergade 45, 2nd floor, København Ø';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      const callArgs = global.fetch.mock.calls[0][1].body;
      const warehouseData = JSON.parse(callArgs);
      expect(warehouseData.address).toBe('Østergade 45, 2nd floor, København Ø');
    });

    it('should handle very long descriptions', async () => {
      localStorage.setItem('token', 'test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Success'
      });

      const module = createWarehouseModule();
      const button = module.querySelector('.m-submit');
      const fields = module.querySelectorAll('.m-field');

      const nameInput = fields[0].querySelector('input');
      const descInput = fields[1].querySelector('textarea');
      const addressInput = fields[2].querySelector('input');

      const longDescription = 'A'.repeat(1000);
      nameInput.value = 'Test Warehouse';
      descInput.value = longDescription;
      addressInput.value = 'Test address';

      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      const callArgs = global.fetch.mock.calls[0][1].body;
      const warehouseData = JSON.parse(callArgs);
      expect(warehouseData.description).toBe(longDescription);
    });
  });
});