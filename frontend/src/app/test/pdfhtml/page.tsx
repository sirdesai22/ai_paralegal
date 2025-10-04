'use client'
import React, { useState } from 'react'
import { convertUploadedPdfToHtml } from '@/actions/pdfActions';

const page = () => {
    const [html, setHtml] = useState<string>('');
    const [loading, setLoading] = useState(false);
    return (
        <div className="p-4">
            <input 
                type="file" 
                accept=".pdf"
                className="mt-4 block"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setLoading(true);
                        console.log('File selected:', file.name);
                        
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const result = await convertUploadedPdfToHtml(formData);
                        setLoading(false);
                        
                        if (result.success) {
                            console.log(result.html);
                            setHtml(result.html);
                        } else {
                            console.error('Conversion failed:', result.error);
                        }
                    }
                }} 
            />
            
            {html && (
                <div className="mt-4 border p-4">
                    <h3 className="font-bold mb-2">Converted HTML:</h3>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            )}
        </div>
    )
}

export default page