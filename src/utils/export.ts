import * as XLSX from 'xlsx';
import type { Registration } from '@/types/registrations';

export function exportToExcel(
  data: Registration[],
  fileName = 'registrations'
) {
  // Prepare data for export
  const exportData = data.map(registration => ({
    Email: registration.registration_email || 'N/A',
    Event: registration.event_title || 'N/A',
    Status: registration.is_approved,
    'Registration Date': new Date(
      registration.created_at as unknown as Date
    ).toLocaleDateString(),
    'Ticket ID': registration.ticket_id || 'N/A',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

  // Generate file name with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fullFileName = `${fileName}_${timestamp}.xlsx`;

  // Export to file
  XLSX.writeFile(workbook, fullFileName);
}
