import axios from 'axios';

import { __BASE_URL__ } from '../config/environment';

export const api = axios.create({
    baseURL: __BASE_URL__,
    headers: {
        'Content-type': 'application/json'
    }
});