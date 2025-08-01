# Cloudflare Workers 音乐播放器

这是一个基于 Cloudflare Workers 的音乐播放器，具有动态功能，可以直接部署到 Cloudflare 平台。

## 特性

- 轻量级音乐播放器界面
- 响应式设计，支持移动设备
- PWA 支持，可安装为本地应用
- 多个歌单支持（热门、最新、原创等）
- 搜索功能
- 通过 Cloudflare Workers 提供动态服务

## 部署方法

### 方法1：使用 Wrangler CLI（推荐用于完整功能）

1. 安装 [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update)
   ```bash
   npm install -g wrangler
   ```

2. 登录到您的 Cloudflare 账户
   ```bash
   wrangler login
   ```

3. 部署到 Cloudflare Workers
   ```bash
   cd F:\程序\coder\songplayer\cf-music-player-deploy
   wrangler deploy
   ```

### 方法2：使用 Cloudflare Dashboard 手动部署

1. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 导航到 "Workers & Pages" 部分
3. 点击 "Create application" -> "Create Worker"
4. 给您的 Worker 起一个名字
5. 在编辑器中替换默认代码为您项目中的 `src/index.js` 内容
6. 点击 "Save and Deploy"

注意：通过 Dashboard 手动部署时，您需要手动上传所有静态资源文件。

### 方法3：使用 Cloudflare Pages（适用于静态内容）

这种方法适用于仅部署静态内容，但会丢失动态功能：

1. Fork 此仓库
2. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 导航到 "Workers & Pages"
4. 点击 "Create application" -> "Pages"
5. 连接到您的 GitHub 账户并选择此仓库
6. 配置设置：
   - 构建命令: `npm install`
   - 构建输出目录: `public`
7. 点击 "Save and Deploy"

注意：使用 Pages 部署将仅提供静态内容，API 功能将不可用。

## 本地开发

```bash
npm install
wrangler dev
```

## 文件结构

```
├── src/
│   └── index.js          # Worker 入口点，处理动态请求
├── public/               # 静态资源目录
│   ├── playlists/        # 歌单 JSON 文件
│   ├── icons/            # 应用图标
│   ├── screenshots/      # 应用截图
│   ├── index.html        # 主页面
│   ├── style.css         # 样式文件
│   ├── player.js         # 播放器逻辑
│   └── ...               # 其他静态资源
├── wrangler.toml         # Wrangler 配置文件
└── package.json          # 项目依赖和脚本
```

## API 端点

Worker 提供以下 API 端点：

- `GET /api/playlist/:name` - 获取指定歌单数据
- `POST /api/search-songs` - 搜索歌曲
- `POST /api/refresh-playlists` - 刷新歌单（模拟实现）

## 歌单

播放器支持以下歌单：

- `/api/playlist/hot` - 热门歌曲
- `/api/playlist/new` - 最新歌曲
- `/api/playlist/original` - 原创歌曲
- `/api/playlist/soaring` - 飙升歌曲
- `/api/playlist/costomer` - 用户自定义歌单
- `/api/playlist/search` - 搜索结果

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。