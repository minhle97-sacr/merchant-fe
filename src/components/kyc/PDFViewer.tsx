'use client';

import { Document, Page, pdfjs } from 'react-pdf';
import { Icon } from '@/components/Icon';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
    file: string;
}

export default function PDFViewer({ file }: PDFViewerProps) {
    return (
        <Document
            file={file}
            loading={<div className="flex items-center gap-2"><div className="animate-spin"><Icon name="loader" size={24} /></div> Loading PDF...</div>}
            error={<div className="text-red-500">Failed to load PDF.</div>}
            className="max-w-full"
        >
            <Page 
                pageNumber={1} 
                renderTextLayer={false} 
                renderAnnotationLayer={false} 
                className="shadow-lg" 
                width={Math.min(typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800, 800)} 
            />
        </Document>
    );
}
