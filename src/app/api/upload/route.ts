import { NextRequest, NextResponse } from 'next/server'
import { getPublicUrl, getSignedUrlForUpload } from '@/lib/r2'

export async function POST(request: NextRequest) {
  const { fileName, fileType } = await request.json()
  console.log('Upload request received', { fileName, fileType })
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'Missing fileName or fileType' },
        { status: 400 }
      )
    }

  try {
    const signedUrl = await getSignedUrlForUpload(fileName, fileType)
    const publicUrl = await getPublicUrl(fileName)
    console.log("99999999999999999",publicUrl)
    console.log('Signed URL:', signedUrl)

    return NextResponse.json({ signedUrl })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error generating signed URL' },
      { status: 500 }
    )
  }
}
