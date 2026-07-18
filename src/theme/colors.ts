export const colors = {
  background: '#FFFFFF',
  backgroundElement: '#F2F2F2',
  border: '#D8D8D8',
  text: '#111111',
  textMuted: '#555555',
  primary: '#1A5FB4',
  disabled: '#A6A6A6',

  // Operational status colors. Architecture requires status to never rely on
  // color alone — pair these with a label/icon wherever they're used.
  status: {
    pickedUp: '#2E7D32',
    specialSnack: '#C77800',
    allergy: '#C62828',
    medical: '#C62828',
    late: '#1565C0',
    swim: '#1565C0',
    inactive: '#757575',
  },
} as const;
