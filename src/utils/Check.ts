export class Check {
  public static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}
