/** 
# RULES
=
| They should all start with a capital letter, except for the objects.
| The constants of a value or enumeration must be in uppercase.
| Only objects must end with a semicolon at the end of the braces.
| Exceeding 90 characters per line is not allowed, except for templates.
| Always leave spaces between the operators and their values.
*/

let $ = Element => Element[0] == '#'
		? document.querySelector(Element)
		: document.querySelectorAll(Element),
	_ = Message => console.log(Message);

let file = {
	get : async function (Type, Url , Callback) {
		return await fetch(Url)
					 .then(Res => Res == 'json' ? Res.json() : Res.text())
					 .then(Data => Callback(Data))
					 .catch(Error => _(Error))
	},
	write : (Message = '') => {
		$("#myUL").innerHTML = Message
	},
	format : (Opcodes = $('ul')[0]) => {
		Opcodes.innerHTML =
		Opcodes.innerHTML.replace(/^(.+)/gim, '<li style><pre>$1</pre></li>')
	},
	clear : () => {
		file.write()
		found(0)
	}
};

function found(Counter = $('li[style=""]').length) {
	$('#found').innerHTML = Counter
}

function carga (FileList = 'sa.txt'){
	file.get('text', 'opcodes/' + FileList, Data => {
		file.write(Data)
		file.format()
		found()
		iniciar()
	})
}

function keyPressed(VirtualKey, Callback) {
	window.onkeydown = (event) => {
		if (event.keyCode === VirtualKey){
			Callback();
		}
	}
}

function iniciar(){
	let Filter = $('#myInput').value.toUpperCase().replaceAll(' ', '_'),
		Elements = $('#myUL').querySelectorAll('li');

	if (Elements.length == 0 && Filter != '') carga() ;

	Elements.forEach(Selected => {
		let Element = Selected.getElementsByTagName('pre')[0],
			txtValue = Element.textContent || Element.innerText;

		if (txtValue.toUpperCase().indexOf(Filter) > -1) {
			Selected.style.display = '';
		}else {
			Selected.style.display = 'none';
		}
	})

	if ($('li[style=""]').length < 50) sanny() ;
	found();
}

function sanny() {
	let Elements = $("li[style=''] pre")

	Elements.forEach(Select => {
		Select.innerHTML =
		Select.innerHTML
		/*** COMMENTS ***/
		.replace(/(\/\/.+)/gm, `<hlC>$1</hlC>`)
		.replace(/(\/\*[\x09-.0-■]*\*\/)/gmi, `<hlC>$1</hlC>`)
		.replace(/(\{[\x09-z\|~-■]*\})/gmi, `<hlC>$1</hlC>`)
		/*** STRINGS ***/
		.replace(/\"([\x09-\!#-■]*)\"/gmi, `<hlS>\"$1\"<\/hlS>`)
		.replace(/\'([!-&(-■]+)\'/gmi, `<hlS>\'$1\'<\/hlS>`)
		/*** LABELS ***/
		.replace(/(\s+\@+\w+|\:+\w+)/gm, `<hlL>$1<\/hlL>`)
		/*** GOSUBS ***/
		.replace(/(\s[A-Za-z0-9_]+\(\))/gm, `<hlM>$1<\/hlM>`)
		/*** ARRAYS ***/
		.replace(/(\[)([\d+]*)(\])/gmi, `$1<hlN>$2<\/hlN>$3`)
		/*** OPCODES ***/
		.replace(/^(\s*)([a-fA-F0-9]{4}\:)/gmi, `$1<hlF>$2<\/hlF>`)
		/*** HEXALES ***/
		.replace(/\b(\d+)(x|\.)(\w+)\b/gmi, `<hlN>$1$2$3<\/hlN>`)
		/*** BOOLEANS ***/
		.replace(/\b(true|false)\b/gmi, `<hlN>$1<\/hlN>`)
		/*** NUMBERS ***/
		.replace(/(\s|\-|\,|\()(?!\$)(\d+)(?!\:|\@)(i|f|s|v)?\b/gmi, `$1<hlN>$2$3<\/hlN>`)
		/*** MODELS ***/
		.replace(/(\#+\w+)/gm, `<hlN>$1<\/hlN>`)
		/*** CLASSES ***/
		.replace(/(Actor|Animation|Attractor|Audio|AudioStream|Blip|Boat|Button|Camera|Car|CarGenerator|CardDecks|Checkpoint|Clock|Component|Credits|Cutscene|Debugger|DecisionMaker|DecisionMakerActor|DecisionMakerGroup|DynamicLibrary|File|Fs|Fx|Game|Gang|Garage|Group|Heli|Hid|ImGui|IniFile|Input|Interior|Key|Marker|Math|Memory|Menu|Model|Mouse|Multiplayer|List|Object|ObjectGroup|Particle|Path|Pickup|Plane|Player|Rampage|Rc|Render|Restart|Screen|ScriptEvent|ScriptFire|Searchlight|Sequence|Shopping|Skip|Sound|Soundtrack|SpecialActor|Sphere|Sprite|Stat|StreamedScript|Streaming|String|StuckCarCheck|Task|Text|Texture|Trailer|Train|Txd|WeaponInfo|Weather|Widget|World|Zone)(\.)(\w+)/gmi, `<hlX>$1<\/hlX>$2<hlM>$3</hlM>`)
		/*** METHODS ***/
		.replace(/(\$\w+|\d+\@)\.([0-9A-Z_a-z]+)/gm, `$1.<hlM>$2</hlM>`)
		/*** DIRECTIVES ***/
		.replace(/(\{\$)(CLEO|OPCODE|NOSOURCE)(\s\w+\}|\})/gmi, `<hlV>$1$2$3<\/hlV>`)
		.replace(/\b(timera|timerb)\b/gmi, `<hlV>$1<\/hlV>`)
		/*** VARIABLES ***/
		.replace(/(\d+)(\@s|\@v|\@)(\:|\s|\n|\]|\.|\,||\))/gm, `<hlV>$1$2<\/hlV>$3`)
		.replace(/(\&amp\d+)/gim, `<hlV>$1<\/hlV>`)
		.replace(/(s|v)?(\$[0-9A-Z_a-z]+)/gm, `<hlG>$1$2<\/hlG>`)
		/*** KEYWORDS ***/
		.replace(/\b(longstring|shortstring|integer|jump_if_false|thread|create_thread|create_custom_thread|end_thread|name_thread|end_thread_named|if|then|else|hex|end|else_jump|jump|jf|print|const|while|not|wait|repeat|until|break|continue|for|gosub|var|array|of|and|or|to|downto|step|call|return_true|return_false|return|ret|rf|tr|Inc|Dec|Mul|Div|Alloc|Sqr|Random|int|string|float|bool|fade|DEFINE|select_interior|set_weather|set_wb_check_to|nop)\b/gmi, `<b>$1<\/b>`)
		/*** OPERADORS ***/
		.replace(/\s(\+|\-|\*|\/|\^|\%|\||\&lt;|\&gt;|\&lt;\&lt;|\&gt;\&gt;|=)?(=|~|\*|\&lt;|\&gt;)\s/gmi," <hlO>$1$2<\/hlO> ")
	})
}