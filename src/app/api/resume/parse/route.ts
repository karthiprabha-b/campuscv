export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { runResumePipeline } from '@/resume/parseResume';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, code: 'NO_FILE_PROVIDED', error: 'No file provided in upload request.' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, code: 'EMPTY_UPLOAD', error: 'Uploaded file is empty (0 bytes).' },
        { status: 400 }
      );
    }

    const fileName = file.name || 'resume.pdf';
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

    if (ext !== '.pdf' && ext !== '.docx') {
      return NextResponse.json(
        {
          success: false,
          code: 'UNSUPPORTED_FORMAT',
          error: 'Unsupported file format. CampusCV accepts PDF (.pdf) and Word (.docx) files.'
        },
        { status: 422 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json(
        { success: false, code: 'EMPTY_ARRAY_BUFFER', error: 'ArrayBuffer contains 0 bytes.' },
        { status: 400 }
      );
    }

    // Execute master server-side resume normalization & parsing pipeline with secondary OCR
    const pipelineResult = await runResumePipeline(buffer, fileName);

    if (!pipelineResult.quality.usable || pipelineResult.cleanText.length < 50) {
      const code = pipelineResult.code || 'OCR_NO_USABLE_TEXT';
      return NextResponse.json(
        {
          success: false,
          code,
          error: pipelineResult.reason || "We couldn't detect enough readable text in this resume.",
          diagnostics: {
            fileName,
            fileType: file.type || (ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf'),
            fileSize: file.size,
            extractionMethod: pipelineResult.extractionMethod,
            pageCount: pipelineResult.pageCount || 1,
            rawCharacters: pipelineResult.rawText.length,
            cleanCharacters: pipelineResult.cleanText.length,
            ocrRequired: pipelineResult.ocrRequired,
            ocrTriggered: pipelineResult.ocrTriggered,
            ocrStatus: pipelineResult.ocrStatus,
            ocrConfidence: pipelineResult.ocrConfidence
          }
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      code: 'SUCCESS',
      diagnostics: {
        fileName,
        fileType: file.type || (ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf'),
        fileSize: file.size,
        bufferSize: buffer.length,
        extractionMethod: pipelineResult.extractionMethod,
        pageCount: pipelineResult.pageCount || 1,
        rawCharacters: pipelineResult.rawText.length,
        cleanCharacters: pipelineResult.cleanText.length,
        ocrRequired: pipelineResult.ocrRequired,
        ocrTriggered: pipelineResult.ocrTriggered,
        ocrStatus: pipelineResult.ocrStatus,
        ocrConfidence: pipelineResult.ocrConfidence,
        ocrProviderName: pipelineResult.ocrProviderName,
        detectedSectionsCount: pipelineResult.detectedSectionsCount,
        detectedSectionNames: pipelineResult.detectedSections.detectedSectionNames,
        sectionRanges: pipelineResult.detectedSections.sectionRanges
      },
      profile: pipelineResult.profile,
      unclassifiedContent: pipelineResult.unclassifiedContent,
      completeness: pipelineResult.completeness
    });
  } catch (error: any) {
    console.error('[SERVER RESUME PARSE API] Exception:', error);
    return NextResponse.json(
      {
        success: false,
        code: 'SERVER_EXCEPTION',
        error: error.message || 'Server exception during resume parsing',
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
