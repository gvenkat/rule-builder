use strict;
use IO::File;
use Carp qw/croak/;
use File::Basename qw/
  dirname
  basename
/;

# Takes 'n' arguments 
#
# Last argument is the tests to be run. Rest are prerequisites.
# Includes QUnit dependencies in the generated HTML file.

my ( @dependencies, $tests, $html, $output_file, $ofh );

# No arguments?
croak "No arguments given. Requires atleast one" if @ARGV == 0;

# test file
croak "No file $tests file exists" unless -e ( $tests = pop @ARGV );


for my $argument ( @ARGV ) {
  croak "Dependency file: $argument does not exist. Can't proceed" 
    unless -e $argument;

  push @dependencies, $argument;
}

$output_file = basename( $tests, '.js' ) . '.html';
$ofh = IO::File->new( $output_file, 'w' );
$html = qq{ 
<!DOCTYPE html>
<html>
  <head>
    <title> Tests: $output_file </title>
    <link rel='stylesheet' href='assets/css/qunit.css' />
  </head>
  <body>
    <div id='qunit'></div>
    <div id='qunit-fixture'></div>

    <script src='assets/js/qunit.js'> </script>
    <!-- Dependencies -->
    @{[

      map {
        "<script src='$_'> </script>"
      } @dependencies

    ]}

    <script src='$tests'> </script>

  </body>
</html>
};

$ofh->print( $html );
$ofh->close;

print "Wrote $output_file \n";
