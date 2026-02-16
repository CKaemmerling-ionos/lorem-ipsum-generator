/**
 * Lifecycle Hooks - MEDIUM Tier
 *
 * Provides hooks for component lifecycle events.
 * Automatically included for MEDIUM and HIGH tier components.
 */

export type HookType = 'pre-deploy' | 'post-deploy' | 'pre-shutdown' | 'post-shutdown';

export interface LifecycleHook {
  type: HookType;
  name: string;
  execute: () => Promise<void>;
}

export class LifecycleManager {
  private hooks: Map<HookType, LifecycleHook[]> = new Map();

  /**
   * Register a lifecycle hook
   */
  registerHook(hook: LifecycleHook): void {
    const hooks = this.hooks.get(hook.type) || [];
    hooks.push(hook);
    this.hooks.set(hook.type, hooks);
  }

  /**
   * Execute all hooks for a specific lifecycle event
   */
  async executeHooks(type: HookType): Promise<void> {
    const hooks = this.hooks.get(type) || [];

    console.log(`Executing ${hooks.length} ${type} hooks...`);

    for (const hook of hooks) {
      try {
        await hook.execute();
        console.log(`✓ ${hook.name} completed`);
      } catch (error) {
        console.error(`✗ ${hook.name} failed:`, error);
        throw error;
      }
    }
  }
}

// Example usage
export function setupDefaultHooks(manager: LifecycleManager): void {
  manager.registerHook({
    type: 'pre-deploy',
    name: 'validate-environment',
    execute: async () => {
      console.log('Validating deployment environment...');
      // Add validation logic here
    }
  });

  manager.registerHook({
    type: 'post-deploy',
    name: 'warm-up-cache',
    execute: async () => {
      console.log('Warming up cache...');
      // Add cache warmup logic here
    }
  });

  manager.registerHook({
    type: 'pre-shutdown',
    name: 'graceful-shutdown',
    execute: async () => {
      console.log('Initiating graceful shutdown...');
      // Add cleanup logic here
    }
  });
}
