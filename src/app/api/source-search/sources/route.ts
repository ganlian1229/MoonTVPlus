import { NextRequest, NextResponse } from 'next/server';

import { getAuthInfoFromCookie } from '@/lib/auth';
import { getAvailableApiSites } from '@/lib/config';
import {
  getPlaybackSourceSetFromCookieValue,
  PLAYBACK_SOURCE_SET_COOKIE_NAME,
} from '@/lib/playback-source-set';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo || !authInfo.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const includeSpecialSources = request.nextUrl.searchParams.get('special') === '1';
    const playbackSourceSet = getPlaybackSourceSetFromCookieValue(
      request.cookies.get(PLAYBACK_SOURCE_SET_COOKIE_NAME)?.value
    );
    const apiSites = await getAvailableApiSites(
      authInfo.username,
      includeSpecialSources,
      playbackSourceSet
    );

    return NextResponse.json({
      sources: apiSites.map((site) => ({
        key: site.key,
        name: site.name,
        api: site.api,
      })),
    });
  } catch (error) {
    console.error('Failed to get available API sites:', error);
    return NextResponse.json(
      { error: 'Failed to load sources' },
      { status: 500 }
    );
  }
}
