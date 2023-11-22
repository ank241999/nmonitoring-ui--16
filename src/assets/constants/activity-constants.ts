import { environment } from '../../environments/environment';
export class ActivityConstants {
    // Depends on i18n translation
    public static get statusOk(): string { return 'Ok'; }
    public static get statusAnomalies(): string { return 'Anomalies'; }
    public static get statusThreat(): string { return 'Threat'; }
    public static get fullDisplay(): string { return 'full display'; }

    public static get smallNoThreatIcon(): string { return '../../assets/images/noThreatSmallDot-2.png'; }
    public static get largeNoThreatIcon(): string { return '../../assets/images/noThreatLargeDot.png'; }
    public static get smallAnomalyIcon(): string { return '../../assets/images/noThreatSmallDot.png'; }
    public static get largeAnomalyIcon(): string { return '../../assets/images/threatLargeDot.png'; }
    public static get smallThreatIcon(): string { return '../../assets/images/noThreatSmallDot.png'; }
    public static get largeThreatIcon(): string { return '../../assets/images/threatLargeDot.png'; }
    public static get noImageIcon(): string { return '../../assets/images/noimage.png'; }

    public static getThreatActivityCircle(r: string): string {
        return `../../assets/images/${r}.png`;
    }

    public static get threatActivityCircle(): string { return '../../assets/images/Red_threat_Specific_Location_Box.png'; }
    public static get sensitiveAreaActivityCircle(): string { return '../../assets/images/sa.png'; }
    public static get noThreatActivityCircle(): string { return '../../assets/images/nohreat.png'; }
    public static get anomalyActivityCircle(): string { return '../../assets/images/Yellow_Specific_Location_Circles@2x.png'; }

    public static get threatBorderImage(): string { return '../../assets/images/Red_BorderLine_Rectangle@2x.png'; }
    public static get noThreatBorderImage(): string { return '../../assets/images/Green_BorderLine_Rectangle@2x.png'; }
    public static get anomalyBorderImage(): string { return '../../assets/images/Yellow_BorderLine_Rectangle@2x.png'; }

    public static get threat(): string { return 'txtThreat'; }
    public static get noThreat(): string { return 'txtNoThreat'; }
    public static get anomaly(): string { return 'Anomaly'; }

    public static get threatNoObject(): string { return 'No Objects On The Person Scanned'; }

    public static get threatCellphone(): string { return 'Cellphone'; }
    public static get threatKeys(): string { return 'Keys'; }

    public static get threatAnomaly(): string { return 'Anomaly'; }

    public static get threatHandgun(): string { return 'Handgun'; }
    public static get threatRifle(): string { return 'Rifle'; }
    public static get threatPipebomb(): string { return 'Pipebomb'; }
    public static get pipeBomblabel(): string { return 'Pipe bomb'; }
    public static get threatKnife(): string { return 'Knife'; }
    public static get threatThreat(): string { return 'Threat'; }

    // get locale
    public static getLocale(): string {
        let timeOffset: number = new Date().getTimezoneOffset();
        timeOffset = timeOffset * -1;
        const hour: number = Math.floor(timeOffset / 60);
        const minute: number = timeOffset % 60;
        let locale: string = hour + ':' + (minute < 0 ? minute * -1 : minute);
        if (timeOffset >= 0) {
            locale = '+' + hour + ':' + minute;
        }
        console.log('a');
        // localStorage.setItem('locale', locale);
        return locale;
    }
    // retain required values
    public static retainRequiredValues() {
        const serverUrl: string = localStorage.getItem('serverUrl');
        const logoImagePath: string = localStorage.getItem('logoImagePath');
        const footPrintImagePath: string = localStorage.getItem('footPrintImagePath');
        const logoImageName: string = localStorage.getItem('logoImageName');
        const footPrintImageName: string = localStorage.getItem('footPrintImageName');

        localStorage.clear();

        localStorage.setItem('serverUrl', serverUrl);
        localStorage.setItem('logoImagePath', logoImagePath);
        localStorage.setItem('footPrintImagePath', footPrintImagePath);
        localStorage.setItem('logoImageName', logoImageName);
        localStorage.setItem('footPrintImageName', footPrintImageName);
    }

    public static arraySortByKey(array, key, order = 'desc') {
        return array.sort(function (a, b) {
            const x = (order === 'desc' ? a[key] : b[key]);
            const y = (order === 'desc' ? b[key] : a[key]);
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
}
