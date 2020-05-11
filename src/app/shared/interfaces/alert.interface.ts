import { AlertType } from '../services/alert.service';

export interface Alert {
    type: AlertType;
    text: string;
}