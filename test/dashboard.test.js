import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderDashboard } from '../Javascript/dashboard.js';

// Mock the imported modules
vi.mock('../Javascript/createProductModule.js', () => ({
  createProductModule: vi.fn(() => {
    const div = document.createElement('div');
    div.id = 'product-module';
    return div;
  })
}));

vi.mock('../Javascript/createWarehouseModule.js', () => ({
  createWarehouseModule: vi.fn(() => {
    const div = document.createElement('div');
    div.id = 'warehouse-module';
    return div;
  })
}));

vi.mock('../Javascript/moveProductToWarehouseModule.js', () => ({
  createProductTransferModule: vi.fn(() => {
    const div = document.createElement('div');
    div.id = 'transfer-module';
    return div;
  })
}));

vi.mock('../Javascript/lowProductAlertModule.js', () => ({
  createLowQuantityListModule: vi.fn(async () => {
    const div = document.createElement('div');
    div.id = 'low-quantity-module';
    return div;
  })
}));

vi.mock('../Javascript/createNewDeliveryModule.js', () => ({
  createNewDeliveryModule: vi.fn(() => {
    const div = document.createElement('div');
    div.id = 'delivery-module';
    return div;
  })
}));

vi.mock('../Javascript/createShowAllProductsModule.js', () => ({
  createProductListView: vi.fn(async () => {
    const div = document.createElement('div');
    div.id = 'product-list-module';
    return div;
  })
}));

describe('dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('renderDashboard with expired token', () => {
    it('should return landing page when token is expired', () => {
      // No token in localStorage = expired
      const result = renderDashboard();

      // Should return landing page wrapper
      expect(result).toBeDefined();
    });

    it('should clear app content when token is expired', () => {
      const app = document.createElement('div');
      app.id = 'app';
      app.innerHTML = '<div>Old content</div>';
      document.body.appendChild(app);

      renderDashboard();

      expect(app.innerHTML).toBe('');
    });
  });

  describe('renderDashboard with valid token', () => {
    beforeEach(() => {
      // Set valid token
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);
    });

    it('should create dashboard wrapper', () => {
      const dashboard = renderDashboard();

      expect(dashboard.id).toBe('dashboard-wrapper');
    });

    it('should create dashboard grid', () => {
      const dashboard = renderDashboard();
      const grid = dashboard.querySelector('#dashboard-grid');

      expect(grid).not.toBeNull();
    });

    it('should create exactly 6 dashboard cards', () => {
      const dashboard = renderDashboard();
      const cards = dashboard.querySelectorAll('.dashboard-card');

      expect(cards.length).toBe(6);
    });

    it('should create card for "Opret produkt"', () => {
      const dashboard = renderDashboard();
      const cards = dashboard.querySelectorAll('.dashboard-card');
      const cardTexts = Array.from(cards).map(c => c.textContent);

      expect(cardTexts).toContain('Opret produkt');
    });

    it('should create card for "Opret lager"', () => {
      const dashboard = renderDashboard();
      const cards = dashboard.querySelectorAll('.dashboard-card');
      const cardTexts = Array.from(cards).map(c => c.textContent);

      expect(cardTexts).toContain('Opret lager');
    });

    it('should create card for "Flyt produkt til lager"', () => {
      const dashboard = renderDashboard();
      const cards = dashboard.querySelectorAll('.dashboard-card');
      const cardTexts = Array.from(cards).map(c => c.textContent);

      expect(cardTexts).toContain('Flyt produkt til lager');
    });

    it('should create card for "Lav beholdningsstatus"', () => {
      const dashboard = renderDashboard();
      const cards = dashboard.querySelectorAll('.dashboard-card');
      const cardTexts = Array.from(cards).map(c => c.textContent);

      expect(cardTexts).toContain('Lav beholdningsstatus');
    });

    it('should create card for "Registrer ny leverance"', () => {
      const dashboard = renderDashboard();
      const cards = dashboard.querySelectorAll('.dashboard-card');
      const cardTexts = Array.from(cards).map(c => c.textContent);

      expect(cardTexts).toContain('Registrer ny leverance');
    });

    it('should create card for "Se alle produkter"', () => {
      const dashboard = renderDashboard();
      const cards = dashboard.querySelectorAll('.dashboard-card');
      const cardTexts = Array.from(cards).map(c => c.textContent);

      expect(cardTexts).toContain('Se alle produkter');
    });

    it('should have h3 elements with card titles', () => {
      const dashboard = renderDashboard();
      const h3Elements = dashboard.querySelectorAll('.dashboard-card h3');

      expect(h3Elements.length).toBe(6);
      expect(h3Elements[0].textContent).toBe('Opret produkt');
    });

    it('should apply correct CSS classes to cards', () => {
      const dashboard = renderDashboard();
      const cards = dashboard.querySelectorAll('.dashboard-card');

      cards.forEach(card => {
        expect(card.className).toBe('dashboard-card');
      });
    });
  });

  describe('dashboard card interactions', () => {
    beforeEach(() => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      const app = document.createElement('div');
      app.id = 'app';
      document.body.appendChild(app);
    });

    it('should trigger handler when card is clicked', async () => {
      const dashboard = renderDashboard();
      document.body.appendChild(dashboard);

      const cards = dashboard.querySelectorAll('.dashboard-card');
      const firstCard = cards[0];

      firstCard.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should create overlay
      const overlay = document.querySelector('.lp-overlay');
      expect(overlay).not.toBeNull();
    });

    it('should show overlay with module content when card is clicked', async () => {
      const dashboard = renderDashboard();
      document.body.appendChild(dashboard);

      const cards = dashboard.querySelectorAll('.dashboard-card');
      const firstCard = cards[0]; // "Opret produkt"

      firstCard.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      const overlay = document.querySelector('.lp-overlay');
      const overlayBox = overlay?.querySelector('.lp-overlay-box');
      
      expect(overlayBox).not.toBeNull();
      expect(overlayBox?.querySelector('#product-module')).not.toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle missing app element gracefully', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      expect(() => renderDashboard()).not.toThrow();
    });

    it('should return consistent structure on multiple calls', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTimestamp };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', token);

      const dashboard1 = renderDashboard();
      const dashboard2 = renderDashboard();

      expect(dashboard1.id).toBe(dashboard2.id);
      expect(dashboard1.querySelectorAll('.dashboard-card').length)
        .toBe(dashboard2.querySelectorAll('.dashboard-card').length);
    });
  });
});