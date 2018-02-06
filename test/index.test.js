/** ****************************************************************************************************
 * File: index.test.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 08-Jan-2018
 *******************************************************************************************************/
'use strict';

const
    config         = require( '../config' ),
    chai           = require( 'chai' ),
    chaiHTTP       = require( 'chai-http' ),
    chaiAsPromised = require( 'chai-as-promised' ),
    expect         = chai.expect,
    { should }     = chai;

should();
chai.use( chaiHTTP );
chai.use( chaiAsPromised );

const
    { join }       = require( 'path' ),
    { pathExists } = require( 'fs-extra' ),
    { connect }    = require( 'net' ),
    UUIDv4         = require( 'uuid/v4' );

describe( 'basic-fs tests', () => {
    process.env.NODE_ENV = 'test';

    const
        server = require( '../server' )();

    it( 'should have instance of express', () => {
        expect( server ).to.have.property( 'express' );
    } );

    it( 'should initialize and set the port', () => {
        expect( server.initialize() ).to.eventually.have.property( 'port' );
    } );

    it( 'should have ensured directory: "data"', () => {
        expect( pathExists( join( process.cwd(), 'data' ) ) ).to.eventually.eq( true );
    } );

    it( 'should not have binding to port', () => {
        expect( server ).to.not.have.property( 'server' );
    } );

    it( 'should start the server', () => {
        expect( server.start() ).to.eventually.have.property( 'server' );
    } );

    it( 'should have bind to port', () => {
        expect( server.server.address() ).to.have.property( 'port' ).and.eq( server.port );
    } );

    describe( 'API packet inspection', () => {
        it( `should have response 414 URI Too Long if the URI exceeds ${config.maximumURISize} bytes`, done => {
            chai.request( server.express )
                .get( '/' + '0'.repeat( config.maximumURISize ) )
                .end( ( err, res ) => {
                    if( err ) {
                        res.should.have.status( 414 );
                        res.body.should.have.property( 'statusCode' ).and.eq( 414 );
                        res.body.should.have.property( 'message' ).and.eq( 'URI Too Long' );
                    } else {
                        res.should.have.status( 414 );
                    }
                    done();
                } );
        } );

        it( `should have response 431 Request Header Fields Too Large if the Headers exceeds ${config.maximumHeaderSize} bytes`, done => {
            chai.request( server.express )
                .get( '/' )
                .set( 'x-random', '0'.repeat( config.maximumHeaderSize ) )
                .end( ( err, res ) => {
                    if( err ) {
                        res.should.have.status( 431 );
                        res.body.should.have.property( 'statusCode' ).and.eq( 431 );
                        res.body.should.have.property( 'message' ).and.eq( 'Request Header Fields Too Large' );
                    } else {
                        res.should.have.status( 431 );
                    }
                    done();
                } );
        } );

        it( `should have response 413 Payload Too Large if the Headers exceeds ${config.maximumPayloadSize} bytes`, done => {
            chai.request( server.express )
                .get( '/' )
                .set( 'content-length', config.maximumPayloadSize )
                .end( ( err, res ) => {
                    if( err ) {
                        res.should.have.status( 413 );
                        res.body.should.have.property( 'statusCode' ).and.eq( 413 );
                        res.body.should.have.property( 'message' ).and.eq( 'Payload Too Large' );
                    } else {
                        res.should.have.status( 413 );
                    }
                    done();
                } );
        } );

        it( `should have response 505 HTTP Version Not Supported if HTTP Version does not meet requirement: HTTP/${config.minimumHTTPVersion}`, done => {
            const
                socket = connect(
                    { host: 'localhost', port: server.port },
                    () => socket.end(
                        'GET / HTTP/1.0\r\n' +
                        'Host: localhost:3000\r\n' +
                        '\r\n'
                    )
                ),
                data   = [];

            socket.on( 'data', d => data.push( d ) );
            socket.on( 'end', () => {
                const result = Buffer.concat( data ).toString();
                expect( result ).to.have.string( 'HTTP/1.1 505 HTTP Version Not Supported' );
                done();
            } );
        } );

        it( 'should have constructed set of response headers', done => {
            chai.request( server.express )
                .get( '/' )
                .end( ( err, res ) => {
                    if( err ) console.error( err );
                    res.should.have.status( 200 );
                    res.should.have.property( 'headers' );
                    res.headers.should.have.property( 'requestid' );
                    res.headers.should.have.property( 'access-control-allow-origin' ).and.eq( '*' );
                    res.headers.should.have.property( 'access-control-max-age' ).and.eq( '1728000' );
                    res.headers.should.have.property( 'content-type' ).and.eq( 'application/json; charset=utf-8' );
                    res.headers.should.have.property( 'content-length' ).and
                        .eq( '' + ( JSON.stringify( {
                            statusCode: 200,
                            message: 'OK',
                            data: { name: config.name, version: config.version }
                        } ).length ) );
                    done();
                } );
        } );
    } );

    describe( 'GET /', () => {
        it( `should have response: 200 OK with "${config.name}" and "${config.version}"`, done => {
            chai.request( server.express )
                .get( '/' )
                .end( ( err, res ) => {
                    if( err ) console.error( err );
                    res.should.have.status( 200 );
                    res.body.should.have.property( 'statusCode' ).and.eq( 200 );
                    res.body.should.have.property( 'message' ).and.eq( 'OK' );
                    res.body.should.have.property( 'data' ).and.deep
                        .eq( { name: config.name, version: config.version } );
                    done();
                } );
        } );
    } );

    describe( 'GET /ping', () => {
        it( 'should have response: 200 OK with "pong"', done => {
            chai.request( server.express )
                .get( '/ping' )
                .end( ( err, res ) => {
                    if( err ) console.error( err );
                    res.should.have.status( 200 );
                    res.body.should.have.property( 'statusCode' ).and.eq( 200 );
                    res.body.should.have.property( 'message' ).and.eq( 'OK' );
                    res.body.should.have.property( 'data' ).and.eq( 'pong' );
                    done();
                } );
        } );
    } );

    describe( 'GET /docs', () => {
        it( 'should have response: 200 OK with data from the config', done => {
            chai.request( server.express )
                .get( '/docs' )
                .end( ( err, res ) => {
                    if( err ) console.error( err );
                    res.should.have.status( 200 );
                    res.body.should.have.property( 'statusCode' ).and.eq( 200 );
                    res.body.should.have.property( 'message' ).and.eq( 'OK' );
                    res.body.should.have.property( 'data' ).and.deep.eq( config );
                    done();
                } );
        } );
    } );

    describe( 'GET /unknown', () => {
        it( 'should have response: 405 Method Not Allowed', done => {
            chai.request( server.express )
                .get( '/unknown' )
                .end( ( err, res ) => {
                    if( err ) {
                        res.should.have.status( 405 );
                        res.body.should.have.property( 'statusCode' ).and.eq( 405 );
                        res.body.should.have.property( 'message' ).and.eq( 'Method Not Allowed' );
                        res.body.should.have.property( 'data' );
                        res.body.data.should.have.property( 'reason' ).and.eq( 'Method: GET on /unknown not allowed' );
                    } else {
                        res.should.have.status( 405 );
                    }
                    done();
                } );
        } );

        it( 'should have RFC2616 10.4.7 compliant header: "allow"', done => {
            chai.request( server.express )
                .get( '/unknown' )
                .end( ( err, res ) => {
                    if( err ) {
                        res.should.have.status( 405 );
                    }

                    res.headers.should.have.property( 'allow' ).and.eq(
                        Object.keys( config.api ).reduce(
                            ( r, i ) => {
                                config.api[ i ].method.forEach( m => r.push( m + ' ' + config.api[ i ].route ) );
                                return r;
                            }, []
                        ).join( ', ' )
                    );
                    done();
                } );
        } );
    } );

    describe( 'Methods /data', () => {
        const
            testID     = UUIDv4(),
            filename   = `test-${testID}.json`,
            data       = { hello: 'world' },
            updateData = { hello: 'there' };

        describe( `POST /data/${filename}`, () => {
            it( `should have response 201 Created with filename ${filename}`, done => {
                chai.request( server.express )
                    .post( `/data/${filename}` )
                    .send( data )
                    .end( ( err, res ) => {
                        if( err ) console.error( err );
                        res.should.have.status( 201 );
                        res.body.should.have.property( 'statusCode' ).and.eq( 201 );
                        res.body.should.have.property( 'message' ).and.eq( 'Created' );
                        res.body.should.have.property( 'data' ).and.deep.eq( [ `/${filename}` ] );
                        done();
                    } );
            } );

            it( `should create a file in /data with name: ${filename}`, () => {
                expect( pathExists( join( config.root, filename ) ) ).to.eventually.eq( true );
            } );

            it( 'should not allow write and responds with 409 Conflict if POST is attempted on a file that exists', done => {
                chai.request( server.express )
                    .post( `/data/${filename}` )
                    .send( data )
                    .end( ( err, res ) => {
                        if( err ) {
                            res.should.have.status( 409 );
                            res.body.should.have.property( 'statusCode' ).and.eq( 409 );
                            res.body.should.have.property( 'message' ).and.eq( 'Conflict' );
                            res.body.should.have.property( 'data' ).and.eq( `File or path already exists: /${filename}` );
                        } else {
                            res.should.have.status( 409 );
                        }
                        done();
                    } );
            } );
        } );

        describe( 'GET /data/', () => {
            it( `should have response 200 OK and contain an array of files including ${filename}`, done => {
                chai.request( server.express )
                    .get( '/data/' )
                    .end( ( err, res ) => {
                        if( err ) console.error( err );
                        res.should.have.status( 200 );
                        res.body.should.have.property( 'statusCode' ).and.eq( 200 );
                        res.body.should.have.property( 'message' ).and.eq( 'OK' );
                        res.body.should.have.property( 'data' );
                        res.body.data.should.be.an( 'array' ).that.does.include( filename );
                        done();
                    } );
            } );
        } );

        describe( `GET /data/${filename}`, () => {
            it( `should have response 200 OK and contain the data in ${filename}`, done => {
                chai.request( server.express )
                    .get( `/data/${filename}` )
                    .end( ( err, res ) => {
                        if( err ) console.error( err );
                        res.should.have.status( 200 );
                        res.body.should.deep.eq( data );
                        done();
                    } );
            } );

            it( 'should have response 404 Not Found if file does not exist', done => {
                const random = UUIDv4();

                chai.request( server.express )
                    .get( `/data/${random}` )
                    .end( ( err, res ) => {
                        if( err ) {
                            res.should.have.status( 404 );
                            res.body.should.have.property( 'statusCode' ).and.eq( 404 );
                            res.body.should.have.property( 'message' ).and.eq( 'Not Found' );
                            res.body.should.have.property( 'data' ).and.eq( `/${random}` );
                        } else {
                            res.should.have.status( 404 );
                        }
                        done();
                    } );
            } );
        } );

        describe( `PUT /data/${filename}`, () => {
            it( `should have response 202 Accepted with filename ${filename}`, done => {
                chai.request( server.express )
                    .put( `/data/${filename}` )
                    .send( updateData )
                    .end( ( err, res ) => {
                        if( err ) console.error( err );
                        res.should.have.status( 202 );
                        res.body.should.have.property( 'statusCode' ).and.eq( 202 );
                        res.body.should.have.property( 'message' ).and.eq( 'Accepted' );
                        res.body.should.have.property( 'data' ).and.deep.eq( [ `/${filename}` ] );
                        done();
                    } );
            } );

            it( `should have updated the data in ${filename}`, done => {
                chai.request( server.express )
                    .get( `/data/${filename}` )
                    .end( ( err, res ) => {
                        if( err ) console.error( err );
                        res.should.have.status( 200 );
                        res.body.should.deep.eq( updateData );
                        done();
                    } );
            } );

            it( 'should have response 404 Not Found if file does not exist', done => {
                const random = UUIDv4();

                chai.request( server.express )
                    .put( `/data/${random}` )
                    .send( updateData )
                    .end( ( err, res ) => {
                        if( err ) {
                            res.should.have.status( 404 );
                            res.body.should.have.property( 'statusCode' ).and.eq( 404 );
                            res.body.should.have.property( 'message' ).and.eq( 'Not Found' );
                            res.body.should.have.property( 'data' ).and.eq( `/${random}` );
                        } else {
                            res.should.have.status( 404 );
                        }
                        done();
                    } );
            } );
        } );

        describe( `DELETE /data/${filename}`, () => {
            it( `should have response 200 OK with filename ${filename}`, done => {
                chai.request( server.express )
                    .delete( `/data/${filename}` )
                    .end( ( err, res ) => {
                        if( err ) console.error( err );
                        res.should.have.status( 200 );
                        res.body.should.have.property( 'statusCode' ).and.eq( 200 );
                        res.body.should.have.property( 'message' ).and.eq( 'OK' );
                        res.body.should.have.property( 'data' ).and.eq( `/${filename}` );
                        done();
                    } );
            } );

            it( `should delete a file in /data with name: ${filename}`, () => {
                expect( pathExists( join( config.root, filename ) ) ).to.eventually.eq( false );
            } );

            it( 'should have response 404 Not Found if file does not exist', done => {
                chai.request( server.express )
                    .get( `/data/${filename}` )
                    .end( ( err, res ) => {
                        if( err ) {
                            res.should.have.status( 404 );
                            res.body.should.have.property( 'statusCode' ).and.eq( 404 );
                            res.body.should.have.property( 'message' ).and.eq( 'Not Found' );
                            res.body.should.have.property( 'data' ).and.eq( `/${filename}` );
                        } else {
                            res.should.have.status( 404 );
                        }
                        done();
                    } );
            } );
        } );
    } );

    describe( 'GET /kill', () => {
        it( 'should have binding to port', () => {
            expect( server.server.address() ).to.have.property( 'port' ).and.eq( server.port );
        } );

        it( 'should have kill server and respond: 200 OK with data "server terminated"', done => {
            chai.request( server.express )
                .get( '/kill' )
                .end( ( err, res ) => {
                    if( err ) console.error( err );
                    res.should.have.status( 200 );
                    res.body.should.have.property( 'statusCode' ).and.eq( 200 );
                    res.body.should.have.property( 'message' ).and.eq( 'OK' );
                    res.body.should.have.property( 'data' ).and.eq( 'server terminated' );
                    done();
                } );
        } );

        it( 'should no longer have binding to port', () => {
            expect( server.server.address() ).to.eq( null );
        } );
    } );

    after( () => setTimeout( () => process.exit( 0 ), 500 ) );
} );
