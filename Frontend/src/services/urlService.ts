export interface ShortUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  expiresAt: string;
  clicks: ClickData[];
  customCode?: string;
}

export interface ClickData {
  timestamp: string;
  source: string;
  location: string;
  userAgent: string;
}

export interface UrlFormData {
  originalUrl: string;
  validityMinutes?: number;
  customCode?: string;
}

class UrlService {
  private storageKey = 'shortened_urls';

  private generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private validateCustomCode(code: string): boolean {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(code) && code.length <= 10;
  }

  private isCodeUnique(code: string): boolean {
    const urls = this.getAllUrls();
    return !urls.some(url => url.shortCode === code);
  }

  private getMockLocation(): string {
    const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Mumbai', 'Toronto'];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  private getMockSource(): string {
    const sources = ['Direct', 'Social Media', 'Email', 'Search Engine', 'Referral'];
    return sources[Math.floor(Math.random() * sources.length)];
  }

  shortenUrl(data: UrlFormData): ShortUrl | null {
    if (!this.validateUrl(data.originalUrl)) {
      return null;
    }

    if (data.customCode && !this.validateCustomCode(data.customCode)) {
      return null;
    }

    if (data.customCode && !this.isCodeUnique(data.customCode)) {
      return null;
    }

    const shortCode = data.customCode || this.generateShortCode();
    const validityMinutes = data.validityMinutes || 30;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + validityMinutes * 60 * 1000);

    const shortUrl: ShortUrl = {
      id: Date.now().toString(),
      originalUrl: data.originalUrl,
      shortCode,
      shortUrl: `${window.location.origin}/r/${shortCode}`,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      clicks: []
    };

    if (data.customCode) {
      shortUrl.customCode = data.customCode;
    }

    this.saveUrl(shortUrl);
    return shortUrl;
  }

  getUrlByCode(shortCode: string): ShortUrl | null {
    const urls = this.getAllUrls();
    return urls.find(url => url.shortCode === shortCode) || null;
  }

  recordClick(shortCode: string): void {
    const url = this.getUrlByCode(shortCode);
    if (!url) return;

    const clickData: ClickData = {
      timestamp: new Date().toISOString(),
      source: this.getMockSource(),
      location: this.getMockLocation(),
      userAgent: navigator.userAgent
    };

    url.clicks.push(clickData);
    this.updateUrl(url);
  }

  getAllUrls(): ShortUrl[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const urls = JSON.parse(stored) as ShortUrl[];
        return urls.filter(url => new Date(url.expiresAt) > new Date());
      }
    } catch (error) {
      return [];
    }
    return [];
  }

  private saveUrl(url: ShortUrl): void {
    const urls = this.getAllUrls();
    urls.push(url);
    localStorage.setItem(this.storageKey, JSON.stringify(urls));
  }

  private updateUrl(updatedUrl: ShortUrl): void {
    const urls = this.getAllUrls();
    const index = urls.findIndex(url => url.id === updatedUrl.id);
    if (index !== -1) {
      urls[index] = updatedUrl;
      localStorage.setItem(this.storageKey, JSON.stringify(urls));
    }
  }

  deleteUrl(id: string): void {
    const urls = this.getAllUrls();
    const filtered = urls.filter(url => url.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  clearExpiredUrls(): void {
    const urls = this.getAllUrls();
    const valid = urls.filter(url => new Date(url.expiresAt) > new Date());
    localStorage.setItem(this.storageKey, JSON.stringify(valid));
  }
}

export const urlService = new UrlService(); 