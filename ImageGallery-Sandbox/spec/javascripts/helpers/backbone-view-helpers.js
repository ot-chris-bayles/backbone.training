Backbone.View.prototype.changeVal = function(selector, value){
  var el = this.$(selector);
  el.val(value);
  el.trigger("change");
}

Backbone.View.prototype.clickEl = function(selector){
  var el = this.$(selector);
  el.trigger("click");
}
