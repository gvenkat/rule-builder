if( ! Util ) var Util = { };

// use a better checker
Util.is_array = function( item ) {
  return typeof item == 'property' && item.hasOwnProperty( 'length' );
};

Util.serial = function( options ) {

  var start = options.start || 1;
  var increment_by = options.increment || 1;

  var started = false;
  return function() {
    if( ! started ) {
      started = true;
      return start;
    } else {
      start += increment_by;
      return start;
    }
  };
};


Util.EventEmiter = function() {
  this.events = { };
};


Util.EventEmiter.prototype.on = function( ev, callback ) {

  if( typeof callback != 'function' ) 
    throw "Needs a valid callback";

  if( ! this.events[ ev ] ) {
    this.events[ ev ] = [ ];
  }

  this.events[ ev ].push( callback );

};


Util.EventEmiter.prototype.emit = Util.EventEmiter.prototype.trigger = function( ev ) {
  Util.collection.each( this.events[ ev ], function( index, cb ) {
    cb.call( null, this );
  } );
};


Util.collection = {

  each_from_array: function( array, callback, context ) {
    for( var i=0; i < array.length; i++ ) {
      callback.apply( context, [ i, array[ i ] ] );
    }
  },

  each_from_object: function( object, callback, context ) {
    for( var i in object ) {
      if( object.hasOwnProperty( i ) ) {
        callback.apply( context, [ i, object[ i ] ] );
      }
    }
  },

  each: function( object, callback, context ) {

    if( typeof callback != 'function' ) {
      throw "Invalid callback provided for collection.each";
    }

    if( ! context ) context = object;

    if( Util.is_array( object ) ) {
      Util.collection.each_from_array( object, callback, context );
    } else {
      Util.collection.each_from_object( object, callback, context );
    }
  },

  grep: function() {
  },

  filter: function( items, callback ) {

    if( typeof callback != 'function' ) {
      throw "Needs a callback";
    }

    var _items = [ ];

    Util.collection.each( items, function( idx, item ) {

      console.log( item.name );
      console.log( callback( idx, item ) );

      if( callback( idx, item ) ) {
        _items.push( item );
      }
    });

    return _items;
  },

  map: function( items, callback ) {

    if( typeof callback != 'function' ) {
      throw "Needs a callback";
    }

    var _items = [ ];

    Util.collection.each( items, function( idx, item ) {
      _items.push( callback( idx, item ) );
    } );

    return _items;

  }

};


Util.dom = {

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
  },

  // Attributes???
  to_select: function( items ) {
    return '<select>' + 
      '<option value="">' + '-operation-' + '</option>' +
      Util.collection.map( items, function( idx, item ) {
        return '<option value="' + item  + '">' + item + '</option>';
      }) +
    '</select>';
  }

};
