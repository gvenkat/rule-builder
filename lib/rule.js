

var RuleSet = function( root, fields ) {
  this.initialize( root, fields );
  this.rules = [ ];
};


RuleSet.prototype = new BaseRule();

var Rule = function( root, fields ) {
  this.initialize( root, fields );
};

// Let every body use the same next
RuleSet.next = Rule.next = BaseRule.next;

Rule.prototype = new BaseRule(); 

Rule.prototype.rule_field = function() {
  var fields = this.fields;

  var select = '<select>' + 
    '<option value=""> -select- </option>' +
    Util.collection.map( this.fields, function( index, item ) {
      return '<option value="' + item.name + '">' + ( item.label || item.name ) + '</option>';
    } ).join( '' ) +
  '</select>';


  // Publish the entire set
  return '<div class="rule-option-container">' + 
    '<div class="rule-field">' + select + '</div>' +
    '<div class="rule-operator"> </div>' + 
    '<div class="rule-operands"> </div>' + 
  '</div>';

};



Rule.prototype.operand = function( e ) {
  var op = $( e.that );
  var field_name = op.attr( 'name' );
  var field = this.get_field( field_name );

  this.el.find( '.rule-operands').html( field.operand_for( op.val() ) );
};


Rule.prototype.handle_field_change = function( e ) {

  // The actual select box
  var select = $( e.that );

  // Field name
  var field_name = select.val();

  // Get field
  var field = this.get_field( field_name );

  if( ! field ) throw " No field found ";

  // Get the operators
  var operators = field.operators;

  // Publish operators
  var _rule_op = this.el
    .find( '.rule-operator')

  _rule_op.html( Util.dom.to_select( operators, { name: field_name } ) );

  var that = this;
  // Handle operator pick
  _rule_op.find( 'select' ).change( function( e ) {
    e.that = this;

    // Right method name??
    that.operand( e );

  });

};


Rule.prototype.publish = function() {

  if( this.is_published ) return false;

  this.id = this.id_prefix + Rule.next();

  var structure = '<div class="rule-builder-rule" id="' + this.id + '">' +
    '<div class="rule-builder-predicate">' +
      this.get_predicates() +
    '</div>' +
    '<div class="rule-builder-rule-option"> ' +
      this.rule_field() +
    '</div>' +
    '<div class="rule-builder-remove">' +
      Util.dom.tag( 'a', '-', { href: '#', class: 'rule-remove-button' } );
    '</div>' +
  '</div>';

  this.root.append( structure );


  this.is_published = true;

  this.el = $( '#' + this.id );

  var that = this;

  // Handle field type change
  this.el.find( '.rule-field select' ).change( 
    function( e ) {
      e.that = this;
      that.handle_field_change( e );
    }
  );

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



