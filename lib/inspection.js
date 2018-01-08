/** ****************************************************************************************************
 * File: inspection.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 04-Jan-2018
 *******************************************************************************************************/
'use strict';

const
    {
        timeout,
        maximumURISize,
        maximumHeaderSize,
        maximumPayloadSize,
        minimumHTTPVersion,
        speedStandard
    }          = require( '../config' ),
    UUIDv4     = require( 'uuid/v4' ),
    onFinished = require( 'on-finished' ),
    Response   = require( 'http-response-class' ),
    logging    = [ 'development', 'dev', 'production', 'prod' ].indexOf( process.env.NODE_ENV ) !== -1;

function inspection( req, res, next ) {
    res.respond = d => {
        if( !res ) {
            return;
        }
        
        if( d instanceof Response ) {
            const data = d.toString();
            res.set( {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Max-Age': 1728000,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': data.length,
                RequestID: UUIDv4()
            } );
            
            res.status( d.statusCode ).send( data );
        } else {
            res.respond( new Response( 400, d ) );
        }
        
        res = null;
    };
    
    setTimeout(
        () => {
            if( res ) {
                res.respond( new Response( 408 ) );
            }
        }, timeout + ( speedStandard * req.headers[ 'content-length' ] || 0 )
    );
    
    function logRequest( e, d ) {
        return new Promise(
            () => console.log( [
                new Date().toISOString(), '|',
                'HTTP', req.httpVersion, req.method, req.path, '|',
                d.statusCode, d.statusMessage, '|',
                `In: ${req.headers[ 'content-length' ] || 0} bytes - Out: ${d._contentLength || 0} bytes`
            ].join( ' ' ) )
        );
    }
    
    if( logging ) {
        onFinished( res, logRequest );
    }
    
    if( `${req.protocol}://${req.hostname}${req.path}`.length >= maximumURISize ) {
        return res.respond( new Response( 414, 'URI exceeds maximum length' ) );
    } else if( req.rawHeaders.join( '' ).length >= maximumHeaderSize ) {
        return res.respond( new Response( 431 ) );
    } else if( req.headers[ 'content-length' ] >= maximumPayloadSize ) {
        return res.respond( new Response( 413, 'Payload exceeds maximum length' ) );
    } else if( +req.httpVersion < minimumHTTPVersion ) {
        return res.respond( new Response( 505 ) );
    }
    
    next();
}

module.exports = () => {
    return inspection;
};