
var Util = {

  collection: {
    each: function( object, callback ) {

      if( typeof callback != 'function' ) {
        throw "Invalid callback provided for collection.each";
      }

      for( var i in object ) {
        if( object.hasOwnProperty( i ) ) {
          callback( i, object[ i ] );
        }
      }
    }
  },

  dom: { 

    div_with_attributes: function( attributes ) {
      return this.tag( 'div', '', attributes );
    },

    tag: function( tag_name, html_content, attributes ) {
      return '<' + tag_name + ' ' + this.to_attributes( attributes || { } ) + '>' + html_content + '</' + tag_name + '>';
    },


    div: function() {
      this.div_with_attributes( { } );
    },

    to_attributes: function( attributes ) {
      var attr = [ ];

      Util.collection.each( attributes, function( key, value ) {
        attr.push( key + '="' + value + '"' ); 
      } );

      return attr.join( " " );
    }

  }

};

// There you go
var RuleBuilder = function( el ) {

  this.el = $( el );

  this.root_class = 'rule-builder-root';
  this.title_class = 'rule-builder-title';
  this.header_class = 'rule-builder-header';
  this.body_class = 'rule-builder-body';
  this.add_nesting_class = 'rule-builder-add-nesting';
  this.add_button_class = 'rule-builder-add';
  this.rule_class = 'rule-builder-rule';

  this._title = 'The Rule Builder';
  this.id_prefix = 'rule-builder-';

  // initialize
  this.initialize();

};

// Class methods
RuleBuilder.last_id = 1;

RuleBuilder.next_id = function() {
  return ( RuleBuilder.last_id += 100 );
}


// The prototype
RuleBuilder.prototype = {

  initialize: function() {

    // the root div from where we'll operate 
    this.generate_id();
    this.setup_structure();

    // ???
    this.publish_title(); 

    // setup events

  },

  title: function( title ) {

    if( ! title ) {
      return this._title;
    }

    else {
      this._title = title;
      this.publish_title();
    }
  },

  is_root_add_button: function( e ) {
    return $( e.target ).parent( 'div.rule-builder-root-add' ).length > 0;
  },

  root_rules: function() {
    return this.body().children( '.' + this.rule_class );
  },

  add_conjunction: function( e ) {
  },

  is_first_rule: function( e ) {
    return ( this.is_root_add_button( e ) && this.root_rules().length == 0 );
  },

  body: function() {
    return this.root.find( '.' + this.body_class );
  },

  add_rule_box: function( e ) {

    if( ! this.is_first_rule( e ) ) {
      this.add_conjunction( e );
    }

    var structure = '<div class="' + this.rule_class + '"> </div>';

    this.body().append( structure );


  },

  handle_click: function( e ) {

    // Do all click need these?
    e.preventDefault();
    e.stopPropagation();

    var target = $( e.target );
    
    if( target.hasClass( this.add_button_class ) ) {
      this.add_rule_box( e );
    }



  },

  setup_events: function() {
    var that = this;

    this.root.click( function( e ) {
      that.handle_click( e );
    } );

  },

  setup_structure: function() {
    this.publish_root();

    var structure = '<div class="' + this.header_class + '">' +
      '<div class="' + this.title_class + '">' +
      '</div>' +
      '<div class="rule-builder-root-add ' + this.add_nesting_class +'">' +  
        this.add_button() +
      '</div>' +
    '</div>' +
    '<div class="' + this.body_class + '"> </div>';

    this.root.append( structure );

    this.setup_events();

  },

  add_button: function() {
    return Util.dom.tag( 'a', '+', { class: this.add_button_class, href: '#' } );
  },
  

  publish_title: function() {
    this.root.find( '.' + this.title_class ).append( this._title );
  },


  generate_id: function() {
    this.id = this.id_prefix + String( RuleBuilder.next_id() ); 
  },


  publish_root: function() {
    this.el.html( Util.dom.div_with_attributes( { class: this.root_class, id: this.id } ) ); 
    this.detect_root();
  },


  detect_root: function() {
    this.root = this.el.find( '#' + this.id );
  }

};


(

  function( $ ) {

    $.fn.rulebuilder = function() {

      this.each( function( index, el ) {

        // Should accept options
        var rule_builder = new RuleBuilder( el );

        // Save the object with the element
        $.data( el, 'rule-builder', rule_builder );


      } );

    };

  }

)( jQuery );
