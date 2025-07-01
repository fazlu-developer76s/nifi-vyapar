import fs from 'fs';
import PDFDocument from 'pdfkit';

export const generateTransactionPdf = async (data, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const tableTop = 100;
    const rowHeight = 25;
    const colWidths = [100, 50, 60, 60, 70, 100, 100]; 
    const headers = ['Date', 'Type', 'Amount', 'Balance', 'Closing', 'Bank', 'Account'];

    const drawTableRow = (y, rowData, fontStyle = 'Helvetica') => {
      let x = doc.options.margin;
      doc.font(fontStyle).fontSize(9);
      rowData.forEach((text, i) => {
        doc.text(String(text), x + 5, y + 8, {
          width: colWidths[i] - 10,
          align: 'left',
        });
        x += colWidths[i];
      });
    };

    const drawTableBorders = (y) => {
      let x = doc.options.margin;
      colWidths.forEach((w) => {
        doc.rect(x, y, w, rowHeight).stroke();
        x += w;
      });
    };

  
    doc.fontSize(16).text('Transaction Report', {
      align: 'center',
    });

    let y = tableTop;

   
    drawTableBorders(y);
    drawTableRow(y, headers, 'Helvetica-Bold');
    y += rowHeight;

   
    for (let i = 0; i < data.length; i++) {
      if (y + rowHeight > doc.page.height - 40) {
        doc.addPage();
        y = tableTop;
        drawTableBorders(y);
        drawTableRow(y, headers, 'Helvetica-Bold');
        y += rowHeight;
      }

      const row = [
        data[i].date || '',
        data[i].type || '',
        data[i].amount || '',
        data[i].balance || '',
        data[i].closingBalance || '',
        data[i].bank || '',
        data[i].account || '',
      ];

      drawTableBorders(y);
      drawTableRow(y, row);
      y += rowHeight;
    }

    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', (err) => reject(err));
  });
};
