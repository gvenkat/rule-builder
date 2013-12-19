

var RuleBuilder = function( el, options ) {

  // DOM element where rule builder will be placed
  this.el = $( el );

  // Prefix for any generated rule builder ids
  // Util.next should generate a closure which 
  // generate incrementing integers
  this.id_prefix = 'rule-builder-';


  // All the rule objects we're currently managing
  this.rules = [ ];


  // Fields which were configured
  this.fields = [ ];


  // use configured title or default title
  // FIXME: Does the default title need to be something else?
  this._title = options.title || 'The Rule Builder';


  // Generate field objects
  this.process_fields( options.fields );


  // initialize
  this.initialize();

};



// Generate incrementing integers for several
// instances of rule builders in the same document
RuleBuilder.next = Util.serial( { start: 100, increment: 100 } );


// We're also an event emiter
// FIXME: No idea what events to assign yet
RuleBuilder.prototype = new Util.EventEmiter();


Util.extend( RuleBuilder, {


  // Initialize DOM element, setup basic structure
  initialize: function() {
    this.generate_id();
    this.setup_structure();
    this.publish_title(); 
  },


  // Given configuration of set of fields, their types and configuration
  // related to types, we create field objects that encapsulate these fields
  // these fields will then be passed to rule objects to deal with
  process_fields: function( fields ) {
    var that = this;

    this.fields = Util.collection.map( fields, function( index, field ) {
      return new type_mapping[ field.type ]( field.name, field.type, field );
    });

  },

  // Publish title, by default will use _title instance variable
  // to publish title, if passed an argument, will set the instance 
  // variable and publish the title
  // FIXME: Contemplate whether this is too messy?
  title: function( title ) {
    if( ! title ) {
      return this._title;
    }

    else {
      this._title = title;
      this.publish_title();
    }
  },


  setup_structure: function() {
    this.publish_root();

    var structure = '<div class="' + classes.header + '">' +
      '<div class="' + this.title_class + '">' +
      '</div>' +
      '<div class="rule-builder-root-add ' + classes.add_nesting +'">' +  
        this.add_button() +
      '</div>' +
    '</div>' +
    '<div class="' + classes.body + '"> </div>';

    this.root.append( structure );

    ( this.menu = $( '#' + this.id + '-menu' ) ).menu().hide()

    this.setup_events();

  },

  publish_title: function() {
    this.root.find( '.' + classes.title ).append( this._title );
  },

  generate_id: function() {
    this.id = this.id_prefix + String( RuleBuilder.next() ); 
  },


  publish_root: function() {
    this.el.html( Util.dom.div_with_attributes( { class: classes.root , id: this.id } ) ); 
    this.detect_root();
  },

  detect_root: function() {
    this.root = this.el.find( '#' + this.id );
  }


} );







// *** ALL METHODS BELOW THIS MUST MOVE SOMEWHERE ELSE OR MUST BE WRITTEN IN SOME OTHER WAY ***

// FIXME: This needs to move away, the root body must be 
// a special case of rule set, take it from there
Util.extend( RuleBuilder, {

  is_root_add_button: function( e ) {
    return $( e.target ).parent( 'div.rule-builder-root-add' ).length > 0;
  },

  root_rules: function() {
    return this.body().children( '.' + classes.rule );
  },

  get_conjunction_options: function() {
    return '<select name="conjunction"> <option value="AND"> AND </option> <option value="OR"> OR </option> </select>';
  },

  add_conjunction: function( e ) {

    var structure = '<div class="' + classes.conjunction + '">' +
      this.get_conjunction_options() +
    '</div>';

    this.body().append( structure );
  },


  body: function() {
    return this.root.find( '.' + classes.body );
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
    if( target.hasClass( classes.add_button ) ) {
      if( this.menu.is( ':hidden' ) ) {
        this.menu.show().css( { left: e.pageX, top: e.pageY + 5 } ); 
      } else {
        this.menu.hide();
      }
    } 

    else if( target.hasClass( 'add-rule-set' ) ) {
      this.menu.hide();
      this.add_rule_box( e );
    }

    else if( target.hasClass( 'add-rule' ) ) {
      this.menu.hide();
    }

  },

  is_first_rule: function( e ) {
    return ( this.is_root_add_button( e ) && this.root_rules().length == 0 );
  },


  setup_events: function() {
    var that = this;

    this.root.click( function( e ) {
      that.handle_click( e );
    } );
  },


  add_button: function() {
    var a = Util.dom.tag( 'a', '+', { class: classes.add_button, href: '#' } );
    var menu = "<ul class='rule-builder-menu' id='" + this.id + "-menu'>" + 
      "<li> <a href='#' class='add-rule-set'> Rule Set </a> </li>" +
      "<li> <a href='#' class='add-rule'> Rule </a> </li>" +
    "</ul>";

    return a + menu;

  },


} );


// FIXME: This needs to move somewhere else
// FIXME: The rule builder needs to intantiated correctly
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
