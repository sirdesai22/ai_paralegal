import pdf2html from 'pdf2html';

export const getTheHtml = () => {
    return pdf2html.html('public/pdf/1.pdf');
}