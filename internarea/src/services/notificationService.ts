export interface NotificationData {
  type: 'accepted' | 'rejected';
  title: string;
  company: string;
}

class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.checkPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      console.log('[NotificationService] checkPermission:', this.permission);
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('[NotificationService] This browser does not support notifications');
      return false;
    }
    if (this.permission === 'granted') {
      console.log('[NotificationService] Permission already granted');
      return true;
    }
    if (this.permission === 'denied') {
      console.warn('[NotificationService] Notification permission denied');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      console.log('[NotificationService] Permission requested, result:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('[NotificationService] Error requesting notification permission:', error);
      return false;
    }
  }

  public async showNotification(data: NotificationData): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('[NotificationService] This browser does not support notifications');
      return;
    }
    if (this.permission !== 'granted') {
      console.warn('[NotificationService] Notification permission not granted');
      return;
    }
    try {
      const message = data.type === 'accepted' 
        ? `🎉 You've been hired for ${data.title}`
        : `Your application for ${data.title} was rejected`;
      console.log('[NotificationService] Showing notification:', message, data);
      const notification = new Notification(message, {
        body: `${data.company}`,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: `application-${data.type}-${Date.now()}`,
        requireInteraction: false,
        silent: false
      });
      setTimeout(() => {
        notification.close();
      }, 5000);
      notification.onclick = () => {
        window.focus();
        notification.close();
        window.location.href = '/userapplication';
      };
    } catch (error) {
      console.error('[NotificationService] Error showing notification:', error);
    }
  }

  public isSupported(): boolean {
    return 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    return this.permission;
  }
}

export default NotificationService; 