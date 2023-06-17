/**
 * Represents all HTTP headers.
 *
 * @typedef {Object} HttpHeaderFields
 * @property {string|string[]} [A-IM] - Acceptable instance-manipulations.
 * @property {string} [Accept] - Media types acceptable for the response.
 * @property {string} [Accept-Charset] - Character sets acceptable for the response.
 * @property {string} [Accept-Datetime] - Acceptable version in time of the resource.
 * @property {string} [Accept-Encoding] - Acceptable encoding of the resource.
 * @property {string} [Accept-Language] - Acceptable natural language for the response.
 * @property {string} [Access-Control-Allow-Credentials] - Indicates whether the response to the request can be exposed when credentials are included.
 * @property {string} [Access-Control-Allow-Headers] - Used in response to a preflight request to indicate which HTTP headers can be used when making the actual request.
 * @property {string} [Access-Control-Allow-Methods] - Specifies the method or methods allowed when accessing the resource in response to a preflight request.
 * @property {string} [Access-Control-Allow-Origin] - Indicates whether the response can be shared with resources with the given origin.
 * @property {string} [Access-Control-Expose-Headers] - Indicates which headers are safe to expose to the API of a CORS API specification.
 * @property {string} [Access-Control-Max-Age] - Indicates how long the results of a preflight request can be cached.
 * @property {string} [Age] - The age the object has been in a proxy cache in seconds.
 * @property {string} [Allow] - Valid methods for a specified resource.
 * @property {string} [Alt-Svc] - Alternative services.
 * @property {string} [Cache-Control] - Used to specify directives that must be obeyed by all caching mechanisms along the request-response chain.
 * @property {string} [Connection] - Control options for the current connection and list of hop-by-hop response fields.
 * @property {string} [Content-Disposition] - An opportunity to raise a "File Download" dialogue box for a known MIME type with binary format or suggest a filename for dynamic content.
 * @property {string} [Content-Encoding] - The type of encoding used on the data.
 * @property {string} [Content-Language] - The natural language or languages of the intended audience for the enclosed content.
 * @property {string} [Content-Length] - The length of the response body in octets (8-bit bytes).
 * @property {string} [Content-Location] - An alternate location for the returned data.
 * @property {string} [Content-MD5] - A Base64-encoded binary MD5 sum of the content of the response.
 * @property {string} [Content-Range] - Where in a full body message this partial message belongs.
 * @property {string} [Content-Type] - The MIME type of this content.
 * @property {string} [Cookie] - An HTTP cookie previously sent by the server with Set-Cookie (below).
 * @property {string} [DNT] - Indicates the user's tracking preference.
 * @property {string} [Date] - The date and time that the message was sent.
 * @property {string} [ETag] - The entity tag for the requested variant.
 * @property {string} [Expect] - Indicates that particular server behaviors are required by the client.
 * @property {string} [Expires] - Gives the date/time after which the response is considered stale.
 * @property {string} [Forwarded] - Forwarded headers.
 * @property {string} [From] - The email address of the user making the request.
 * @property {string} [Host] - The domain name of the server (for virtual hosting), and the TCP port number on which the server is listening.
 * @property {string} [If-Match] - Only perform the action if the client supplied entity matches the same entity on the server.
 * @property {string} [If-Modified-Since] - Allows a 304 Not Modified to be returned if content is unchanged.
 * @property {string} [If-None-Match] - Allows a 304 Not Modified to be returned if content is unchanged, see HTTP ETag.
 * @property {string} [If-Range] - If the entity is unchanged, send me the part(s) that I am missing; otherwise, send me the entire new entity.
 * @property {string} [If-Unmodified-Since] - Only send the response if the entity has not been modified since a specific time.
 * @property {string} [Last-Modified] - The last modified date for the requested object.
 * @property {string} [Link] - Used to express a typed relationship with another resource, where the relation type is defined by RFC 5988.
 * @property {string} [Location] - Used in redirection, or when a new resource has been created.
 * @property {string} [Max-Forwards] - Limit the number of times the message can be forwarded through proxies or gateways.
 * @property {string} [Origin] - Initiates a request for cross-origin resource sharing with Origin (below).
 * @property {string} [Pragma] - Implementation-specific headers that may have various effects anywhere along the request-response chain.
 * @property {string} [Proxy-Authenticate] - Request authentication to access the proxy.
 * @property {string} [Proxy-Authorization] - Authorization credentials for connecting to a proxy.
 * @property {string} [Public-Key-Pins] - HTTP Public Key Pinning, announces hash of website's authentic TLS certificate.
 * @property {string} [Range] - Request only part of an entity. Bytes are numbered from 0.
 * @property {string} [Referer] - This is the address of the previous web page from which a link to the currently requested page was followed.
 * @property {string} [Refresh] - Used in redirection, or when a new resource has been created.
 * @property {string} [Retry-After] - If an entity is temporarily unavailable, this instructs the client to try again after a specified period of time.
 * @property {string} [Server] - A name for the server.
 * @property {string} [Set-Cookie] - An HTTP cookie.
 * @property {string} [Strict-Transport-Security] - HTTP Strict Transport Security.
 * @property {string} [TE] - The transfer encodings the user agent is willing to accept: the same values as for the response header field Transfer-Encoding can be used, plus the "trailers" value (related to the "chunked" transfer method) to notify the server it expects to receive additional fields in the trailer after the last, zero-sized, chunk.
 * @property {string} [Tk] - Tracking Status header, value suggested to be sent in response to a DNT(do-not-track), possible values: "?" - "!" - "G" - "N".
 * @property {string} [Trailer] - The Trailer general field value indicates that the given set of header fields is present in the trailer of a message encoded with chunked transfer-coding.
 * @property {string} [Transfer-Encoding] - The form of encoding used to safely transfer the entity to the user.
 * @property {string} [Upgrade] - Ask the server to upgrade to another protocol.
 * @property {string} [User-Agent] - The user agent string of the user agent.
 * @property {string} [Vary] - Tells downstream proxies how to match future request headers to decide whether the cached response can be used rather than requesting a fresh one from the origin server.
 * @property {string} [Via] - Informs the client of proxies through which the response was sent.
 * @property {string} [Warning] - A general warning about possible problems with the entity body.
 * @property {string} [WWW-Authenticate] - Indicates the authentication scheme that should be used to access the requested entity.
*/
export interface HTTPHeaders {
  'Access-Control-Allow-Credentials'?: string & boolean;
  'Access-Control-Allow-Headers'?: string;
  'Access-Control-Allow-Methods'?: string;
  'Access-Control-Allow-Origin'?: string;
  'Access-Control-Max-Age'?: string & number;
  'Access-Control-Request-Headers'?: string;
  'Access-Control-Request-Method'?: string;
  'Access-Control-Expose-Headers'?: string;

  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
  responseType?: XMLHttpRequestResponseType;
  redirect?: 'follow' | 'error' | 'manual';
  Authorization?: string;
  'Content-Type'?: 'application/json' | 'multipart/form-data' | 'text/plain' | 'application/x-www-form-urlencoded' | 'application/octet-stream' & string;

  'A-IM'?: string;
  'Accept'?: '*/*' | 'application/json' | 'text/plain' | 'text/html' | 'application/xhtml+xml' | 'application/xml' | 'application/atom+xml' | 'application/rss+xml' | 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'application/octet-stream' & string;
  'Accept-CH'?: string;
  'Accept-CH-Lifetime'?: string & number; 
  'Accept-Charset'?: string;
  'Accept-Datetime'?: string;
  'Accept-Encoding'?: string;
  'Accept-Language'?: string;
  'Age'?: string;
  'Allow'?: string;
  'Alt-Svc'?: string;
  'Cache-Control'?: string;
  'Connection'?: string;
  'Content-Disposition'?: string;
  'Content-Encoding'?: string;
  'Content-Language'?: string;
  'Content-Length'?: string;
  'Content-Location'?: string;
  'Content-MD5'?: string;
  'Content-Range'?: string;
  'Cookie'?: string;
  'DNT'?: string;
  'Date'?: string;
  'ETag'?: string;
  'Expect'?: string;
  'Expires'?: string;
  'Forwarded'?: string;
  'From'?: string;
  'Host'?: string;
  'If-Match'?: string;
  'If-Modified-Since'?: string;
  'If-None-Match'?: string;
  'If-Range'?: string;
  'If-Unmodified-Since'?: string;
  'Last-Modified'?: string;
  'Link'?: string;
  'Location'?: string;
  'Max-Forwards'?: string;
  'Origin'?: string;
  'Pragma'?: string;
  'Prefer'?: string;
  'Proxy-Authenticate'?: string;
  'Proxy-Authorization'?: string;
  'Range'?: string;
  'Referer'?: string;
  'Retry-After'?: string;
  'Server'?: string;
  'Set-Cookie'?: string;
  'Strict-Transport-Security'?: string;
  'TCN'?: string;
  'TE'?: string;
  'Trailer'?: string;
  'Transfer-Encoding'?: string;
  'Upgrade'?: string;
  'User-Agent'?: string;
  'Vary'?: string;
  'Via'?: string;
  'Warning'?: string;
  'WWW-Authenticate'?: string;

  [key: string]: any;
}