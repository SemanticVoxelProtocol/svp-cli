# SVP-CLI

Semantic Voxel Protocol - Command Line Interface

SVP 命令行工具，用于项目初始化、编译和管理。

## 安装

```bash
npm install -g @semanticvoxelprotocol/cli
```

## 使用

```bash
# 初始化项目
svp init

# 编译指定层级
svp compile --level 5
svp compile --level 4
svp compile --level 3

# 完整编译管道
svp build

# 启动开发模式（监听变化）
svp dev

# 查看项目状态
svp status

# 启动 MCP Server
svp serve
```
