'use server'

import pdf2html from 'pdf2html';

export async function convertPdfToHtml(pdfPath: string): Promise<{ success: true; html: string } | { success: false; error: string }> {
    try {
        const html = await pdf2html.html(pdfPath);
        return { success: true, html };
    } catch (error) {
        console.error('PDF conversion error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
}

export async function convertPdfBufferToHtml(buffer: Buffer, filename: string) {
    try {
        // You may need to save the buffer to a temp file first
        // as pdf2html typically works with file paths
        const html = await pdf2html.html(buffer);
        return { success: true, html };
    } catch (error) {
        console.error('PDF buffer conversion error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
}

export async function convertUploadedPdfToHtml(formData: FormData): Promise<{ success: true; html: string } | { success: false; error: string }> {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No file provided' };
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const html = await pdf2html.html(buffer);
        return { success: true, html };
    } catch (error) {
        console.error('PDF upload conversion error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
}
