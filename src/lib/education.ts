function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function calculateSemester(startYear: number, startMonth: number): string {
  const now = new Date();
  const startDate = new Date(startYear, startMonth - 1, 1);

  const monthsElapsed =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());

  const semester = Math.floor(monthsElapsed / 6) + 1;
  return `${semester}${getOrdinalSuffix(semester)} Semester`;
}
