// lib/pdf-generator.ts
import jsPDF from 'jspdf';
import { SalaryRecord, Employee, Allowance, Deduction } from './salary';

interface CustomInvoiceData {
  // Company Information
  companyName: string;
  companySubtitle: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  
  // Payment Information
  bankName: string;
  accountNumber: string;
  paymentMethod: string;
  
  // Salary Breakdown
  allowances: Allowance[];
  deductions: Deduction[];
  
  // Additional Content
  additionalNotes: string;
  contactText: string;
  footerText: string;
  
  // Styling
  headerColor: string;
}

export async function generateCustomInvoicePDF(
  payroll: SalaryRecord, 
  employee: Employee,
  customData: CustomInvoiceData
): Promise<Blob> {
  const doc = new jsPDF();
  
  // Convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 220, g: 53, b: 69 };
  };

  const headerColor = hexToRgb(customData.headerColor);

  // Company Header
  doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(customData.companyName, 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text(customData.companySubtitle, 105, 22, { align: 'center' });
  doc.setFontSize(9);
  doc.text(customData.companyAddress, 105, 28, { align: 'center' });

  // Invoice Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  let yPosition = 50;

  // Invoice Number and Date
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE #:', 20, yPosition);
  doc.text('DATE:', 120, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(customData.invoiceNumber, 45, yPosition);
  doc.text(customData.invoiceDate, 140, yPosition);
  yPosition += 15;

  // Employee Information
  doc.setFont('helvetica', 'bold');
  doc.text('EMPLOYEE INFORMATION:', 20, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Full Name: ${employee.name}`, 25, yPosition);
  yPosition += 5;
  doc.text(`Employee ID: ${employee.id}`, 25, yPosition);
  yPosition += 5;
  doc.text(`Position: ${employee.position}`, 25, yPosition);
  yPosition += 5;
  doc.text(`Department: ${employee.department}`, 25, yPosition);
  yPosition += 5;
  doc.text(`Email: ${employee.email}`, 25, yPosition);
  yPosition += 5;
  doc.text(`Phone: ${employee.phone}`, 25, yPosition);
  yPosition += 10;

  // Payment Information
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT INFORMATION:', 20, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Bank: ${customData.bankName}`, 25, yPosition);
  yPosition += 5;
  doc.text(`Account Number: ${customData.accountNumber}`, 25, yPosition);
  yPosition += 5;
  doc.text(`Payment Method: ${customData.paymentMethod}`, 25, yPosition);
  yPosition += 5;
  doc.text(`Status: ${payroll.status.toUpperCase()}`, 25, yPosition);
  yPosition += 10;

  // Salary Breakdown Table
  const tableTop = yPosition + 5;
  
  // Table Headers
  doc.setFillColor(240, 240, 240);
  doc.rect(20, tableTop, 170, 8, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 25, tableTop + 6);
  doc.text('Amount (USD)', 160, tableTop + 6, { align: 'right' });

  let currentY = tableTop + 8;

  // Earnings
  doc.setFont('helvetica', 'bold');
  doc.text('EARNINGS', 25, currentY + 6);
  currentY += 8;
  
  doc.setFont('helvetica', 'normal');
  customData.allowances.forEach((allowance) => {
    doc.text(allowance.type, 30, currentY + 6);
    doc.text(`$${allowance.amount.toLocaleString()}`, 160, currentY + 6, { align: 'right' });
    currentY += 6;
  });

  // Total Earnings
  const totalEarnings = customData.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Earnings', 25, currentY + 8);
  doc.text(`$${totalEarnings.toLocaleString()}`, 160, currentY + 8, { align: 'right' });
  currentY += 12;

  // Deductions
  doc.setFont('helvetica', 'bold');
  doc.text('DEDUCTIONS', 25, currentY + 6);
  currentY += 8;
  
  doc.setFont('helvetica', 'normal');
  customData.deductions.forEach((deduction) => {
    doc.text(deduction.type, 30, currentY + 6);
    doc.text(`-$${deduction.amount.toLocaleString()}`, 160, currentY + 6, { align: 'right' });
    currentY += 6;
  });

  // Total Deductions
  const totalDeductions = customData.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Deductions', 25, currentY + 8);
  doc.text(`-$${totalDeductions.toLocaleString()}`, 160, currentY + 8, { align: 'right' });
  currentY += 15;

  // Net Pay
  doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
  doc.rect(20, currentY, 170, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('NET PAYABLE AMOUNT', 25, currentY + 8);
  doc.text(`$${(totalEarnings - totalDeductions).toLocaleString()}`, 160, currentY + 8, { align: 'right' });
  currentY += 20;

  // Additional Notes
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const splitNotes = doc.splitTextToSize(customData.additionalNotes, 170);
  doc.text(splitNotes, 105, currentY, { align: 'center' });
  currentY += splitNotes.length * 5 + 5;

  // Contact Information
  doc.setFont('helvetica', 'normal');
  doc.text(`${customData.contactText}: ${customData.companyPhone} | ${customData.companyEmail}`, 105, currentY, { align: 'center' });
  currentY += 10;

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(customData.footerText, 105, 280, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' });

  // Return as Blob
  return doc.output('blob');
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ----------------------
// Professional Quotation PDF
// ----------------------
export async function generateQuotationPDF(
  quotation: any,
  sections: any[],
  customer: any,
  options: { accentColor?: string; headerColor?: string; formatAmount?: (n: number) => string } = {}
): Promise<Blob> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const accent = options.accentColor || '#0f60d9';
  const headerBg = options.headerColor || '#0b4bd8';
  const formatAmount = options.formatAmount || ((n: number) => `$${n.toFixed(2)}`);
  const bandContrastFactor = 0.78; // darker band for good contrast; lower = darker

  // typography constants — tuned for a clean, professional look
  const TITLE_FONT_SIZE = 20;
  const SUBTITLE_FONT_SIZE = 11;
  const SECTION_TITLE_FONT_SIZE = 12;
  const BODY_FONT_SIZE = 10;
  const SMALL_FONT_SIZE = 9;
  const LINE_HEIGHT = 5.2;

  // helper: hex to rgb
  const hexToRgb = (hex: string): [number, number, number] => {
    const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return res ? [parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16)] : [15, 96, 217];
  };

  // helper: derive a secondary (darker) color from accent
  const secondaryFromHex = (hex: string): [number, number, number] => {
    const [r0, g0, b0] = hexToRgb(hex);
    // make slightly darker for section headers
    const factor = bandContrastFactor || 0.82;
    return [Math.max(0, Math.floor(r0 * factor)), Math.max(0, Math.floor(g0 * factor)), Math.max(0, Math.floor(b0 * factor))];
  };

  // helper: draw a subtle page border
  const drawPageBorder = () => {
    const inset = 6; // mm
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(inset, inset, pageWidth - inset * 2, pageHeight - inset * 2);
  };

  // helper: fetch image url -> dataURL
  async function fetchImageAsDataURL(url: string | undefined) {
    if (!url) return null;
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      return await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string | null);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  }

  // NOTE: Some PDF metadata needs the cover/companyName which is determined after we've parsed the 'cover' section.

  // Draw header
  const [r, g, b] = hexToRgb(headerBg);
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, pageWidth, 60, 'F');

  // subtle page border
  drawPageBorder();

  // Add logo if available (cover page section)
  let logoDataUrl: string | null = null;
  const cover = sections?.find((s) => s.type === 'cover_page');
  if (cover && cover.data?.companyLogo) {
    logoDataUrl = await fetchImageAsDataURL(cover.data.companyLogo);
  }
  if (logoDataUrl) {
    try {
      // place logo at left
      doc.addImage(logoDataUrl, 'JPEG', margin, 8, 36, 36);
    } catch (e) {
      // ignore image errors
    }
  }

  // Set PDF metadata (after cover is known)
  try {
    doc.setProperties({
      title: `Quotation ${quotation.quotationNumber || ''}`,
      subject: 'Quotation',
      author: cover?.data?.companyName || 'SBR360',
      keywords: 'quotation, proposal, invoice',
      creator: 'SBR360 Quotation Generator'
    });
  } catch (e) { /* ignore if jsPDF version lacks setProperties */ }

  // Title and company name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(TITLE_FONT_SIZE);
  doc.text(cover?.data?.companyName || 'Company Name', margin + (logoDataUrl ? 42 : 0), 20);
  doc.setFontSize(SUBTITLE_FONT_SIZE);
  doc.setFont('helvetica', 'normal');
  // show company subtitle or default tagline for hardware & electronics
  const subtitleText = cover?.data?.companySubtitle || 'Hardware & Electronics Solutions';
  doc.text(subtitleText, margin + (logoDataUrl ? 42 : 0), 26);

  // Quotation label on right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('QUOTATION', pageWidth - margin, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`# ${quotation.quotationNumber || ''}`, pageWidth - margin, 26, { align: 'right' });

  // Company & Client boxes
  const boxTop = 72;
  const boxHeight = 26;
  // company box (left)
  doc.setFillColor(245, 246, 250);
  doc.rect(margin, boxTop, (pageWidth - margin * 2) / 2 - 6, boxHeight, 'F');
  doc.setTextColor(36, 41, 46);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(cover?.data?.companyName || 'Company Name', margin + 4, boxTop + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (cover?.data?.companyAddress) doc.text(cover.data.companyAddress, margin + 4, boxTop + 15);

  // client box (right)
  doc.setFillColor(255, 255, 255);
  const clientX = margin + (pageWidth - margin * 2) / 2 + 2;
  doc.rect(clientX, boxTop, (pageWidth - margin * 2) / 2 - 6, boxHeight, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(customer?.companyName || 'Client Name', clientX + 4, boxTop + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (customer?.primaryContact) {
    doc.text(customer.primaryContact.name || '', clientX + 4, boxTop + 15);
  }

  // Quotation meta rows (issue date, valid until)
  const metaTop = boxTop + boxHeight + 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Issue Date:', margin, metaTop);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(quotation.issueDate || Date.now()).toLocaleDateString(), margin + 24, metaTop);
  doc.setFont('helvetica', 'bold');
  doc.text('Valid Until:', margin + 80, metaTop);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(quotation.validUntil || Date.now()).toLocaleDateString(), margin + 104, metaTop);

  // Move to items area
  let y = metaTop + 12;

  // helper: add wrapped text and handle page breaks
  const addTextWithPageBreak = (text: string, fontSize = BODY_FONT_SIZE, isBold = false, lineHeight = LINE_HEIGHT) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const maxWidth = pageWidth - margin * 2;
    const lines = doc.splitTextToSize(text || '', maxWidth);
    for (const line of lines) {
      if (y + lineHeight > pageHeight - margin - 30) {
        doc.addPage();
        // re-draw border on new page
        drawPageBorder();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += 4;
  };

  // Render enabled non-cover sections (rich content)
  const enabledSections = (sections || []).filter((s: any) => s.enabled);
  for (const section of enabledSections) {
    if (section.type === 'cover_page') continue; // already handled above

    // section header with colored band
    if (y + 26 > pageHeight - margin - 30) {
      doc.addPage();
      drawPageBorder();
      y = margin;
    }
    const secRgb = secondaryFromHex(accent);
  const headerH = 10;
    // small colored band spanning content width
    doc.setFillColor(secRgb[0], secRgb[1], secRgb[2]);
    doc.rect(margin - 2, y - 4, pageWidth - margin * 2 + 4, headerH, 'F');
  doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(section.title || section.type.replace('_', ' ').toUpperCase(), margin + 2, y + 2);
    y += headerH + 6;
    doc.setTextColor(34, 34, 34);

    switch (section.type) {
      case 'executive_summary':
  if (section.data?.summary) addTextWithPageBreak(section.data.summary, BODY_FONT_SIZE, false, LINE_HEIGHT);
        if (section.data?.keyBenefits?.length) {
          doc.setFont('helvetica', 'bold');
          doc.text('Key Benefits:', margin, y);
          y += 8;
          doc.setFont('helvetica', 'normal');
          for (const b of section.data.keyBenefits) {
            addTextWithPageBreak(`• ${b}`, BODY_FONT_SIZE, false, LINE_HEIGHT);
          }
        }
        break;

      case 'company_introduction':
  if (section.data?.description) addTextWithPageBreak(section.data.description, BODY_FONT_SIZE, false, LINE_HEIGHT);
        if (section.data?.achievements?.length) {
          doc.setFont('helvetica', 'bold');
          doc.text('Achievements:', margin, y);
          y += 8;
          doc.setFont('helvetica', 'normal');
          for (const a of section.data.achievements) addTextWithPageBreak(`• ${a}`, BODY_FONT_SIZE, false, LINE_HEIGHT);
        }
        // embed company images if any
        if (section.data?.companyImages && section.data.companyImages.length) {
          for (const imgUrl of section.data.companyImages) {
            try {
              const dataUrl = await fetchImageAsDataURL(imgUrl);
                if (dataUrl) {
                if (y + 40 > pageHeight - margin - 30) { doc.addPage(); drawPageBorder(); y = margin; }
                doc.addImage(dataUrl, 'JPEG', margin, y, 60, 40);
                y += 44;
              } else {
                // placeholder box for company image if unavailable
                if (y + 44 > pageHeight - margin - 30) { doc.addPage(); drawPageBorder(); y = margin; }
                doc.setFillColor(238, 239, 241);
                doc.rect(margin, y, 60, 40, 'F');
                doc.setTextColor(120, 120, 120);
                doc.setFontSize(SMALL_FONT_SIZE);
                doc.setFont('helvetica', 'normal');
                doc.text('Image not available', margin + 30, y + 22, { align: 'center' });
                y += 44;
              }
            } catch (e) { /* ignore image errors */ }
          }
        }
        break;

      case 'problem_statement':
        if (section.data?.currentSituation) addTextWithPageBreak(section.data.currentSituation, 11, false, 6);
        if (section.data?.objectives?.length) {
          doc.setFont('helvetica', 'bold');
          doc.text('Objectives:', margin, y);
          y += 8;
          doc.setFont('helvetica', 'normal');
          for (const o of section.data.objectives) addTextWithPageBreak(`• ${o}`, BODY_FONT_SIZE, false, LINE_HEIGHT);
        }
        break;

      case 'solution_details':
  if (section.data?.solutionOverview) addTextWithPageBreak(section.data.solutionOverview, BODY_FONT_SIZE, false, LINE_HEIGHT);
        if (section.data?.keyFeatures?.length) {
          doc.setFont('helvetica', 'bold');
          doc.text('Key Features:', margin, y);
          y += 8;
          doc.setFont('helvetica', 'normal');
          for (const f of section.data.keyFeatures) addTextWithPageBreak(`• ${f}`, BODY_FONT_SIZE, false, LINE_HEIGHT);
        }
        break;

      case 'product_specifications':
        if (section.data?.products?.length) {
          for (const p of section.data.products) {
            addTextWithPageBreak(`${p.name || p.productName || 'Product'}`, BODY_FONT_SIZE, true, LINE_HEIGHT);
            addTextWithPageBreak(`${p.description || ''}`, BODY_FONT_SIZE, false, LINE_HEIGHT);
              addTextWithPageBreak(`Quantity: ${p.quantity || p.qty || ''}  Unit Price: ${formatAmount(Number(p.unitPrice || p.rate || 0))}`, BODY_FONT_SIZE, false, LINE_HEIGHT);
              // render technical specifications (two-column) if present
              if (p.technicalSpecifications && typeof p.technicalSpecifications === 'object') {
                const specs = p.technicalSpecifications;
                const entries = Object.entries(specs).filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '');
                if (entries.length) {
                  // heading
                  doc.setFont('helvetica', 'bold');
                  doc.setFontSize(10);
                  doc.text('Technical Specifications:', margin, y);
                  y += 6;

                  const contentWidth = pageWidth - margin * 2;
                  const colWidth = Math.floor(contentWidth / 2);
                  const leftX = margin;
                  const rightX = margin + colWidth + 6;

                  const renderPair = (left?: [string, any], right?: [string, any]) => {
                    const leftLines: string[] = [];
                    const rightLines: string[] = [];
                    const keyFontSize = SMALL_FONT_SIZE;
                      const valFontSize = SMALL_FONT_SIZE;

                    if (left) {
                      doc.setFont('helvetica', 'bold');
                      doc.setFontSize(keyFontSize);
                      leftLines.push(`${left[0]}:`);
                      doc.setFont('helvetica', 'normal');
                      const v = String(left[1] ?? '');
                      const wrapped = doc.splitTextToSize(v, colWidth - 6);
                      leftLines.push(...wrapped);
                    }
                    if (right) {
                      doc.setFont('helvetica', 'bold');
                      doc.setFontSize(keyFontSize);
                      rightLines.push(`${right[0]}:`);
                      doc.setFont('helvetica', 'normal');
                      const v2 = String(right[1] ?? '');
                      const wrapped2 = doc.splitTextToSize(v2, colWidth - 6);
                      rightLines.push(...wrapped2);
                    }

                    const leftHeight = leftLines.length * 4.8 + 2;
                    const rightHeight = rightLines.length * 4.8 + 2;
                    const rowHeight = Math.max(leftHeight, rightHeight);
                    if (y + rowHeight > pageHeight - margin - 30) {
                      doc.addPage();
                      drawPageBorder();
                      y = margin;
                    }

                    // draw left
                    if (left) {
                      let cur = y;
                      doc.setFontSize(keyFontSize);
                      doc.setFont('helvetica', 'bold');
                      doc.text(leftLines[0], leftX, cur);
                      cur += 4.8;
                      doc.setFont('helvetica', 'normal');
                      doc.setFontSize(valFontSize);
                      if (leftLines.length > 1) doc.text(leftLines.slice(1), leftX, cur);
                    }

                    // draw right
                    if (right) {
                      let cur2 = y;
                      doc.setFontSize(keyFontSize);
                      doc.setFont('helvetica', 'bold');
                      doc.text(rightLines[0], rightX, cur2);
                      cur2 += 4.8;
                      doc.setFont('helvetica', 'normal');
                      doc.setFontSize(valFontSize);
                      if (rightLines.length > 1) doc.text(rightLines.slice(1), rightX, cur2);
                    }

                    y += rowHeight + 4;
                  };

                  for (let i = 0; i < entries.length; i += 2) {
                    const left = entries[i];
                    const right = entries[i + 1];
                    renderPair(left, right);
                  }
                }
              }
            // show images
            if (p.images && p.images.length) {
              for (const url of p.images) {
                try {
                  const d = await fetchImageAsDataURL(url);
                    if (d) {
                    if (y + 40 > pageHeight - margin - 30) { doc.addPage(); drawPageBorder(); y = margin; }
                    doc.addImage(d, 'JPEG', margin, y, 50, 35);
                    y += 40;
                  } else {
                    // placeholder for product image if unavailable
                    if (y + 40 > pageHeight - margin - 30) { doc.addPage(); drawPageBorder(); y = margin; }
                    doc.setFillColor(245, 245, 247);
                    doc.rect(margin, y, 50, 35, 'F');
                    doc.setTextColor(140, 140, 143);
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'normal');
                    doc.text('Image not available', margin + 25, y + 17, { align: 'center' });
                    y += 40;
                  }
                } catch (e) { /* ignore image fetch errors */ }
              }
            }
          }
        }
        break;

      case 'quotation_items':
        // render items table later in unified items area; skip here to avoid duplicate
        break;

      case 'timeline_schedule':
        if (section.data?.phases?.length) {
          for (const phase of section.data.phases) {
            addTextWithPageBreak(`${phase.name} - ${phase.duration}`, BODY_FONT_SIZE, true, LINE_HEIGHT);
            if (phase.deliverables) for (const d of phase.deliverables) addTextWithPageBreak(`• ${d}`, BODY_FONT_SIZE, false, LINE_HEIGHT);
          }
        }
        break;

      case 'terms_warranties':
  if (section.data?.generalTerms) addTextWithPageBreak(section.data.generalTerms, BODY_FONT_SIZE, false, LINE_HEIGHT);
        break;

      case 'contact_information':
        if (section.data?.companyContacts?.length) {
          for (const c of section.data.companyContacts) {
            addTextWithPageBreak(`${c.name} - ${c.title}`, BODY_FONT_SIZE, true, LINE_HEIGHT);
            addTextWithPageBreak(`Phone: ${c.phone} | Email: ${c.email}`, BODY_FONT_SIZE, false, LINE_HEIGHT);
          }
        }
        break;

      default:
        // generic content
  if (section.data?.content) addTextWithPageBreak(String(section.data.content), BODY_FONT_SIZE, false, LINE_HEIGHT);
    }
    y += 6;
  }
  // Items table header
  const accentRgb = hexToRgb(accent);
  doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const colWidths = [70, 30, 28, 30]; // item, qty, unit, total (approx)
  const colsX = [margin + 4, margin + 74, margin + 104, margin + 132];
  doc.text('Item & Description', colsX[0], y + 7);
  doc.text('Qty', colsX[1], y + 7, { align: 'center' });
  doc.text('Unit', colsX[2], y + 7, { align: 'right' });
  doc.text('Total', colsX[3] + 28, y + 7, { align: 'right' });

  y += 12;
  doc.setTextColor(34, 34, 34);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Render items with zebra rows
  let row = 0;
  let subtotal = 0;
  const items: any[] = quotation.items || [];
  for (const it of items) {
    const rowHeight = 8;
    if (y + rowHeight > pageHeight - 40) {
      // page break
      doc.addPage();
      drawPageBorder();
      y = margin;
    }
    if (row % 2 === 0) doc.setFillColor(250, 250, 252), doc.rect(margin, y - 2, pageWidth - margin * 2, rowHeight + 2, 'F');

    const itemTitle = it.productName || it.description || it.id || '—';
    const qty = Number(it.quantity || 0);
  const unit = Number(it.rate || it.unitPrice || 0);
  const total = qty * unit - (it.discount || 0) + (it.tax || 0);
    subtotal += total;

    // Item & desc
    const lines = doc.splitTextToSize(itemTitle, colWidths[0] - 8);
    doc.text(lines, colsX[0], y + 5);
    // qty
    doc.text(String(qty), colsX[1], y + 5, { align: 'center' });
    // unit
  doc.text(formatAmount(unit), colsX[2] + 18, y + 5, { align: 'right' });
  // total
  doc.text(formatAmount(total), pageWidth - margin - 4, y + 5, { align: 'right' });

    y += rowHeight + (lines.length > 1 ? (lines.length - 1) * 4 : 0);
    row++;
  }

  // Totals box pinned to bottom of last page
  const totalsWidth = 72;
  const totalsHeight = 44;
  let totalsTop = pageHeight - margin - totalsHeight;
  // if we've already printed far below the totals top, start a new page before the totals box
  if (y > totalsTop - 8) {
    doc.addPage();
    drawPageBorder();
    totalsTop = pageHeight - margin - totalsHeight;
  }
  const accentRgb2 = hexToRgb(accent);
  doc.setFillColor(accentRgb2[0], accentRgb2[1], accentRgb2[2]);
  doc.rect(pageWidth - margin - totalsWidth, totalsTop - 6, totalsWidth, totalsHeight, 'F');
  // outline the totals box with a slightly darker stroke for a polished look
  doc.setDrawColor(Math.max(0, accentRgb2[0] - 20), Math.max(0, accentRgb2[1] - 20), Math.max(0, accentRgb2[2] - 20));
  doc.setLineWidth(0.6);
  doc.rect(pageWidth - margin - totalsWidth, totalsTop - 4, totalsWidth, 36, 'S');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal', pageWidth - margin - 8, totalsTop + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(formatAmount(subtotal), pageWidth - margin - 8, totalsTop + 14, { align: 'right' });

  // Tax and grand total
  const tax = Number(quotation.totalTax || 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Tax', pageWidth - margin - 8, totalsTop + 20, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(formatAmount(tax), pageWidth - margin - 8, totalsTop + 26, { align: 'right' });

  const grand = (subtotal || 0) + tax - (Number(quotation.totalDiscount || 0));
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total', pageWidth - margin - 8, totalsTop + 30, { align: 'right' });
  doc.text(formatAmount(grand), pageWidth - margin - 8, totalsTop + 36, { align: 'right' });
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  // Save
  return doc.output('blob');
}
