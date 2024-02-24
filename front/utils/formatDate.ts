export const getOnlyDate = (d: string) => {
  if (!d) {
    return '';
  }
  const [date] = d.split('T');
  return date;
}
