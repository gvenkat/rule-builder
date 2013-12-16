
var StringType = function( name ) {
  this.name = name;
};

StringType.prototype.operators = [
  '=', 'contains', 'any'
];

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

