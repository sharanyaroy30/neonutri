// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Get current time in HH:MM format
export function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// Format date to Month DD, YYYY
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Format date to short version (MM/DD)
export function formatDateShort(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format time to 12-hour format
export function formatTime(timeString: string): string {
  if (!timeString) return '';
  
  let [hours, minutes] = timeString.split(':');
  const hoursNum = parseInt(hours);
  
  const ampm = hoursNum >= 12 ? 'PM' : 'AM';
  const hours12 = hoursNum % 12 || 12;
  
  return `${hours12}:${minutes} ${ampm}`;
}

// Calculate baby's age in months from birthday
export function calculateBabyAge(birthday: string): string {
  if (!birthday) return '';
  
  const birthDate = new Date(birthday);
  const now = new Date();
  
  let months = (now.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth();
  months += now.getMonth();
  
  if (now.getDate() < birthDate.getDate()) {
    months--;
  }
  
  if (months < 1) {
    const days = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days old`;
  } else if (months < 24) {
    return `${months} months old`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} old`;
  }
}

// Get age group based on baby's birthday
export function getAgeGroup(birthday: string): string {
  if (!birthday) return '';
  
  const birthDate = new Date(birthday);
  const now = new Date();
  
  let months = (now.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth();
  months += now.getMonth();
  
  if (now.getDate() < birthDate.getDate()) {
    months--;
  }
  
  if (months < 6) {
    return '0-6 months';
  } else if (months < 12) {
    return '6-12 months';
  } else if (months < 24) {
    return '12-24 months';
  } else {
    return '2+ years';
  }
}

// Get last 7 days as array of date strings
export function getLastSevenDays(): string[] {
  const dates = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

// Format date to short day (MM/DD)
export function formatDayShort(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
}
