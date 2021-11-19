import { $, css, keyPressed, log } from './utils/dom.js'
import { load, start }  from './search.js'
import { fileServer }  from './utils/files.js'

export const settings = () => {
	const ITEMS = [
		[
			'settings-limit-h', 'text', 'ground', 'opcode', 'operator',
			'number', 'string', 'variable', 'comment', 'label'
		], 
		[
			['size', 'ground', 'size'],
			['nav', 'bars', 'list', 'scroll']
		]
	]

	const display = (ELEMENT, MODE) => 
		css([$('#' + ELEMENT), JSON.parse(`{"display": "${MODE}"}`)])

	const modal = {
		hide : () => display('modal', 'none'),
		show : () => display('modal', 'grid')
	}

	const save = {
		show : () => display('modal-save', 'initial'),
		hide : () => display('modal-save', 'none')
	}

	const _ = localStorage
	const _get = KEY => _.getItem(KEY)
	const _set = (KEY, VALUE) => _.setItem(KEY, VALUE)

	const VK_ENTER = 13
	$('#myInput').onkeydown = () => {
		keyPressed($('#myInput'), VK_ENTER, () => {
			start()
			location.hash = $('#myInput').value
		})
	}

	$('#file-load').onclick = () => load()
	$('#file-clear').onclick = () => fileServer.clear($('#myInput'))

	$('#pref-settings').onclick = () => modal.show()
	$('#modal-close').onclick = () => modal.hide()
	$('#modal-save').onclick = () => {
		//get set
		ITEMS[0].forEach(KEY => {
			const ELEMENT = $('#' + KEY).value
			if(_get(KEY) != ELEMENT){
				_set(KEY, ELEMENT)
			}
		})

		save.hide()
		start()
	}
	$('#reverse').onclick = () => {
		const ELEMENT = $('#list')

		if ($('#reverse').checked) {
			css([ELEMENT, {"flex-direction" : 'column-reverse'}])
			ELEMENT.scrollTop = ELEMENT.scrollHeight * -1
		} else {
			css([ELEMENT, {"flex-direction" : 'column'}])
		}
	}

	ITEMS[0].forEach((ELEMENT, index) => {
		$('#' + ELEMENT).oninput = () => {
			save.show()

			if(index > 0) {
				$(':root').style.setProperty('--op-' + ELEMENT, $('#' + ELEMENT).value)
			}
		}
	})

	onload = () => {
		save.hide()

		ITEMS[0].forEach((ELEMENT, index) => {
			if(index > 0) {
				const SAVED =
					_get(ELEMENT)
					|| css([$(':root'), '--op-' + ELEMENT])

				$('#' + ELEMENT).value = SAVED
					
				$(':root').style.setProperty('--op-' + ELEMENT, $('#' + ELEMENT).value)
			}

		})
		$('#' + ITEMS[0][0]).value = _get(ITEMS[0][0]) || 50

		const _h = location.hash
		if (_h) {
			$('#myInput').value = _h.replace('#', '')
			start()
		}
	}
}