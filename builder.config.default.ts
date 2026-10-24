import process from 'node:process'

import { defineBuilderConfig, githubRepoSyncPlugin } from '@afilmory/builder'

import { env } from './env.js'

export default defineBuilderConfig(() => ({
  storage: {
    provider: 'cos',
    bucket: env.COS_BUCKET_NAME,
    region: env.COS_REGION,
    accessKeyId: env.COS_SECRET_ID,
    secretAccessKey: env.COS_SECRET_KEY,
    prefix: env.COS_PREFIX,
    customDomain: env.COS_CUSTOM_DOMAIN,
    maxFileLimit: 1000,
    keepAlive: true,
    maxSockets: 64,
    connectionTimeoutMs: 5_000,
    socketTimeoutMs: 30_000,
    requestTimeoutMs: 20_000,
    idleTimeoutMs: 10_000,
    totalTimeoutMs: 60_000,
    retryMode: 'standard',
    maxAttempts: 3,
    downloadConcurrency: 2,
  },
  system: {
    processing: {
      defaultConcurrency: 2,
      enableLivePhotoDetection: true,
      digestSuffixLength: 8,
      xmp: {
        keywords: true,
        regions: true,
      },
    },
    observability: {
      showProgress: true,
      showDetailedStats: true,
      logging: {
        verbose: false,
        level: 'info',
        outputToFile: false,
      },
      performance: {
        worker: {
          workerCount: 2,
          timeout: 30_000,
          useClusterMode: false,
          workerConcurrency: 2,
        },
      },
    },
  },
  // plugins: [thumbnailStoragePlugin()],
  plugins: [
    githubRepoSyncPlugin({
      repo: {
        enable: false,
        url: process.env.BUILDER_REPO_URL ?? '',
        token: env.GIT_TOKEN,
        branch: process.env.BUILDER_REPO_BRANCH ?? 'main',
      },
    }),
  ],
}))
