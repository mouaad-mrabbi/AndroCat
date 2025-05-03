import { NextRequest, NextResponse } from 'next/server';
import probe from 'probe-image-size';
import { Readable } from 'stream';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url query parameter' }, { status: 400 });
  }

  try {
    const headResponse = await fetch(url, { method: 'HEAD' });

    if (!headResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch file info' }, { status: headResponse.status });
    }

    const contentType = headResponse.headers.get('content-type');
    const contentLength = headResponse.headers.get('content-length');

    if (contentType && contentType.startsWith('image/')) {
 
      const imageResponse = await fetch(url);

      if (!imageResponse.ok || !imageResponse.body) {
        return NextResponse.json({ error: 'Failed to fetch image for dimensions' }, { status: imageResponse.status });
      }

      const nodeStream = Readable.fromWeb(imageResponse.body as any);

      const result = await probe(nodeStream);

      return NextResponse.json({
        type: contentType,
        size: contentLength,
        width: result.width,
        height: result.height,
      });
    }

    return NextResponse.json({
      type: contentType,
      size: contentLength,
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', detail: (error as Error).message },
      { status: 500 }
    );
  }
}
