import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const GEOLOCATION_ERRORS = {
    'errors.location.unsupportedBrowser': 'Browser não suporta serviços de localização',
    'errors.location.permissionDenied': 'O usuário não concedeu permissão',
    'errors.location.positionUnavailable': `Não foi possível obter a localização.
                                            É possível que a página não esteja sendo servida por HTTPS`,
    'errors.location.timeout': 'O tempo limite de espera expirou'
};

@Injectable()
export class GeoLocationService {

    constructor() { }

    getUserLocationFromBrowser(): Observable<any> {
        // https://www.w3schools.com/html/html5_geolocation.asp
        // Note: As of Chrome 50, the Geolocation API will only work on secure contexts such as HTTPS.
        // If your site is hosted on an non-secure origin (such as HTTP) the requests to get the users
        // location will no longer function.
        //
        // Safari also blocks geoLocation requests from non HTTPS

        const navigator = window.navigator;
        const positionOptions = {
            enableHighAccuracy: false,  // we not not need high accuracy
            timeout: 5000,              // timeout for wait browser to get location
            maximumAge: 1000 * 60 * 60 * 24 // 24 hours - miliseconds
        };
        return Observable.create((observer) => {
            if (!navigator || !navigator.geolocation) {
                observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {                         // success callback
                    observer.next(position);
                    observer.complete();
                },
                (error: PositionError) => {             // error callback
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                            break;
                        case error.POSITION_UNAVAILABLE:
                            observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                            break;
                        case error.TIMEOUT:
                            observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                            break;
                    }
                },
                positionOptions                     // 3rd parameter - options
            );
        });
    }

}
