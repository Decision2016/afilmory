# Solan's Gallery：Vercel 部署

- 站点地址：<https://gallery.decision01.com>
- 图片地址：<https://images.decision01.com>
- 存储桶：`gallery-1251463330`，地域：`ap-tokyo`。

## 导入项目

将本仓库导入 Vercel，设置：

| 设置 | 值 |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | `apps/ssr` |
| Include source files outside of the Root Directory in the Build Step | 开启 |
| Node.js Version | `24.x` |
| Install Command | 使用 `apps/ssr/vercel.json` 中的命令 |
| Build Command | 使用 `apps/ssr/vercel.json` 中的命令 |
| Output Directory | 保持默认 `.next` |

添加环境变量，至少用于 Production；若需要预览部署，也勾选 Preview：

| 环境变量 | 值 |
| --- | --- |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1` |
| `COS_SECRET_ID` | 腾讯云 API SecretId |
| `COS_SECRET_KEY` | 腾讯云 API SecretKey |

凭证只在 Vercel 环境变量中填写，不放入 Git。使用有该桶读取、列举权限的凭证。
桶名、东京地域和图片 HTTPS 域名已经设置默认值，无需重复填写。
`COS_PREFIX` 默认空字符串，扫描整个桶；如果只想展示 `photos/` 下的文件，设置为 `photos/`。

## 图片访问

照片需要先上传至 COS。`images.decision01.com` 应指向同一存储桶，并已部署有效的 SSL 证书。
照片需允许公开读取；COS CORS 中允许来自 `https://gallery.decision01.com` 的 `GET`、`HEAD` 请求。
若需要 Vercel 预览域名也能查看原图，应另行允许对应来源。

构建会通过 COS 读取照片、生成元数据和缩略图，再构建 Web 与 Next.js。
无需额外运行 `build:manifest`。当前配置最多列举 1000 个对象，包括非图片文件。

## 绑定图库域名

部署成功后，在 Vercel 项目的 Settings → Domains 添加 `gallery.decision01.com`，
按照 Vercel 当时显示的记录配置 DNS。图片域名继续指向 COS。

站点名称、标题、描述、作者博客地址和 GitHub 链接在 `config.example.json` 中。
安装时脚本会生成被 Git 忽略的 `config.json` 和 `builder.config.ts`；
云端部署读取已提交的模板，因此之后修改配置时也应更新对应模板。
默认界面语言为简体中文，已有的手动语言选择仍优先。

Vercel 使用控制台注入的环境变量，无需上传 `.env` 文件。

参考：[Vercel Node.js 版本](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)、
[Vercel 包管理器与 Corepack](https://vercel.com/docs/package-managers)。
