import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';
import * as YAML from 'yaml';

export async function statusCommand(): Promise<void> {
  console.log(chalk.cyan.bold('SVP Project Status'));
  console.log();

  try {
    // 检查项目结构
    const svpDir = path.join(process.cwd(), '.svp');
    
    try {
      await fs.access(svpDir);
    } catch {
      console.log(chalk.red('❌ SVP not initialized'));
      console.log(chalk.gray('Run `svp init` to initialize the project'));
      return;
    }

    // 检查各层级状态
    const levels = [
      { level: 5, file: 'blueprint.svp.yaml', name: 'Blueprint' },
      { level: 4, file: '.svp/l4/flows.yaml', name: 'Logic Chain' },
      { level: 3, file: '.svp/l3', name: 'Logic Blocks', isDir: true },
      { level: 2, file: '.svp/gen/blocks', name: 'Code Blocks', isDir: true },
      { level: 1, file: 'src/blocks', name: 'Generated Code', isDir: true },
    ];

    console.log(chalk.gray('Level Status:'));
    
    for (const { level, file, name, isDir } of levels) {
      const filePath = path.join(process.cwd(), file);
      let exists = false;
      
      try {
        const stat = await fs.stat(filePath);
        exists = isDir ? stat.isDirectory() : stat.isFile();
      } catch {
        exists = false;
      }

      const icon = exists ? chalk.green('✓') : chalk.gray('○');
      const label = exists ? chalk.white(name) : chalk.gray(name);
      console.log(`  ${icon} L${level}: ${label}`);
    }

    // 读取 L5 信息
    console.log();
    try {
      const blueprintPath = path.join(process.cwd(), 'blueprint.svp.yaml');
      const content = await fs.readFile(blueprintPath, 'utf-8');
      const blueprint = YAML.parse(content);

      console.log(chalk.gray('Project Info:'));
      console.log(`  Name: ${chalk.white(blueprint.project?.name || 'N/A')}`);
      console.log(`  Description: ${chalk.white(blueprint.project?.description || 'N/A')}`);
      console.log(`  Domains: ${chalk.white(blueprint.domains?.length || 0)}`);
    } catch {
      console.log(chalk.yellow('⚠ Could not read blueprint'));
    }

    console.log();
    console.log(chalk.gray('Next steps:'));
    console.log('  • Run `svp compile --level 5 --ai` to generate L4');
    console.log('  • Run `svp build` for full compilation');

  } catch (error) {
    console.error(chalk.red('Error checking status:'), error);
  }
}
