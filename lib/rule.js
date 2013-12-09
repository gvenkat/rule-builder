var Rule = function( root ) {
  this.root = root;
  this.id_prefix = 'rule-builder-rule-';
  this.is_published = false;
};

Rule.next = Util.serial( 1, 100 );


// rule manages and emits events
Rule.prototype = new Util.EventEmiter();

Rule.prototype.remove = function() {

  this.el.remove();

  // if the root has a conjunction right at the end
  // remove it.
  // Is there a better way to do it?
  this.root.children( '.rule-builder-conjunction:last-child' ).remove();


  // Emit the event
  this.emit( 'remove' );

};


Rule.prototype.publish = function() {

  if( this.is_published ) return false;

  this.id = this.id_prefix + Rule.next();

  var structure = '<div class="rule-builder-rule" id="' + this.id + '">' +
    '<div class="rule-builder-predicate">' +
      this.get_predicates() +
    '</div>' +
    '<div class="rule-builder-rule-option"> </div>' +
    '<div class="rule-builder-remove">' +
      Util.dom.tag( 'a', '-', { href: '#', class: 'rule-remove-button' } );
    '</div>' +
  '</div>';

  this.root.append( structure );

  this.is_published = true;

  this.el = $( '#' + this.id );

  this.setup_events();

};


Rule.prototype.setup_events = function() {
  var that = this;
  this.el.find( '.rule-remove-button' ).unbind( 'click' ).bind( 'click', function( e ) {

    // Don't propagate the event
    e.stopPropagation();

    that.remove();
    return false;
  } );
};

Rule.prototype.get_predicates = function() {
  return '<select name="predicate"> <option value=""> </option> <option value="NOT"> NOT </option> </select>';
};




