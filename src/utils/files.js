import { $, log } from './dom.js'
import { found } from '../search.js'
export const fileServer = {
	get : async function (INFO, CALLBACK) {
		const TYPE = INFO.type || 'text'
		return await fetch(INFO.url)
		 .then(RES => TYPE == 'json' ? RES.json() : RES.text())
		 .then(DATA => CALLBACK(DATA))
		 .catch(ERROR => log(ERROR))
	},

	write : (MESSAGE = '') => {
		$("#myUL").innerHTML = MESSAGE
	},

	format : (OPCODES) => {
		OPCODES.innerHTML =
		OPCODES.innerHTML
		.replace(/^(.+)/gim, '<li style><pre>$1</pre></li>')
	},

	clear : () => {
		fileServer.write()
		$('#myInput').value = ''
		found(0)
	}
}