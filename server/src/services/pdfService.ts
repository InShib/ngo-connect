import PDFDocument from 'pdfkit';

export const generateDonationPDF = async (donationData: {
  receiptNumber: string;
  donorName: string;
  donorEmail: string;
  amount?: number;
  type: string;
  ngoName: string;
  date: Date;
}): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header Banner
      doc.rect(0, 0, 612, 100).fill('#1e293b');
      doc.fillColor('#ffffff').fontSize(24).text('NGO CONNECT', 50, 35, { align: 'left' });
      doc.fontSize(12).text('OFFICIAL DONATION RECEIPT', 50, 65, { align: 'left' });
      doc.fontSize(10).text(`Receipt #: ${donationData.receiptNumber}`, 400, 45, { align: 'right' });

      // Body Content
      doc.fillColor('#0f172a').fontSize(14).text('Donation Details', 50, 130, { underline: true });
      doc.fontSize(11).text(`Donor Name: ${donationData.donorName}`, 50, 160);
      doc.text(`Donor Email: ${donationData.donorEmail}`, 50, 180);
      doc.text(`Beneficiary NGO: ${donationData.ngoName}`, 50, 200);
      doc.text(`Donation Type: ${donationData.type.toUpperCase()}`, 50, 220);
      if (donationData.amount && donationData.amount > 0) {
        doc.text(`Total Amount: ₹${donationData.amount.toLocaleString('en-IN')}`, 50, 240);
      }
      doc.text(`Transaction Date: ${new Date(donationData.date).toLocaleDateString('en-IN')}`, 50, 260);

      // Section Line
      doc.moveTo(50, 300).lineTo(562, 300).strokeColor('#e2e8f0').stroke();

      // Tax Exemption Note
      doc.fillColor('#475569').fontSize(10).text('Tax Exemption Certificate:', 50, 320, { bold: true });
      doc.text('This receipt confirms a voluntary donation made to a registered non-profit organization under NGO CONNECT. Eligible for Tax Benefit under Section 80G.', 50, 335, { width: 500 });

      // Footer Signatures
      doc.fontSize(10).fillColor('#64748b').text('Authorized Signatory', 400, 430);
      doc.text('NGO CONNECT Verification Team', 400, 445);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
