import chalk from 'chalk';
import ora from 'ora';
import { SVPEngine } from '@semanticvoxelprotocol/core';

interface CompileOptions {
  level: string;
  target?: string;
  dryRun?: boolean;
  ai?: boolean;
}

export async function compileCommand(options: CompileOptions): Promise<void> {
  const level = parseInt(options.level, 10);

  if (![5, 4, 3, 2].includes(level)) {
    console.error(chalk.red(`Invalid level: ${level}. Must be 5, 4, 3, or 2.`));
    process.exit(1);
  }

  if (level !== 5 && !options.ai) {
    console.log(chalk.yellow('⚠️  Compiling L4-L2 requires AI compiler.'));
    console.log(chalk.gray('Add --ai flag or use MCP integration.'));
    console.log();
  }

  const spinner = ora(`Compiling Level ${level} → Level ${level - 1}...`).start();

  try {
    const engine = new SVPEngine({
      projectPath: process.cwd(),
      targetLanguage: 'typescript'
    });

    const result = await engine.compile({
      level: level as 5 | 4 | 3 | 2,
      target: options.target,
      dryRun: options.dryRun
    });

    if (result.success) {
      spinner.succeed(chalk.green(`Level ${level} compiled successfully!`));
      
      if (options.dryRun) {
        console.log(chalk.gray('(Dry run - no files were written)'));
      }
    } else {
      spinner.fail(chalk.red(`Compilation failed`));
      result.errors.forEach(err => {
        console.error(chalk.red(`  [L${err.level}] ${err.message}`));
        if (err.file) {
          console.error(chalk.gray(`    at ${err.file}:${err.line}`));
        }
      });
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.red('Compilation failed'));
    console.error(error);
    process.exit(1);
  }
}
