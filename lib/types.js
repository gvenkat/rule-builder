
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
  'equals', 'not equals', 'contains', 'does not contain'
];


var EnumType = function( name ) {
};


var DateRangeType = function() {
};


var NumberType = function() {
};





// setup mappings
var type_mapping = {
  'string': StringType,
  'number': NumberType,
  'enum': EnumType,
  'daterange': DateRangeType
};

