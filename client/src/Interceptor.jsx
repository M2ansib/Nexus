import fetchIntercept from 'fetch-intercept';
import React, {useState, useEffect} from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

export default function Interceptor (props) {
    const ENABLED = true;

    const {enqueueSnackbar} = useSnackbar();

    const unregister = fetchIntercept.register({
        request: function (url, config) {
            // Modify the url or config here
            const withDefaults = Object.assign({}, config);
            withDefaults.headers = withDefaults.headers || new Headers({
                'Content-Type': "application/json; charset=utf-8"
            });
            enqueueSnackbar(`[Interceptor] Sent request to '${url}': ${JSON.stringify(withDefaults)}`, {variant: 'info'});
            return [url, withDefaults];
        },
    
        requestError: function (error) {
            // Called when an error occured during another 'request' interceptor call
            enqueueSnackbar(error.toString(), {variant: 'error'});
            return Promise.reject(error);
        },
    
        response: function (response) {
            // const request = "<null>";
            // response.request.text().then(text => request = text);
            // Modify the reponse object
            if (!response.ok) {
                response.text().then(text => enqueueSnackbar(`[Interceptor] Error from ${response.url}: \n${text}`, {variant: "error"}));
            }
            else {
                response.json().then(data => enqueueSnackbar(`[Interceptor] Response from ${response.url}: \n${JSON.stringify(data)}`, {variant: 'success'}))
            }
            return response;
        },
    
        responseError: function (error) {
            // Handle an fetch error
            enqueueSnackbar(`[Interceptor] Fetch error: ${error.toString()}`, {variant: 'error'});
            return Promise.reject(error);
        }
    });

    if (!ENABLED) unregister();

    return <div></div>;
}