/**
 * Health Check - MEDIUM Tier Monitoring
 *
 * Provides basic health monitoring for MEDIUM tier components.
 * Automatically included for MEDIUM and HIGH tier components.
 */

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  checks: HealthCheck[];
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail';
  message?: string;
}

export class HealthMonitor {
  private readonly checkInterval = 30000; // 30 seconds for MEDIUM tier

  /**
   * Performs basic health checks for the component
   */
  async checkHealth(): Promise<HealthStatus> {
    const checks: HealthCheck[] = [];

    // Basic uptime check
    checks.push({
      name: 'uptime',
      status: 'pass',
      message: 'Component is running'
    });

    // Memory check
    const memoryUsage = process.memoryUsage();
    checks.push({
      name: 'memory',
      status: memoryUsage.heapUsed < 500 * 1024 * 1024 ? 'pass' : 'fail',
      message: `Heap used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
    });

    const allPassing = checks.every(c => c.status === 'pass');

    return {
      status: allPassing ? 'healthy' : 'degraded',
      timestamp: Date.now(),
      checks
    };
  }

  /**
   * Starts periodic health monitoring
   */
  startMonitoring(): void {
    setInterval(() => {
      this.checkHealth().then(status => {
        if (status.status !== 'healthy') {
          console.warn('Health check warning:', status);
        }
      });
    }, this.checkInterval);
  }
}
