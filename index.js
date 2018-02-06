/** ****************************************************************************************************
 * File: index.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 08-Jan-2018
 *******************************************************************************************************/
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require( './server' )()
    .initialize()
    .then( inst => inst.start() );
