var BaseRule = function() {
  this.id_prefix = 'rule-builder-rule-';
};


BaseRule.prototype = new Util.EventEmiter();


BaseRule.prototype.initialize = function( root, fields ) {
  this.root = root;
  this.is_published = false;

  // Copy over fields from the rule builder
  this.fields = fields;

};


BaseRule.prototype.remove = function() {

  this.el.remove();

  // if the root has a conjunction right at the end
  // remove it.
  // Is there a better way to do it?
  this.root.children( '.rule-builder-conjunction:last-child' ).remove();

  // Emit the event
  this.emit( 'remove' );

};


BaseRule.prototype.get_field = function( name ) {
  return ( Util.collection.filter( this.fields, function( i, v ) { return v.name ===  name; } ) )[ 0 ];
};


BaseRule.prototype.get_predicates = function() {
  return '<select name="predicate"> <option value=""> </option> <option value="NOT"> NOT </option> </select>';
};

BaseRule.next = Util.serial( { start: 1, increment: 100 } );
