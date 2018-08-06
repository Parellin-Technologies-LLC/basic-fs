/** ****************************************************************************************************
 * @file: init.js
 * @project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Jul-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig        = require( 'gonfig' ),
	lanIp         = require( './lib/lanIp' ),
	{ ensureDir } = require( 'fs-extra' );

module.exports = async () => {
	await gonfig.set( 'lanip', lanIp );
	await ensureDir( gonfig.get( 'dataDir' ) );
};
