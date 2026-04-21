import { isFalsyString } from '@togglecorp/fujs';
import type { ContextInterface } from '@togglecorp/toggle-request';

const GO_API = import.meta.env.APP_GO_API;
const JSON_TYPE = 'application/json';

type GoContextInterface = ContextInterface<
    unknown,
    ResponseError,
    unknown,
    unknown
>;

type ResponseError = {
    status: number;
    originalResponse: Response,
    responseText: string;
}

export const processUrls: GoContextInterface['transformUrl'] = (url) => {
    if (isFalsyString(url)) {
        return '';
    }
    if (/^https?:\/\//i.test(url)) {
        return url;
    }
    return GO_API + url;
};
export const processOptions: GoContextInterface['transformOptions'] = (
    _,
    requestOptions,
) => {
    const {
        body,
        headers,
        method = 'GET',
        ...otherOptions
    } = requestOptions;

    const defaultHeaders: HeadersInit = {};

    const requestBody = body ? JSON.stringify(body) : undefined;

    const contentType: string = JSON_TYPE;

    const specificHeaders = {
        Accept: contentType,
        'Content-Type': contentType,
    };

    return {
        method,
        headers: {
            ...defaultHeaders,
            ...specificHeaders,
            ...headers,
        },
        body: requestBody,
        ...otherOptions,
    };
};

export const processResponse = async (res: Response) => {
    const text = await res.text();
    if (res.status >= 200 && res.status < 300) {
        return res.headers.get('content-type')?.split('; ')[0] === JSON_TYPE
            ? JSON.parse(text)
            : text;
    }
    return { status: res.status, originalResponse: res.clone(), responseText: text };
};

export const processError: GoContextInterface['transformError'] = (err, url, opts) => {
    const getMessage = () => {
        if (err === 'network') return 'Cannot connect with the server!';
        if (err === 'parse') return 'There was a problem parsing the response from server';
        if (`${err?.status}`[0] === '5') return 'Internal server error!';
        if (!err?.responseText) return 'Empty error response from server!';
        if (opts.method === 'GET') return 'Failed to load data';

        if (err?.originalResponse?.headers.get('content-type') === JSON_TYPE) {
            try {
                const json = JSON.parse(err.responseText);
                if (typeof json?.statusCode === 'number') return json.error_message;
                if (json?.errors?.non_field_errors) return json.errors.non_field_errors.join(' ');
            // eslint-disable-next-line no-empty
            } catch {}
        }

        return err?.responseText ?? 'Some error occurred while performing this action.';
    };

    return {
        reason: typeof err === 'string' ? err : 'server',
        value: { messageForNotification: getMessage() },
        status: typeof err === 'object' ? err.status : undefined,
        debugMessage: JSON.stringify({ url, error: err }),
    };
};
