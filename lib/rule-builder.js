
// There you go
var RuleBuilder = function( el ) {
  this.el = $( el );
};




(

  function( $ ) {

    $.fn.rulebuilder = function() {

      this.each( function( index, el ) {

        // Should accept options
        var rule_builder = new RuleBuilder();


        // Save the object with the element
        $.data( el, 'rule-builder', rule_builder );


      } );

    };

  }

)( jQuery );
