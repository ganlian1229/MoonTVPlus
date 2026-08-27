/**
 * 用户本地选择的直播源配置。
 * 直播源列表本身由 config.json 的 lives 字段提供，这里只保存选择状态，
 * 这样用户切换直播源后，刷新页面仍会使用上一次选择。
 */
export const LIVE_SOURCE_STORAGE_KEY = 'liveSourceKey';

/** Cookie 名称，供需要在服务端读取当前直播源的场景使用。 */
export const LIVE_SOURCE_COOKIE_NAME = 'moontv-live-source';

/**
 * 规范化直播源 key，避免 localStorage 中残留无效值导致直播页无法初始化。
 */
export function normalizeLiveSourceKey(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}
