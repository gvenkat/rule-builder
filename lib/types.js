
var FieldType = function() {
};

FieldType.prototype.operand_for = function() {
  return Util.dom.text_field();
};


var StringType = function( name ) {
  this.name = name;
};

StringType.prototype = new FieldType();

StringType.prototype.operators = [
  '=', 'contains', 'any'
];


/*
// Must have default implementation
StringType.prototype.operand_for = function( operator ) {

  if( ! Util.collection.include( this.operators, operator ) ) {
    throw " Operator not supported "; 
  }

  // Do something more useful here

};
*/

// Rename?
StringType.prototype.publish_right_side = function( el ) {
};


var DateRangeType = function() {
};


var NumberType = function() {
};

var EnumType = function() {
};





// setup mappings
var type_mapping = {
  'string': StringType,
  'number': NumberType,
  'enum': EnumType,
  'daterange': DateRangeType
};

