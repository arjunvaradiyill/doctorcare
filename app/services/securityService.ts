// Security Service for Threat Detection and Monitoring

interface SecurityEvent {
  timestamp: string;
  type: 'access_violation' | 'session_tamper' | 'devtools_detected' | 'suspicious_activity' | 'authentication_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: any;
  userAgent: string;
  ip?: string;
  userId?: string;
}

interface ThreatReport {
  totalEvents: number;
  criticalEvents: number;
  lastEvent: SecurityEvent | null;
  blockedAttempts: number;
}

class SecurityService {
  private events: SecurityEvent[] = [];
  private blockedAttempts = 0;
  private isMonitoring = false;
  private isClient = false;

  constructor() {
    // Check if we're in the browser
    this.isClient = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    
    if (this.isClient) {
      this.initializeSecurity();
    }
  }

  private initializeSecurity() {
    if (!this.isClient) return;

    // Security: Prevent service worker hijacking
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }

    // Security: Monitor for localStorage tampering
    this.monitorLocalStorage();
    
    // Security: Monitor for session hijacking
    this.monitorSession();
    
    // Security: Monitor for XSS attempts
    this.monitorXSS();
    
    // Security: Monitor for CSRF attempts
    this.monitorCSRF();
  }

  private monitorLocalStorage() {
    if (!this.isClient) return;

    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = (key: string, value: string) => {
      // Security: Validate sensitive keys
      if (key.includes('auth') || key.includes('token') || key.includes('user')) {
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          details: { action: 'localStorage_set', key, value: value.substring(0, 10) + '...' }
        });
      }
      return originalSetItem.call(localStorage, key, value);
    };

    localStorage.getItem = (key: string) => {
      // Security: Monitor access to sensitive data
      if (key.includes('auth') || key.includes('token') || key.includes('user')) {
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'low',
          details: { action: 'localStorage_get', key }
        });
      }
      return originalGetItem.call(localStorage, key);
    };

    localStorage.removeItem = (key: string) => {
      // Security: Monitor removal of sensitive data
      if (key.includes('auth') || key.includes('token') || key.includes('user')) {
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          details: { action: 'localStorage_remove', key }
        });
      }
      return originalRemoveItem.call(localStorage, key);
    };
  }

  private monitorSession() {
    if (!this.isClient) return;

    // Security: Check for session anomalies
    setInterval(() => {
      const authToken = localStorage.getItem('authToken');
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (authToken && token && authToken !== token) {
        this.logSecurityEvent({
          type: 'session_tamper',
          severity: 'critical',
          details: { reason: 'token_mismatch' }
        });
        this.blockAccess();
      }

      if (user) {
        try {
          const userData = JSON.parse(user);
          if (!userData._id || !userData.username || !userData.role) {
            this.logSecurityEvent({
              type: 'session_tamper',
              severity: 'high',
              details: { reason: 'invalid_user_data' }
            });
            this.blockAccess();
          }
        } catch (error) {
          this.logSecurityEvent({
            type: 'session_tamper',
            severity: 'critical',
            details: { reason: 'corrupted_user_data' }
          });
          this.blockAccess();
        }
      }
    }, 5000); // Check every 5 seconds
  }

  private monitorXSS() {
    if (!this.isClient) return;

    // Security: Monitor for XSS attempts in URL
    const checkURL = () => {
      const url = window.location.href;
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:text\/html/i
      ];

      suspiciousPatterns.forEach(pattern => {
        if (pattern.test(url)) {
          this.logSecurityEvent({
            type: 'suspicious_activity',
            severity: 'high',
            details: { reason: 'xss_attempt', pattern: pattern.source }
          });
          this.blockAccess();
        }
      });
    };

    checkURL();
    window.addEventListener('popstate', checkURL);
  }

  private monitorCSRF() {
    if (!this.isClient) return;

    // Security: Monitor for CSRF attempts
    const originalFetch = window.fetch;
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      // Security: Validate request origin
      if (init && init.method && init.method !== 'GET') {
        const referrer = document.referrer;
        const currentOrigin = window.location.origin;
        
        if (referrer && !referrer.startsWith(currentOrigin)) {
          this.logSecurityEvent({
            type: 'suspicious_activity',
            severity: 'high',
            details: { reason: 'csrf_attempt', referrer, currentOrigin }
          });
          this.blockAccess();
          return Promise.reject(new Error('CSRF protection: Invalid referrer'));
        }
      }
      
      return originalFetch(input, init);
    };
  }

  public logSecurityEvent(event: Omit<SecurityEvent, 'timestamp' | 'userAgent'>) {
    if (!this.isClient) return;

    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId()
    };

    this.events.push(securityEvent);
    
    // Security: Store events in localStorage for persistence
    const existingEvents = JSON.parse(localStorage.getItem('securityEvents') || '[]');
    existingEvents.push(securityEvent);
    
    // Keep only last 100 events
    if (existingEvents.length > 100) {
      existingEvents.splice(0, existingEvents.length - 100);
    }
    
    localStorage.setItem('securityEvents', JSON.stringify(existingEvents));

    // Security: Log to console for monitoring
    console.warn(`🔒 Security Event [${event.severity.toUpperCase()}]: ${event.type}`, event.details);

    // Security: Block access for critical events
    if (event.severity === 'critical') {
      this.blockAccess();
    }
  }

  private getCurrentUserId(): string | undefined {
    if (!this.isClient) return undefined;

    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData._id;
      }
    } catch (error) {
      return undefined;
    }
    return undefined;
  }

  private blockAccess() {
    if (!this.isClient) return;

    this.blockedAttempts++;
    
    // Security: Clear sensitive data
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Security: Redirect to login with error
    window.location.href = '/?error=security_violation';
  }

  public getThreatReport(): ThreatReport {
    const criticalEvents = this.events.filter(event => event.severity === 'critical');
    
    return {
      totalEvents: this.events.length,
      criticalEvents: criticalEvents.length,
      lastEvent: this.events[this.events.length - 1] || null,
      blockedAttempts: this.blockedAttempts
    };
  }

  public getSecurityEvents(): SecurityEvent[] {
    return [...this.events];
  }

  public clearEvents() {
    this.events = [];
    if (this.isClient) {
      localStorage.removeItem('securityEvents');
    }
  }

  public startMonitoring() {
    if (!this.isClient || this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Security: Monitor for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'low',
          details: { reason: 'page_hidden' }
        });
      }
    });

    // Security: Monitor for focus changes
    window.addEventListener('blur', () => {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'low',
        details: { reason: 'window_blur' }
      });
    });

    console.log('🔒 Security monitoring activated');
  }

  public stopMonitoring() {
    this.isMonitoring = false;
    console.log('🔒 Security monitoring deactivated');
  }
}

// Export singleton instance
export const securityService = new SecurityService();

// Export types for external use
export type { SecurityEvent, ThreatReport }; 