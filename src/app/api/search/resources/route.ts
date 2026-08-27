/* eslint-disable no-console */

import { NextRequest, NextResponse } from 'next/server';

import { getAvailableApiSites } from '@/lib/config';
import {
  getPlaybackSourceSetFromCookieValue,
  PLAYBACK_SOURCE_SET_COOKIE_NAME,
} from '@/lib/playback-source-set';
import { listEnabledSourceScripts } from '@/lib/source-script';

export const runtime = 'nodejs';

// OrionTV 兼容接口
export async function GET(request: NextRequest) {
  console.log('request', request.url);
  try {
    const playbackSourceSet = getPlaybackSourceSetFromCookieValue(
      request.cookies.get(PLAYBACK_SOURCE_SET_COOKIE_NAME)?.value
    );
    const apiSites = await getAvailableApiSites(
      undefined,
      false,
      playbackSourceSet
    );
    const scriptSites = (await listEnabledSourceScripts()).map((item) => ({
      key: item.key,
      name: item.name,
      script: true,
    }));

    return NextResponse.json([...apiSites, ...scriptSites]);
  } catch (error) {
    return NextResponse.json({ error: '获取资源失败' }, { status: 500 });
  }
}
