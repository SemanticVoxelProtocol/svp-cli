import chalk from 'chalk';
import { SVPEngine, SVPWatcher } from '@semanticvoxelprotocol/core';

export async function devCommand(): Promise<void> {
  console.log(chalk.cyan('SVP Development Mode'));
  console.log();
  console.log(chalk.gray('Watching for changes in L5-L3...'));
  console.log(chalk.gray('Press Ctrl+C to stop'));
  console.log();

  const engine = new SVPEngine({
    projectPath: process.cwd(),
    targetLanguage: 'typescript',
    incremental: true
  });

  const watcher = new SVPWatcher({
    projectPath: process.cwd(),
    onChange: async (event) => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(chalk.gray(`[${timestamp}] ${event.type}: ${path.basename(event.path)}`));

      if (event.level) {
        console.log(chalk.cyan(`  → Recompiling L${event.level}...`));
        
        try {
          const result = await engine.compile({ 
            level: event.level as 5 | 4 | 3 | 2 
          });

          if (result.success) {
            console.log(chalk.green(`  ✓ L${event.level} compiled`));
          } else {
            console.log(chalk.red(`  ✗ Compilation failed:`));
            result.errors.forEach(err => {
              console.log(chalk.red(`    - ${err.message}`));
            });
          }
        } catch (error) {
          console.log(chalk.red(`  ✗ Error: ${error}`));
        }
      }
    }
  });

  watcher.start();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log(chalk.gray('\n\nStopping development server...'));
    await watcher.stop();
    console.log(chalk.green('Goodbye!'));
    process.exit(0);
  });
}

import * as path from 'path';
