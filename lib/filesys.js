/** ****************************************************************************************************
 * File: filesys.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 11-Jul-2017
 *******************************************************************************************************/
'use strict';

const
	{
		readFile,
		readdir,
		outputFile,
		lstat,
		ensureDir,
		pathExists,
		remove,
		emptyDir,
		move: moveFile
	} = require( 'fs-extra' );

module.exports = {
	remove,
	emptyDir,
	ensureDir,
	moveFile,
	pathExists,
	getFile: fname => new Promise(
		( res, rej ) => readFile(
			fname, ( e, d ) => e ? rej( e ) : res( d )
		)
	),
	listFiles: fpath => new Promise(
		( res, rej ) => readdir(
			fpath, ( e, d ) => e ? rej( e ) : res( d )
		)
	),
	saveFile: ( fname, data ) => new Promise(
		( res, rej ) => outputFile(
			fname, data, ( e, d ) => e ? rej( e ) : res( d )
		)
	),
	stat: fname => new Promise(
		( res, rej ) => lstat(
			fname, ( e, d ) => e ? rej( e ) : res( d )
		)
	),
	isDirectory: fname => module.exports.stat( fname ).then( d => d.isDirectory() ),
	isFile: fname => module.exports.stat( fname ).then( d => d.isFile() )
};