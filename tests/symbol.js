// Constructor tests
test( 'Constructor', function() {
  var sym = new Symbol( 'first_name', 'First Name' );

  ok( sym instanceof Symbol );
  ok( sym.name == 'first_name' );
  ok( sym.label == 'First Name' );
  ok( Symbol.create( 'last_name', 'Last Name' ) instanceof Symbol );
} );
