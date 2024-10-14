import jsPDF from 'jspdf';

export const generatePDF = (invoiceData) => {
  const doc = new jsPDF();

  doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 20, 20);
  doc.text(`Customer Name: ${invoiceData.customerName}`, 20, 30);
  doc.text(`Customer Phone: ${invoiceData.customerPhone}`, 20, 40);
  doc.text(`Customer Email: ${invoiceData.customerEmail}`, 20, 50);

  doc.text('Items:', 20, 60);
  invoiceData.items.forEach((item, index) => {
    doc.text(`${item.description} - $${item.price} x ${item.quantity}`, 20, 70 + (index * 10));
  });

  doc.text(`Subtotal: $${invoiceData.subtotal.toFixed(2)}`, 20, 100);
  doc.text(`Discount: ${invoiceData.discount}%`, 20, 110);
  doc.text(`Tax: ${invoiceData.tax}%`, 20, 120);
  doc.text(`Total: $${invoiceData.total.toFixed(2)}`, 20, 130);

  doc.text(`Payment Method: ${invoiceData.paymentMethod}`, 20, 140);
  doc.text(`Account Details: ${invoiceData.accountDetails}`, 20, 150);

  doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
};
