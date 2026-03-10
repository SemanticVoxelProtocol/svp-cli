# SVP-CLI

Semantic Voxel Protocol - Command Line Interface

SVP 命令行工具，用于项目初始化、AI 编译、开发服务器和项目管理。

## 安装

```bash
npm install -g @semanticvoxelprotocol/cli
```

## 快速开始

```bash
# 初始化新项目
svp init

# 配置 AI API Key
echo "OPENAI_API_KEY=sk-xxx" > .env

# AI 编译全部层级
svp compile --all --ai

# 或分步编译
svp compile --level 5 --ai  # L5→L4
svp compile --level 4 --ai  # L4→L3
svp compile --level 3 --ai  # L3→L2
svp compile --level 2 --ai  # L2→L1
```

## 命令参考

### `svp init`

初始化新项目，创建 `blueprint.svp.yaml` 和 `.env` 文件。

```bash
svp init
svp init --template typescript  # 使用 TypeScript 模板
```

### `svp compile`

编译指定层级或全部层级。

```bash
# 本地编译（L1→L0，不需要 AI）
svp compile --level 1

# AI 编译（L5-L2 需要 AI）
svp compile --level 5 --ai
svp compile --level 4 --ai
svp compile --level 3 --ai
svp compile --level 2 --ai

# 编译全部层级
svp compile --all --ai
```

### `svp dev`

启动开发模式，监听文件变化并自动编译。

```bash
svp dev
```

### `svp status`

查看项目状态和编译进度。

```bash
svp status
```

### `svp serve`

启动 MCP (Model Context Protocol) 服务器，供编辑器插件使用。

```bash
svp serve
```

## 配置

### `.env` 文件

```bash
# AI Provider 选择
SVP_AI_PROVIDER=openai

# API Key
OPENAI_API_KEY=sk-your-key

# 可选：自定义 Base URL
OPENAI_BASE_URL=https://api.openai.com/v1

# 可选：层级特定模型
SVP_L5_MODEL=gpt-4o
SVP_L4_MODEL=gpt-4o-mini
SVP_L3_MODEL=gpt-4o-mini
SVP_L2_MODEL=gpt-4o-mini

# 或 DeepSeek
# SVP_AI_PROVIDER=deepseek
# DEEPSEEK_API_KEY=sk-your-key
# SVP_L5_MODEL=deepseek-chat
```

### `blueprint.svp.yaml`

```yaml
svpVersion: "0.1.0"
level: 5
project:
  name: "my-service"
  description: "服务描述"
  version: "1.0.0"
intent:
  problem: "要解决的问题"
  solution: "解决方案"
  successCriteria: ["指标1", "指标2"]
domains:
  - name: "Domain1"
    responsibility: "职责描述"
    dependencies: []
```

## 项目结构

```
my-project/
├── blueprint.svp.yaml      # L5: 意图定义
├── .env                     # AI 配置
├── .svp/
│   ├── l4/flows.yaml       # L4: 架构层
│   ├── l3/domain.yaml      # L3: 逻辑层
│   └── gen/blocks/         # L2: 代码骨架
├── src/
│   └── blocks/             # L1: 实现代码
└── dist/                   # L0: 编译输出
```

## 工作流程

```
┌─────────────────────────────────────────────────────┐
│  人类编写                   AI 编译                   │
│  ─────────────────────────────────────────────────  │
│  blueprint.svp.yaml  →  L4/L3/L2/L1  →  可运行代码   │
│  (L5 意图层)              (自动生成)      (L0 输出)   │
└─────────────────────────────────────────────────────┘
```

1. **编辑 L5** - 修改 `blueprint.svp.yaml` 定义业务意图
2. **AI 编译** - 运行 `svp compile --all --ai` 生成代码
3. **查看结果** - 检查 `src/blocks/` 中的实现
4. **本地构建** - 运行 `svp compile --level 1` 生成可运行代码

## 开发

```bash
# 克隆仓库
git clone https://github.com/SemanticVoxelProtocol/svp-cli.git
cd svp-cli

# 安装依赖
npm install

# 构建
npm run build

# 本地链接测试
npm link
svp --help
```

## License

MIT
