
var EventEmiter = function() {
  this.events = { };
};

EventEmiter.prototype.on = function( ev, callback ) {

  if( typeof callback != 'function' ) 
    throw "Needs a valid callback";

  if( ! this.events[ ev ] ) {
    this.events[ ev ] = [ ];
  }

  this.events[ ev ].push( callback );

};

EventEmiter.prototype.emit = EventEmiter.prototype.trigger = function( ev ) {
  Util.collection.each( this.events[ ev ], function( index, cb ) {
    cb.call( null, this );
  } );
};



var Rule = function( root ) {
  this.root = root;
  this.id_prefix = 'rule-builder-rule-';
  this.is_published = false;
};

Rule.next = Util.serial( 1, 100 );


// rule manages and emits events
Rule.prototype = new EventEmiter();

Rule.prototype.remove = function() {

  this.el.remove();

  // if the root has a conjunction right at the end
  // remove it.
  // Is there a better way to do it?
  this.root.children( '.rule-builder-conjunction:last-child' ).remove();


  // Emit the event
  this.emit( 'remove' );

};


Rule.prototype.publish = function() {

  if( this.is_published ) return false;

  this.id = this.id_prefix + Rule.next();

  var structure = '<div class="rule-builder-rule" id="' + this.id + '">' +
    '<div class="rule-builder-predicate">' +
      this.get_predicates() +
    '</div>' +
    '<div class="rule-builder-rule-option"> </div>' +
    '<div class="rule-builder-remove">' +
      Util.dom.tag( 'a', '-', { href: '#', class: 'rule-remove-button' } );
    '</div>' +
  '</div>';

  this.root.append( structure );

  this.is_published = true;

  this.el = $( '#' + this.id );

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

Rule.prototype.get_predicates = function() {
  return '<select name="predicate"> <option value=""> </option> <option value="NOT"> NOT </option> </select>';
};





// There you go
var RuleBuilder = function( el, options ) {

  this.el = $( el );
  this.id_prefix = 'rule-builder-';
  this.rules = [ ];

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

  // initialize
  this.initialize();

};

RuleBuilder.next = Util.serial( 100, 100 );

// The prototype
RuleBuilder.prototype = {

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
    var rule = new Rule( this.body() ); 

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
        var rule_builder = new RuleBuilder( el );

        // Save the object with the element
        $.data( el, 'rule-builder', rule_builder );


      } );

    };

  }

)( jQuery );
