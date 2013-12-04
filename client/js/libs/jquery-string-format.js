/*
 The MIT License

 Copyright (c) 2002, 2009 Michael D. Hall (aka just3ws)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/*

 var result = $.Format("Hello, {0}.", "world");
 //result -> "Hello, world."

 */

jQuery.format = function jQuery_dotnet_string_format(text) {
	//check if there are two arguments in the arguments list
	if (arguments.length <= 1) {
		//if there are not 2 or more arguments there's nothing to replace
		//just return the text
		return text;
	}
	//decrement to move to the second argument in the array
	var tokenCount = arguments.length - 2;
	for (var token = 0; token <= tokenCount; ++token) {
		//iterate through the tokens and replace their placeholders from the text in order
		text = text.replace(new RegExp("\\{" + token + "\\}", "gi"), arguments[token + 1]);
	}
	return text;
};
jQuery.string = {
	format: function(text) {
		//check if there are two arguments in the arguments list
		if (arguments.length <= 1) {
			//if there are not 2 or more arguments there's nothing to replace
			//just return the text
			return text;
		}
		//decrement to move to the second argument in the array
		var tokenCount = arguments.length - 2;
		for (var token = 0; token <= tokenCount; ++token) {
			//iterate through the tokens and replace their placeholders from the text in order
			var reg = new RegExp("\\{" + token + "\\}", "gi");
			var value = arguments[token + 1];
			text = text.replace(reg, value);

		}
		return text;
	}
};