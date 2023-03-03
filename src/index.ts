class Minixios {
  xhr: XMLHttpRequest;

  constructor() {
    if (XMLHttpRequest) {
      this.xhr = new XMLHttpRequest();
    } else if (ActiveXObject) {
      this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); //? IE 5/6
    } else {
      throw new Error('Your browser does not support XMLHttpRequest');
    }
  }

  get(url: string, data?: any) {
    return this.request('GET', url, data);
  }

  post(url: string, data?: any) {
    return this.request('POST', url, data);
  }

  request(method: string, url: string, data?: any) {
    return new Promise((resolve, reject) => {
      this.xhr.open(method, url, true);
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === 200) {
            resolve(this.xhr.responseText);
          } else {
            reject(this.xhr.responseText);
          }
        }
      };
      this.xhr.send(data);
    });
  }
}

export default Minixios;
