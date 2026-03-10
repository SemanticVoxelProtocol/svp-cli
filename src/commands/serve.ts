import chalk from 'chalk';
import ora from 'ora';

interface ServeOptions {
  port: string;
}

export async function serveCommand(options: ServeOptions): Promise<void> {
  const port = parseInt(options.port, 10);

  console.log(chalk.cyan('Starting SVP MCP Server...'));
  console.log();
  console.log(chalk.gray('Server configuration:'));
  console.log(`  Port: ${chalk.white(port)}`);
  console.log(`  Transport: ${chalk.white('stdio')}`);
  console.log();
  
  const spinner = ora('MCP Server starting...').start();

  try {
    // 这里会启动 MCP Server
    // 简化版：提示用户使用 svp-mcp 包
    spinner.stop();
    
    console.log(chalk.yellow('MCP Server is provided by @semanticvoxelprotocol/mcp-server package'));
    console.log();
    console.log(chalk.gray('To start the server:'));
    console.log(`  npx @semanticvoxelprotocol/mcp-server --port ${port}`);
    console.log();
    console.log(chalk.gray('Or configure in Cursor/Claude Code:'));
    console.log(chalk.white(JSON.stringify({
      mcpServers: {
        svp: {
          command: 'npx',
          args: ['@semanticvoxelprotocol/mcp-server', '--project', '.']
        }
      }
    }, null, 2)));

  } catch (error) {
    spinner.fail(chalk.red('Failed to start server'));
    console.error(error);
    process.exit(1);
  }
}
