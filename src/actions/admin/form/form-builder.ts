// ...existing code...
export function checkFormStatus(eventId: string) {
  // Check if form should be closed by time or max submissions
  // ...existing code...
  console.log('Form is open', eventId);
  return { isOpen: true };
}

// export function canGenerateTicket(registration: any) {
//   // Failsafe to ensure user can't generate a ticket unless approved
//   // ...existing code...
//   return registration.is_approved === true;
// }
// // ...existing code...
