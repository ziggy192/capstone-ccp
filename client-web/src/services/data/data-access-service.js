import AjaxService from './ajax-service';

/**
 * HTTP service capable of performing GET and POST requests
 * This service will be injected into domain services (e.g. PatientService, MedicationService)
 * Agnostic of prototype/production
 */
const _request = (method, url, data, options) => {
  const defaultOptions = {
    method: method,
    url: url,
    responseType: 'json',
    headers: {}
  };

  if (data) {
    if (!options || !options.headers || !options.headers['Content-Type']) {
      defaultOptions.data = JSON.stringify(data);
      defaultOptions.headers = {
        'Content-Type': 'application/json'
      };
    } else {
      defaultOptions.data = data;
    }
  }
  const token = localStorage.getItem('JWT_TOKEN');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  let requestOptions = defaultOptions;
  if (options) {
    requestOptions = Object.assign(defaultOptions, options);
  }

  // Resolve the original request, and wrap the response in another promise.
  // This allows allows us to peer into the response before giving it back
  // to the caller, which is helpful when handling situations where a response
  // is technically successful from an AJAX perspective (200 OK), but failed
  // server-side due an arbitrary error (i.e. validation error).
  return new Promise((resolve, reject) => {
    AjaxService.request(requestOptions)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        if (!error) {
          error = new Error('An unknown error occurred');
        } else if (!error.message) {
          error.message = `${error.status} ${error.statusText}`;
        }
        reject(error);
      });
  });
};

export const DataAccessService = {
  get (url, options) {
    return _request('GET', url, null, options);
  },
  post (url, data, options) {
    return _request('POST', url, data, options);
  },
  put (url, data, options) {
    return _request('PUT', url, data, options);
  },
  delete (url, data, options) {
    return _request('DELETE', url, data, options);
  }
};

export default DataAccessService;
