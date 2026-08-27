export const PLAYBACK_SOURCE_SET_STORAGE_KEY = 'playbackSourceSet';
export const PLAYBACK_SOURCE_SET_COOKIE_NAME = 'moontv_playback_source_set';

export type PlaybackSourceSet = 'default' | 'more' | 'adult';

export const PLAYBACK_SOURCE_SET_OPTIONS: Array<{
  value: PlaybackSourceSet;
  label: string;
  fileName: string;
  description: string;
}> = [
  {
    value: 'default',
    label: '默认播放源',
    fileName: 'config.json',
    description: '默认使用，加载经过筛选的常用播放源',
  },
  {
    value: 'more',
    label: '更多播放源',
    fileName: 'config.candidates.json',
    description: '加载 GitHub 汇总的更多候选播放源',
  },
  {
    value: 'adult',
    label: '成人播放源',
    fileName: 'config.adult.json',
    description: '仅限成年人主动选择使用',
  },
];

/**
 * 将外部存储或 Cookie 中的值规范化为项目支持的播放源配置集。
 * 未知值、空值和旧版本遗留值统一回退到默认播放源，避免服务端加载任意文件。
 */
export function normalizePlaybackSourceSet(
  value: string | null | undefined
): PlaybackSourceSet {
  if (value === 'more' || value === 'adult') {
    return value;
  }

  return 'default';
}

/**
 * 从请求 Cookie 的原始值解析播放源配置集。
 * 路由层负责读取 Cookie，避免共享配置模块依赖仅服务端可用的 next/headers。
 */
export function getPlaybackSourceSetFromCookieValue(
  value: string | null | undefined
): PlaybackSourceSet {
  return normalizePlaybackSourceSet(value);
}

/**
 * 生成用于浏览器缓存键的稳定片段，使三套播放源的搜索结果互不复用。
 * 调用方可以直接传入 localStorage 中的原始值，函数会先完成白名单规范化。
 */
export function getPlaybackSourceSetCacheToken(
  value: string | null | undefined
): string {
  return `source-${normalizePlaybackSourceSet(value)}`;
}
