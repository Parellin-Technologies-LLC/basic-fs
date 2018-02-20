<p align="center">
	<a href="#">
    	<img
        	width="100px"
            height="100px"
            alt="basic-fs logo"
            src="https://github.com/Parellin-Technologies-LLC/basic-fs/blob/master/logo.png?raw=true" />
    </a>
</p>

# basic-fs
A very simple internal file system API for any computer.
Builds out compiled versions to MacOS, Linux, and Windows.

Download a [#release][0] to run locally.

To run locally
```
https://github.com/Parellin-Technologies-LLC/basic-fs
cd basic-fs
npm i
npm start
```

Building `basic-fs`
```
https://github.com/Parellin-Technologies-LLC/basic-fs
cd basic-fs
npm i
npm run build
```


### **Recommended for LOCAL AREA NETWORK ONLY**
> Known security notes
> - `basic-fs` does **not** deny access to the entire file system
> - running this program will expose the computer file system to the local area network
> - `basic-fs` does **not** (currently) implement authentication system - outside the scope of this project
> 	- quick fix can be to implement nginx or some oauth system to grant access

Use case:
- "Air drop" *like* system for Mac to PC/Linux
- Stream write or send files (perhaps log files) to another machine on your network

### Endpoints:

#### `GET /`
> returns the name and version of the application

**Example Response**:

```json
{
    "statusCode": 200,
    "message": "OK",
    "data": {
        "name": "basic-fs",
        "version": "0.1.2"
    }
}
```

<br/>

#### `GET /ping`
> returns a `pong`

**Example Response**:

```json
{
    "statusCode": 200,
    "message": "OK",
    "data": "pong"
}
```

<br/>

#### `GET /docs`
> returns the config of the application, including the api configuration

**Example Response**:

```json
{
    "statusCode": 200,
    "message": "OK",
    "data": {
        "name": "basic-fs",
        "version": "0.1.2",
        "cwd": "/Users/trashcan/GitHub/basic-fs",
        "DATA": "data/",
        "dotfiles": "allow",
        "timeout": 20000,
        "maximumURISize": 1600,
        "maximumHeaderSize": 4000,
        "maximumPayloadSize": 53687091200,
        "minimumHTTPVersion": 1.1,
        "speedStandard": 8,
        "api": {
            "home": {
                "route": "/",
                "method": [
                    "ALL"
                ]
            },
            "ping": {
                "route": "/ping",
                "method": [
                    "ALL"
                ]
            },
            "kill": {
                "route": "/kill",
                "method": [
                    "ALL"
                ]
            },
            "docs": {
                "route": "/docs",
                "method": [
                    "ALL"
                ]
            },
            "data": {
                "route": "/data*",
                "method": [
                    "GET",
                    "PUT",
                    "POST",
                    "DELETE"
                ]
            }
        },
        "root": "/Users/trashcan/GitHub/basic-fs/data/"
    }
}
```

<br/>

#### `GET /kill`
> shuts the server down and stops the API

**Example Response**:

```json
{
    "statusCode": 200,
    "message": "OK",
    "data": "server terminated"
}
```

<br/>

#### `GET /data/*` and `GET /form/*`
> returns data specified in the uri parameters
> Notes:
> - if a directory is specified: returns a list of the contents in a directory
> - if a file is specified: returns the data of the file

**Example Response**:

`GET /data/`

```json
{
    "statusCode": 200,
    "message": "OK",
    "data": [
        "ok.json"
    ]
}
```

`GET /data/ok.json`

```json
{
    "hello": "world"
}
```

**Example Error**:

- if the path or file does not exist
```json
{
    "statusCode": 404,
    "message": "Not Found",
    "data": "/ok.json"
}
```

<br/>

#### `POST /data/*` and `POST /form/*`
> creates a folder or file if it does not exist
> Notes:
> - `/form` will **not** overwrite data
> - `/data` **will** overwrite data
> - will create deep paths if they do not exist
> - will accept bulk uploads

**Example Response**:

`POST /data/path/`

```json
{
    "statusCode": 201,
    "message": "Created",
    "data": [
        "/path/"
    ]
}
```

`POST /data/path/ok.json`

```json
{
    "statusCode": 201,
    "message": "Created",
    "data": [
        "/path/ok.json"
    ]
}
```

**Example Error**:

- if the path or file already exists
```json
{
    "statusCode": 409,
    "message": "Conflict",
    "data": "File or path already exists: /path/"
}
```

<br/>

#### `PUT /form/*`
> updates a folder or file if it exists
> Notes:
> - **will** overwrite data
> - will not create deep paths if they do not exist
> - will accept bulk uploads

**Example Response**:

`PUT /data/path/`

```json
{
    "statusCode": 202,
    "message": "Accepted",
    "data": [
        "/path/"
    ]
}
```

`PUT /data/ok.json`

```json
{
    "statusCode": 202,
    "message": "Accepted",
    "data": [
        "/ok.json"
    ]
}
```

**Example Error**:

- if the path or file does not exist
```json
{
    "statusCode": 404,
    "message": "Not Found",
    "data": "/ok.json"
}
```

<br/>

#### `DELETE /data/*` and `DELETE /form/*`
> deletes a folder or file if it exists
> Notes:
> - **will** recursively delete a folder

**Example Response**:

`DELETE /data/path/`

```json
{
    "statusCode": 200,
    "message": "OK",
    "data": "/path/"
}
```

`DELETE /data/ok.json`

```json
{
    "statusCode": 200,
    "message": "OK",
    "data": "/ok.json"
}
```

**Example Error**:

- if the path or file does not exist
```json
{
    "statusCode": 404,
    "message": "Not Found",
    "data": "/ok.json"
}
```

<br/>

### `ALL /*`
> "catch all" for unknown requests
> Compliance requirement: RFC2616 10.4.7

<br/>

### Miscellaneous Errors

- `HTTP 408 Request Timeout`
    - returned if the request timed out
    - accommodates to content length of a request
        - based on a 1 Mbps speed standard or approximately 8 milliseconds per byte
- `HTTP 413 Payload Too Large`
    - returned if the body size exceeds 53687091200 bytes (5 GB)
- `HTTP 414 URI Too Long`
    - returned if the uri exceeds 1600 bytes
- `HTTP 431 Request Header Fields Too Large`
    - returned if the header size exceeds 4000 bytes
- `HTTP 505 HTTP Version Not Supported`
    - returned if the HTTP Version is not HTTP1.1 or later

[0]: https://github.com/Parellin-Technologies-LLC/basic-fs/

