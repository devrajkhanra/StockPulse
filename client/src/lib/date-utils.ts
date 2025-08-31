export function formatDateForInput(dateString: string): string {
  // Convert DD/MM/YYYY to YYYY-MM-DD for HTML date input
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function formatDateForDisplay(dateInput: string): string {
  // Convert YYYY-MM-DD to DD/MM/YYYY for display and API
  const [year, month, day] = dateInput.split('-');
  return `${day}/${month}/${year}`;
}

export function validateDateRange(startDate: string, endDate: string): { isValid: boolean; error?: string } {
  const start = new Date(startDate.split('/').reverse().join('-'));
  const end = new Date(endDate.split('/').reverse().join('-'));
  const today = new Date();
  
  if (start > end) {
    return { isValid: false, error: "Start date must be before end date" };
  }
  
  if (start > today) {
    return { isValid: false, error: "Start date cannot be in the future" };
  }
  
  if (end > today) {
    return { isValid: false, error: "End date cannot be in the future" };
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 365) {
    return { isValid: false, error: "Date range cannot exceed 365 days" };
  }
  
  return { isValid: true };
}

export function generateDateRange(startDate: string, endDate: string): string[] {
  const start = new Date(startDate.split('/').reverse().join('-'));
  const end = new Date(endDate.split('/').reverse().join('-'));
  const dates: string[] = [];
  
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const formatted = d.toLocaleDateString('en-GB');
    dates.push(formatted);
  }
  
  return dates;
}

export function formatDateForUrl(date: string, format: 'ddmmyyyy' | 'ddmmyy'): string {
  const [day, month, year] = date.split('/');
  if (format === 'ddmmyyyy') {
    return `${day}${month}${year}`;
  }
  return `${day}${month}${year.slice(-2)}`;
}
