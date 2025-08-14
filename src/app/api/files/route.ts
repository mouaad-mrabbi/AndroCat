import { NextRequest, NextResponse } from 'next/server'
import { listFiles, getSignedUrlForDownload, deleteFile } from '@/lib/r2'

//get all 
export async function GET() {
  try {
    const files = await listFiles()
    return NextResponse.json(files)
  } catch (error) {
    return NextResponse.json({ error: 'Error listing files' }, { status: 500 })
  }
}

//Download
export async function POST(request: NextRequest) {
  const { key } = await request.json()

  try {
    const signedUrl = await getSignedUrlForDownload(key)
    return NextResponse.json({ signedUrl })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error generating download URL' },
      { status: 500 }
    )
  }
}

//DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: 'Missing file key' }, { status: 400 });
    }

    const result = await deleteFile(key);

    return NextResponse.json({ message: 'File deleted successfully', result });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error deleting file', details: error.message }, { status: 500 });
  }
}
