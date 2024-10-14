import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './InvoiceForm.css';

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 1,
    date: '',
    dueDate: '',
    fromName: '',
    fromAddress: '',
    fromPhone: '',
    fromEmail: '',
    toName: '',
    toAddress: '',
    toPhone: '',
    toEmail: '',
    items: [{ description: '', price: 0, qty: 1 }],
    discount: 0,
    tax: 0,
    total: 0,
    companyName: 'Your Company Name',
    companyPhone: '',
    companyEmail: '',
    companyAddress: '',
    logo: null,
    theme: 'theme1',
    savedInvoices: [],
    notes: '',
  });

  useEffect(() => {
    calculateTotal();
  }, [invoiceData.items, invoiceData.discount, invoiceData.tax]);

  const calculateTotal = () => {
    const subtotal = invoiceData.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    const discountAmount = (subtotal * invoiceData.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * invoiceData.tax) / 100;
    const total = subtotal - discountAmount + taxAmount;
    setInvoiceData((prevData) => ({ ...prevData, total }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddItem = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { description: '', price: 0, qty: 1 }],
    }));
  };

  const handleRemoveItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prevData) => ({ ...prevData, items: newItems }));
  };

  const handleItemChange = (index, name, value) => {
    const newItems = invoiceData.items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setInvoiceData((prevData) => ({ ...prevData, items: newItems }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setInvoiceData((prevData) => ({ ...prevData, logo: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInvoice = () => {
    const newInvoice = { ...invoiceData };
    const newInvoiceList = [...invoiceData.savedInvoices, newInvoice];
    setInvoiceData((prevData) => ({
      ...prevData,
      savedInvoices: newInvoiceList,
      invoiceNumber: prevData.invoiceNumber + 1,
    }));
  };

  const handleEditInvoice = (index) => {
    const invoiceToEdit = invoiceData.savedInvoices[index];
    setInvoiceData((prevData) => ({
      ...prevData,
      ...invoiceToEdit,
      savedInvoices: prevData.savedInvoices.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteInvoice = (index) => {
    const newInvoiceList = invoiceData.savedInvoices.filter((_, i) => i !== index);
    setInvoiceData((prevData) => ({ ...prevData, savedInvoices: newInvoiceList }));
  };

  const handleChangeTheme = () => {
    const themes = ['theme1', 'theme2', 'theme3', 'theme4','theme5','theme6','theme7','theme8','theme9','theme10']; // List of all themes
    setInvoiceData((prevData) => {
      const currentThemeIndex = themes.indexOf(prevData.theme);
      const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
      return {
        ...prevData,
        theme: themes[nextThemeIndex],
      };
    });
  };
  

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
  
      // Define theme-based colors using exact values from the CSS file
      const themes = {
        theme1: { background: [245, 245, 220], header: [0, 0, 128], text: [0, 128, 128] },
        theme2: { background: [239, 234, 230], header: [45, 86, 34], text: [226, 165, 77] },
        theme3: { background: [219, 205, 189], header: [21, 36, 35], text: [72, 72, 64] },
        theme4: { background: [224, 214, 217], header: [173, 82, 94], text: [194, 217, 209] },
        theme5: { background: [244, 241, 234], header: [179, 90, 43], text: [212, 136, 101] },
        theme6: { background: [232, 240, 242], header: [48, 95, 114], text: [61, 132, 138] },
        theme7: { background: [243, 240, 225], header: [107, 66, 38], text: [142, 106, 77] },
        theme8: { background: [241, 236, 236], header: [90, 106, 114], text: [122, 138, 143] },
        theme9: { background: [231, 245, 233], header: [62, 142, 65], text: [93, 166, 100] },
        theme10: { background: [236, 232, 252], header: [106, 82, 163], text: [140, 120, 192] },
      };
  
      // Get the current theme colors
      const currentThemeColors = themes[invoiceData.theme] || themes.theme1; // Default to theme1 if not found
  
      // Set background color based on the theme
      doc.setFillColor(...currentThemeColors.background);
      doc.rect(0, 0, 210, 297, 'F');
  
      // Add logo
      if (invoiceData.logo) {
        doc.addImage(invoiceData.logo, 'JPEG', 10, 10, 50, 30);
      }
  
      // Company info with theme color
      doc.setFontSize(20);
      doc.setTextColor(...currentThemeColors.text);
      doc.text(invoiceData.companyName, 70, 20);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(invoiceData.companyAddress, 70, 30);
      doc.text(invoiceData.companyPhone, 70, 35);
      doc.text(invoiceData.companyEmail, 70, 40);
  
      // Invoice title and details with theme color
      doc.setFontSize(30);
      doc.setTextColor(...currentThemeColors.text);
      doc.text('INVOICE', 140, 30);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 140, 40);
      doc.text(`Date: ${invoiceData.date}`, 140, 45);
      doc.text(`Due Date: ${invoiceData.dueDate}`, 140, 50);
  
      // Bill to section
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Bill To:', 10, 60);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(invoiceData.toName, 10, 70);
      doc.text(invoiceData.toAddress, 10, 75);
      doc.text(invoiceData.toPhone, 10, 80);
      doc.text(invoiceData.toEmail, 10, 85);
  
      // Table for items with theme header color
      const tableColumn = ['No.', 'Item Description', 'Price', 'Qty', 'Total'];
      const tableRows = invoiceData.items.map((item, index) => [
        index + 1,
        item.description,
        `$${item.price.toFixed(2)}`,
        item.qty,
        `$${(item.price * item.qty).toFixed(2)}`,
      ]);
  
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 100,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1.5, overflow: 'linebreak' },
        headStyles: { fillColor: currentThemeColors.header, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
  
      // Calculate position for totals
      const finalY = doc.lastAutoTable.finalY || 150;
  
      // Totals with theme color
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Subtotal: $${invoiceData.items.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}`, 140, finalY + 10);
      doc.text(`Discount (${invoiceData.discount}%): $${((invoiceData.items.reduce((acc, item) => acc + item.price * item.qty, 0) * invoiceData.discount) / 100).toFixed(2)}`, 140, finalY + 20);
      doc.text(`Tax (${invoiceData.tax}%): $${((invoiceData.items.reduce((acc, item) => acc + item.price * item.qty, 0) * invoiceData.tax) / 100).toFixed(2)}`, 140, finalY + 30);
      doc.setFontSize(12);
      doc.setTextColor(...currentThemeColors.text);
      doc.text(`Total: $${invoiceData.total.toFixed(2)}`, 140, finalY + 40);
  
      // Notes section
      if (invoiceData.notes) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Notes:', 10, finalY + 60);
        doc.setFontSize(8);
        doc.text(invoiceData.notes, 10, finalY + 70);
      }
  
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Thank you for your business!', 10, 280);
  
      doc.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    }
  };
  

  return (
    <div className={`invoice-container ${invoiceData.theme}`}>
      <div className="invoice-form">
        <div className="header">
          <div className="logo-upload">
            {invoiceData.logo ? (
              <img className="logo" src={invoiceData.logo} alt="Company Logo" />
            ) : (
              <div className="logo-placeholder">Upload Logo</div>
            )}
            <input type="file" onChange={handleLogoUpload} className="logo-upload" />
          </div>
          <div className="company-info">
            <input type="text" name="companyName" value={invoiceData.companyName} onChange={handleInputChange} placeholder="Company Name" />
            <input type="text" name="companyAddress" value={invoiceData.companyAddress} onChange={handleInputChange} placeholder="Company Address" />
            <input type="text" name="companyPhone" value={invoiceData.companyPhone} onChange={handleInputChange} placeholder="Company Phone" />
            <input type="email" name="companyEmail" value={invoiceData.companyEmail} onChange={handleInputChange} placeholder="Company Email" />
          </div>
        </div>

        <div className="invoice-details">
          <h1>INVOICE</h1>
          <div className="invoice-info">
            <input type="text" name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleInputChange} placeholder="Invoice Number" />
            <input type="date" name="date" value={invoiceData.date} onChange={handleInputChange} />
            <input type="date" name="dueDate" value={invoiceData.dueDate} onChange={handleInputChange} placeholder="Due Date" />
          </div>
        </div>

        <div className="bill-to">
          <h3>Bill To:</h3>
          <input type="text" name="toName" value={invoiceData.toName} onChange={handleInputChange} placeholder="Customer Name" />
          <input type="text" name="toAddress" value={invoiceData.toAddress} onChange={handleInputChange} placeholder="Customer Address" />
          <input type="text" name="toPhone" value={invoiceData.toPhone} onChange={handleInputChange} placeholder="Customer Phone" />
          <input type="email" name="toEmail" value={invoiceData.toEmail} onChange={handleInputChange} placeholder="Customer Email" />
        </div>

        <table className="item-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td><input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} /></td>
                <td><input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} /></td>
                <td><input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} /></td>
                <td>${(item.price * item.qty).toFixed(2)}</td>
                <td><button onClick={() => handleRemoveItem(index)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={handleAddItem}>Add Item</button>

        <div className="totals">
          <div>
            <label>Discount (%):</label>
            <input type="number" name="discount" value={invoiceData.discount} onChange={handleInputChange} />
          </div>
          <div>
            <label>Tax (%):</label>
            <input type="number" name="tax" value={invoiceData.tax} onChange={handleInputChange} />
          </div>
          <div className="total-amount">
            <h3>Total: ${invoiceData.total.toFixed(2)}</h3>
          </div>
        </div>

        <div className="notes">
          <label>Notes:</label>
          <textarea name="notes" value={invoiceData.notes} onChange={handleInputChange} />
        </div>

        <div className="actions">
          <button className="save-btn" onClick={handleSaveInvoice}>Save Invoice</button>
          <button className="download-btn" onClick={downloadPDF}>Download PDF</button>
          <button className="change-theme-btn" onClick={handleChangeTheme}>Change Theme</button>
        </div>
      </div>

      <div className="saved-invoices">
        <h3>Saved Invoices</h3>
        {invoiceData.savedInvoices.length > 0 ? (
          <ul>
            {invoiceData.savedInvoices.map((invoice, index) => (
              <li key={index}>
                Invoice #{invoice.invoiceNumber} - Total: ${invoice.total.toFixed(2)}
                <button onClick={() => handleEditInvoice(index)}>Edit</button>
                <button onClick={() => handleDeleteInvoice(index)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No invoices saved yet.</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceForm;