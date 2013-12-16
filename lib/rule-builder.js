
// There you go
var RuleBuilder = function( el, options ) {

  this.el = $( el );
  this.id_prefix = 'rule-builder-';
  this.rules = [ ];
  this.fields = [ ];

  // These classes seem unnecessary
  this.root_class = 'rule-builder-root';
  this.title_class = 'rule-builder-title';
  this.header_class = 'rule-builder-header';
  this.body_class = 'rule-builder-body';
  this.add_nesting_class = 'rule-builder-add-nesting';
  this.add_button_class = 'rule-builder-add';
  this.rule_class = 'rule-builder-rule';
  this.conjunction_class = 'rule-builder-conjunction';

  this._title = 'The Rule Builder';

  if( options.fields ) {
    this.process_fields( options.fields );
  } else {
    this.free_text = true;
  }

  // initialize
  this.initialize();

};

RuleBuilder.next = Util.serial( { start: 100, increment: 100 } );

// The prototype
RuleBuilder.prototype = {

  process_fields: function( fields ) {
    var that = this;

    Util.collection.each( fields, function( index, field ) {
      // Pass in any other options there are 
      that.fields.push( new type_mapping[ field.type ]( field.name, field.type, field ) );
    } );

  },

  initialize: function() {
    // the root div from where we'll operate 
    this.generate_id();
    this.setup_structure();
    this.publish_title(); 

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

  get_conjunction_options: function() {
    return '<select name="conjunction"> <option value="AND"> AND </option> <option value="OR"> OR </option> </select>';
  },

  add_conjunction: function( e ) {

    var structure = '<div class="' + this.conjunction_class + '">' +
      this.get_conjunction_options() +
    '</div>';

    this.body().append( structure );
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

    // A new rule
    var rule = new Rule( this.body(), this.fields ); 

    // push into rules
    this.rules.push( rule );

    var that = this;
    rule.on( 'remove', function( rule ) {

      console.log( that.rules );

      // Remove the rules from our list
      that.rules.splice( that.rules.indexOf( rule ), 1 );

    } );

    // Publish rule
    rule.publish();

  },

  handle_click: function( e ) {
    // Do all click need these?
    e.preventDefault();
    e.stopPropagation();

    var target = $( e.target );
    
    // Global Add button
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
    this.id = this.id_prefix + String( RuleBuilder.next() ); 
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

    $.fn.rulebuilder = function( options ) {

      this.each( function( index, el ) {

        // Should accept options
        var rule_builder = new RuleBuilder( el, options );

        // Save the object with the element
        $.data( el, 'rule-builder', rule_builder );

      } );

    };

  }

)( jQuery );
