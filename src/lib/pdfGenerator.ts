import { jsPDF } from 'jspdf';
import { Order } from '../types';

export function generateOrderInvoicePDF(order: Order) {
  const doc = new jsPDF();

  // Header Background bar
  doc.setFillColor(0, 119, 190); // #0077BE Pure Water Blue
  doc.rect(0, 0, 210, 38, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MILAD DRINKING WATER', 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Pure RO & UV Mineral Water Bottling Plant | Mirboxtula, Sylhet, Bangladesh', 14, 23);
  doc.text('BSTI & ISO 22000 Certified | Hotline / WhatsApp: +8801711102448', 14, 29);
  doc.text('Email: miladdrinkingwater@gmail.com', 14, 34);

  // Invoice Title Right Aligned
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL INVOICE', 196, 18, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${order.invoiceNumber}`, 196, 25, { align: 'right' });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 196, 31, { align: 'right' });

  // Bill To / Delivery Info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER / DELIVERY INFO', 14, 48);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Customer Name: ${order.customerName}`, 14, 55);
  doc.text(`Phone: ${order.customerPhone}`, 14, 61);
  doc.text(`Email: ${order.customerEmail || 'N/A'}`, 14, 67);
  doc.text(`Delivery Address: ${order.deliveryAddress.addressLine}, ${order.deliveryAddress.area}, ${order.deliveryAddress.city}`, 14, 73);
  if (order.deliveryAddress.floorUnit) {
    doc.text(`Floor/Unit: ${order.deliveryAddress.floorUnit}`, 14, 79);
  }

  // Order Details Right Box
  doc.setFont('helvetica', 'bold');
  doc.text('DELIVERY & PAYMENT SPECIFICATION', 120, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order Type: ${order.type.toUpperCase().replace('_', ' ')}`, 120, 55);
  doc.text(`Scheduled Date: ${order.deliveryDate} (${order.timeSlot})`, 120, 61);
  doc.text(`Zone: ${order.deliveryZone}`, 120, 67);
  doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})`, 120, 73);
  doc.text(`Assigned Driver: ${order.assignedDriver ? `${order.assignedDriver.name} (${order.assignedDriver.phone})` : 'Factory Dispatch Pool'}`, 120, 79);

  // Table Header
  const tableY = 90;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, tableY, 182, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(14, tableY, 196, tableY);
  doc.line(14, tableY + 8, 196, tableY + 8);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('#', 18, tableY + 5.5);
  doc.text('Product & Description', 30, tableY + 5.5);
  doc.text('Volume', 100, tableY + 5.5);
  doc.text('Qty', 125, tableY + 5.5, { align: 'right' });
  doc.text('Unit Price', 155, tableY + 5.5, { align: 'right' });
  doc.text('Total (BDT)', 192, tableY + 5.5, { align: 'right' });

  // Items Rows
  let currentY = tableY + 14;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  order.items.forEach((item, index) => {
    doc.text(String(index + 1), 18, currentY);
    doc.text(item.name, 30, currentY);
    doc.text(item.volume, 100, currentY);
    doc.text(String(item.quantity), 125, currentY, { align: 'right' });
    doc.text(`BDT ${item.unitPrice}`, 155, currentY, { align: 'right' });
    doc.text(`BDT ${item.totalPrice}`, 192, currentY, { align: 'right' });
    
    if (item.jarDepositPaid > 0) {
      currentY += 5;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`+ New Jar Security Deposit: BDT ${item.jarDepositPaid}`, 34, currentY);
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
    }

    if (item.emptyJarsToReturn > 0) {
      currentY += 5;
      doc.setFontSize(8);
      doc.setTextColor(14, 116, 144);
      doc.text(`- Empty Jar 1-to-1 Exchange: ${item.emptyJarsToReturn} Jar(s) returned (Deposit Waived)`, 34, currentY);
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
    }

    currentY += 7;
  });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY, 196, currentY);
  currentY += 8;

  // Summary box
  const summaryX = 130;
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', summaryX, currentY);
  doc.text(`BDT ${order.subtotal}`, 192, currentY, { align: 'right' });
  currentY += 6;

  if (order.depositTotal > 0) {
    doc.text('Jar Deposit Fee:', summaryX, currentY);
    doc.text(`BDT ${order.depositTotal}`, 192, currentY, { align: 'right' });
    currentY += 6;
  }

  doc.text('Delivery Fee:', summaryX, currentY);
  doc.text(order.deliveryFee === 0 ? 'FREE' : `BDT ${order.deliveryFee}`, 192, currentY, { align: 'right' });
  currentY += 6;

  if (order.discount > 0) {
    doc.setTextColor(16, 185, 129);
    doc.text('Special Discount:', summaryX, currentY);
    doc.text(`- BDT ${order.discount}`, 192, currentY, { align: 'right' });
    currentY += 6;
    doc.setTextColor(71, 85, 105);
  }

  doc.setDrawColor(0, 119, 190);
  doc.setLineWidth(0.5);
  doc.line(summaryX - 5, currentY, 196, currentY);
  currentY += 7;

  // Total Due
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 119, 190);
  doc.text('Grand Total:', summaryX, currentY);
  doc.text(`BDT ${order.totalAmount}`, 192, currentY, { align: 'right' });

  // Jar Exchange Status Bar
  currentY += 15;
  doc.setFillColor(236, 254, 255);
  doc.setDrawColor(6, 182, 212);
  doc.roundedRect(14, currentY, 182, 18, 2, 2, 'FD');
  
  doc.setFontSize(9);
  doc.setTextColor(14, 116, 144);
  doc.setFont('helvetica', 'bold');
  doc.text('CIRCULAR ECONOMY: EMPTY JAR RETURN LEDGER', 20, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`Empty 20L Polycarbonate Jars collected on this delivery: ${order.emptyJarsReturnedCount} jar(s).`, 20, currentY + 12);

  // Footer notes & signatures
  const footerY = 250;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Terms & Conditions:', 14, footerY);
  doc.text('1. Polycarbonate jars remain the property of Milad Drinking Water. Deposit is 100% refundable upon jar return.', 14, footerY + 4);
  doc.text('2. Water is tested daily. Store jars in a cool place away from direct sunlight.', 14, footerY + 8);
  doc.text('3. For instant repeat orders or emergency deliveries, call / WhatsApp: +8801711102448 | Mirboxtula, Sylhet.', 14, footerY + 12);

  // Signature lines
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY + 30, 65, footerY + 30);
  doc.text('Customer Received Signature', 14, footerY + 34);

  doc.line(145, footerY + 30, 196, footerY + 30);
  doc.text('Authorized Factory Dispatcher', 145, footerY + 34);

  // Save/Download
  doc.save(`MiladWater_Invoice_${order.invoiceNumber}.pdf`);
}
