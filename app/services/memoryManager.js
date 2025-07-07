// Memory Management Service for bitscribe
const os = require('os');

class MemoryManager {
  constructor() {
    this.isMonitoring = false;
    this.memoryTimer = null;
    this.warningThreshold = 2000 * 1024 * 1024; // 2GB - much more reasonable
    this.criticalThreshold = 1000 * 1024 * 1024; // 1GB
    this.listeners = [];
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🧠 Memory Manager: Starting monitoring');
    
    // Check memory every 30 seconds to reduce overhead
    this.memoryTimer = setInterval(() => {
      this.checkMemory();
    }, 30000);
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    console.log('🧠 Memory Manager: Stopping monitoring');
    
    if (this.memoryTimer) {
      clearInterval(this.memoryTimer);
      this.memoryTimer = null;
    }
  }

  checkMemory() {
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const usagePercent = (usedMem / totalMem) * 100;

    const memInfo = {
      free: Math.floor(freeMem / 1024 / 1024), // MB
      total: Math.floor(totalMem / 1024 / 1024), // MB
      used: Math.floor(usedMem / 1024 / 1024), // MB
      usagePercent: Math.floor(usagePercent)
    };

    // Emit warnings based on thresholds
    if (freeMem < this.criticalThreshold) {
      this.emitMemoryEvent('critical', memInfo);
      this.forceCleanup();
    } else if (freeMem < this.warningThreshold) {
      this.emitMemoryEvent('warning', memInfo);
      this.performCleanup();
    }

    return memInfo;
  }

  performCleanup() {
    console.log('🧹 Memory Manager: Performing cleanup');
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    this.emitMemoryEvent('cleanup', { type: 'soft' });
  }

  forceCleanup() {
    console.log('🚨 Memory Manager: Performing FORCE cleanup');
    
    // Multiple garbage collection cycles for critical situations
    if (global.gc) {
      global.gc();
      setTimeout(() => global.gc(), 100);
      setTimeout(() => global.gc(), 500);
      setTimeout(() => global.gc(), 1000);
      setTimeout(() => global.gc(), 2000);
    }
    
    // Emergency memory cleanup
    this.emergencyCleanup();
    
    this.emitMemoryEvent('cleanup', { type: 'force' });
  }

  emergencyCleanup() {
    console.log('🆘 Emergency memory cleanup initiated');
    
    try {
      // Clear any large buffers or caches
      if (global.whisperCache) {
        global.whisperCache.clear();
      }
      
      // Clear require cache for non-essential modules (except core modules)
      Object.keys(require.cache).forEach(key => {
        if (key.includes('node_modules') && !key.includes('electron')) {
          try {
            delete require.cache[key];
          } catch (e) {
            // Ignore errors during cleanup
          }
        }
      });
      
      // Force memory reclaim
      if (process.memoryUsage) {
        const usage = process.memoryUsage();
        console.log('📊 Process memory:', {
          rss: Math.floor(usage.rss / 1024 / 1024) + 'MB',
          heapUsed: Math.floor(usage.heapUsed / 1024 / 1024) + 'MB',
          heapTotal: Math.floor(usage.heapTotal / 1024 / 1024) + 'MB'
        });
      }
      
    } catch (error) {
      console.error('Emergency cleanup error:', error);
    }
  }

  onMemoryEvent(callback) {
    this.listeners.push(callback);
  }

  emitMemoryEvent(type, data) {
    this.listeners.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        console.error('Memory event listener error:', error);
      }
    });
  }

  getMemoryStats() {
    const process = require('process');
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const processMemory = process.memoryUsage();

    return {
      system: {
        free: Math.floor(freeMem / 1024 / 1024),
        total: Math.floor(totalMem / 1024 / 1024),
        used: Math.floor((totalMem - freeMem) / 1024 / 1024),
        usagePercent: Math.floor(((totalMem - freeMem) / totalMem) * 100)
      },
      process: {
        rss: Math.floor(processMemory.rss / 1024 / 1024),
        heapTotal: Math.floor(processMemory.heapTotal / 1024 / 1024),
        heapUsed: Math.floor(processMemory.heapUsed / 1024 / 1024),
        external: Math.floor(processMemory.external / 1024 / 1024)
      }
    };
  }

  destroy() {
    this.stopMonitoring();
    this.listeners = [];
  }
}

// Create singleton instance
const memoryManager = new MemoryManager();

module.exports = {
  memoryManager,
  startMemoryMonitoring: () => memoryManager.startMonitoring(),
  stopMemoryMonitoring: () => memoryManager.stopMonitoring(),
  getMemoryStats: () => memoryManager.getMemoryStats(),
  onMemoryEvent: (callback) => memoryManager.onMemoryEvent(callback)
};