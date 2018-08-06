/** ****************************************************************************************************
 * File: statusBar.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

function show( opts, text, time = 3000 ) {
	const
		alert     = $( '#alert' ),
		isShowing = alert.has( 'a' ).length,
		a         = $( '<a>' ).attr( { class: opts, role: 'alert' } );
	
	if( text instanceof Error ) {
		text = text.message || text.data || text;
	} else if( text.hasOwnProperty( 'code' ) && text.hasOwnProperty( 'message' ) ) {
		text = text.message || text.data || text;
	}
	
	if( isShowing ) {
		alert.html( '' );
	}
	
	a.css( { 'z-index': 1000, 'font-size': '16px' } );
	a.text( text );
	alert.append( a );
	
	setTimeout( () => a.alert( 'close' ), time );
}

export function showSuccess( text, time = 3000 ) {
	show( 'alert alert-success show fade', text, time );
}

export function showInfo( text, time = 3000 ) {
	show( 'alert alert-info show fade', text, time );
}

export function showWarning( text, time = 3000 ) {
	show( 'alert alert-warning show fade', text, time );
}

export function showAlert( text, time = 3000 ) {
	show( 'alert alert-danger show fade', text, time );
}

export default { showSuccess, showInfo, showWarning, showAlert };
