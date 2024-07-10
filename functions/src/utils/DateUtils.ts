export class DateUtils {

    static convertDateStringAikonApiToUnixTimestamp(dateString: string) {
        if (!dateString) {
          return null;
        }
      
        const match = /\/Date\((\d+)(?:-\d+)?\)\//.exec(dateString);
        if (match) {
          return Number(match[1]);
        }
        
        return null;
    }
}