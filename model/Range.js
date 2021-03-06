'use strict';

var oo = require('../util/oo');

var Range = function(start, end) {
  this.start = start;
  this.end = end;
  Object.freeze(this);
};

Range.Prototype = function() {

  this.isCollapsed = function() {
    return this.start.equals(this.end);
  };

  this.equals = function(other) {
    if (this === other) return true;
    else return (this.start.equals(other.start) && this.end.equals(other.end));
  };

};

oo.initClass(Range);

module.exports = Range;
