import chalk from 'chalk';
import ora from 'ora';
import { SVPEngine, CompilePipeline } from '@semanticvoxelprotocol/core';
import { SVPWatcher } from '@semanticvoxelprotocol/core';

interface BuildOptions {
  watch?: boolean;
}

export async function buildCommand(options: BuildOptions): Promise<void> {
  const spinner = ora('Running compilation pipeline...').start();

  try {
    const engine = new SVPEngine({
      projectPath: process.cwd(),
      targetLanguage: 'typescript'
    });

    const pipeline = new CompilePipeline(engine);
    const result = await pipeline.run({ from: 5, to: 1 });

    if (result.success) {
      spinner.succeed(chalk.green('Build completed successfully!'));
      console.log();
      console.log(chalk.cyan('Compilation results:'));
      result.results.forEach((res, level) => {
        const status = res.success ? chalk.green('✓') : chalk.red('✗');
        console.log(`  ${status} L${level} → L${level - 1}`);
      });

      if (options.watch) {
        console.log();
        console.log(chalk.cyan('Watching for changes...'));
        
        const watcher = new SVPWatcher({
          projectPath: process.cwd(),
          onChange: (event) => {
            console.log(chalk.gray(`[${event.type}] ${event.path}`));
            if (event.level) {
              console.log(chalk.cyan(`Recompiling L${event.level}...`));
              // Trigger recompilation
            }
          }
        });

        watcher.start();

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
          console.log(chalk.gray('\nStopping watcher...'));
          await watcher.stop();
          process.exit(0);
        });
      }
    } else {
      spinner.fail(chalk.red('Build failed'));
      result.errors.forEach(err => {
        console.error(chalk.red(`  [L${err.level}] ${err.message}`));
      });
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.red('Build failed'));
    console.error(error);
    process.exit(1);
  }
}
