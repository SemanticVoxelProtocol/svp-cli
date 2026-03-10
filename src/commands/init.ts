import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

interface InitOptions {
  language: string;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const spinner = ora('Initializing SVP project...').start();

  try {
    // 检查是否已初始化
    const svpDir = path.join(process.cwd(), '.svp');
    try {
      await fs.access(svpDir);
      spinner.fail(chalk.red('SVP already initialized in this project'));
      console.log(chalk.yellow('Run `svp status` to check project status'));
      return;
    } catch {
      // 目录不存在，继续
    }

    // 交互式询问
    spinner.stop();
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: path.basename(process.cwd())
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:'
      },
      {
        type: 'list',
        name: 'language',
        message: 'Target language:',
        choices: ['typescript', 'python', 'go', 'rust'],
        default: options.language
      }
    ]);

    spinner.start('Creating project structure...');

    // 创建目录结构
    await fs.mkdir(svpDir, { recursive: true });
    await fs.mkdir(path.join(svpDir, 'l4'), { recursive: true });
    await fs.mkdir(path.join(svpDir, 'l3'), { recursive: true });
    await fs.mkdir(path.join(svpDir, 'gen', 'blocks'), { recursive: true });

    // 创建 L5 蓝图模板
    const blueprintContent = `# SVP Blueprint (Level 5)
# 这是项目的高层意图描述
# 修改此文件，然后运行: svp compile --level 5

svp_version: "0.1.0"
level: 5

project:
  name: "${answers.projectName}"
  description: "${answers.description}"
  version: "0.1.0"

intent:
  problem: "描述你要解决的核心问题"
  solution: "描述你的解决方案"
  success_criteria:
    - "定义成功的标准"

constraints:
  functional:
    - "功能约束"
  non_functional:
    - "性能约束"

domains:
  - name: "Core"
    responsibility: "核心业务逻辑"
    boundaries:
      in_scope:
        - "核心功能"
      out_of_scope:
        - "外部集成"
    dependencies: []

integrations: []

context:
  designDocs: []
  environment: []
`;

    await fs.writeFile(
      path.join(process.cwd(), 'blueprint.svp.yaml'),
      blueprintContent
    );

    // 创建 .gitignore
    const gitignoreContent = `# SVP Generated Files
# L2-L1 是派生产物，可以从 L3 重新生成
.svp/gen/
src/blocks/*.svp.ts

# SVP Cache
.svp/cache/
`;

    await fs.writeFile(
      path.join(svpDir, '.gitignore'),
      gitignoreContent
    );

    spinner.succeed(chalk.green('SVP project initialized!'));

    console.log('\n' + chalk.cyan('Next steps:'));
    console.log('  1. Edit ' + chalk.bold('blueprint.svp.yaml') + ' to define your project');
    console.log('  2. Run ' + chalk.bold('svp compile --level 5 --ai') + ' to generate L4');
    console.log('  3. Run ' + chalk.bold('svp status') + ' to check project status');

  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize project'));
    console.error(error);
    process.exit(1);
  }
}
