#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { SVPEngine, CompilePipeline } from '@semanticvoxelprotocol/core';
import { initCommand } from './commands/init';
import { compileCommand } from './commands/compile';
import { buildCommand } from './commands/build';
import { statusCommand } from './commands/status';
import { serveCommand } from './commands/serve';
import { devCommand } from './commands/dev';

const program = new Command();

program
  .name('svp')
  .description('Semantic Voxel Protocol CLI')
  .version('0.1.0');

// svp init
program
  .command('init')
  .description('Initialize SVP for current project')
  .option('-l, --language <lang>', 'Target language', 'typescript')
  .action(initCommand);

// svp compile
program
  .command('compile')
  .description('Compile specified level to next level')
  .requiredOption('--level <level>', 'Level to compile (5, 4, 3, 2)')
  .option('-t, --target <target>', 'Specific block target')
  .option('--dry-run', 'Dry run without writing files')
  .option('--ai', 'Use AI compiler (required for L5-L2)')
  .action(compileCommand);

// svp build
program
  .command('build')
  .description('Run full compilation pipeline (L5 → L1)')
  .option('-w, --watch', 'Watch for changes')
  .action(buildCommand);

// svp dev
program
  .command('dev')
  .description('Start development mode with file watching')
  .action(devCommand);

// svp status
program
  .command('status')
  .description('Show project status')
  .action(statusCommand);

// svp serve
program
  .command('serve')
  .description('Start MCP Server')
  .option('-p, --port <port>', 'Port number', '8080')
  .action(serveCommand);

program.parse();
