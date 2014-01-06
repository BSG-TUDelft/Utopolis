/**
 * Created with JetBrains WebStorm.
 * User: wouter
 * Date: 5-1-14
 * Time: 18:35
 * To change this template use File | Settings | File Templates.
 */
var CraftingScreen = function(parent, data, config){
	// Call parent constructor
	Popup.prototype.constructor.call(this, parent, config);

	this.el.append( '' +
		'<div class="craftingscreen"> ' +
			'<h1>Crafting</h1>' +
			'<table cellpadding="0" border="0" class="craftingscreen_table">' +
		'<tr>' +
			'<td class="create_product product_bread">bread <div>[create]</div></td>' +
			'<td class="time" title="construction time: 10 minutes">0:10</td>' +
			'<td class="workplace structureicon hele_farm" title="workplace: farm (2 workers available)">x2</td>' +
			'<td class="ingredients"><div class="product_flour">x1</div></td>' +
		'</tr>' +
		'<tr>' +
			'<td class="create_product product_flour">flour <div>[create]</div></td>' +
			'<td class="time" title="construction time: 1 minute">0:01</td>' +
			'<td class="workplace structureicon hele_farm" title="workplace: farm (2 workers available)">x2</td>' +
			'<td class="ingredients"><div class="product_barley">x1</div></td>' +
		'</tr>' +
		'<tr>' +
			'<td class="create_product product_beer">beer <div>[create]</div></td>' +
			'<td class="time" title="construction time: 5 minutes">0:05</td>' +
			'<td class="workplace structureicon hele_farm" title="workplace: farm (2 workers available)">x2</td>' +
			'<td class="ingredients"><div class="product_barley">x1</div><div class="product_hop">x1</div></td>' +
		'</tr>' +
		'<tr>' +
			'<td class="create_product product_wine">wine <div>[create]</div></td>' +
			'<td class="time" title="construction time: 12 minutes">0:12</td>' +
			'<td class="workplace structureicon hele_civic" title="workplace: civic center (6 workers available)">x6</td>' +
			'<td class="ingredients"><div class="product_grapes">x1</div><div class=""></td>' +
		'</tr>' +
		'<tr>' +
			'<td class="create_product product_vase">vase <div>[create]</div></td>' +
			'<td class="time" title="construction time: 3 hours, 20 minutes">3:20</td>' +
			'<td class="workplace structureicon hele_civic" title="workplace: civic center (6 workers available)">x6</td>' +
			'<td class="ingredients"><div class="product_clay">x2</div><div class="product_wood">x1</div></td>' +
		'</tr>' +

		'</table>' +
		'</div>' );
}

CraftingScreen.prototype = new Popup();

/** Updates data, provide data in nested array */
CraftingScreen.prototype.update = function (data) {
	// Prevent updating if not needed to improve performance. Also Chrome doesnt like it
	if (!this.isVisible()) return false;


};

CraftingScreen.prototype.show = function(){
	Popup.prototype.show.call(this);
	this.center();
};


CraftingScreen.prototype.constructor = CraftingScreen;