'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _dec, _desc, _value, _class;

var _basenode = require('./basenode');

var _basenode2 = _interopRequireDefault(_basenode);

var _spriteUtils = require('sprite-utils');

var _spriteAnimator = require('sprite-animator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _children = (0, _symbol2.default)('children'),
    _updateSet = (0, _symbol2.default)('updateSet'),
    _zOrder = (0, _symbol2.default)('zOrder'),
    _tRecord = (0, _symbol2.default)('tRecord'),
    _timeline = (0, _symbol2.default)('timeline'),
    _render = (0, _symbol2.default)('render');

var readyState = _promise2.default.resolve();

var Layer = (_dec = (0, _spriteUtils.deprecate)('Instead use await layer.afterRender'), (_class = function (_BaseNode) {
  (0, _inherits3.default)(Layer, _BaseNode);

  function Layer() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        canvas = _ref.canvas,
        handleEvent = _ref.handleEvent,
        evaluateFPS = _ref.evaluateFPS,
        renderMode = _ref.renderMode,
        resolution = _ref.resolution;

    (0, _classCallCheck3.default)(this, Layer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Layer.__proto__ || (0, _getPrototypeOf2.default)(Layer)).call(this));

    _this.handleEvent = handleEvent !== false;
    _this.evaluateFPS = !!evaluateFPS;

    // renderMode: repaintAll | repaintDirty
    _this.renderMode = renderMode || 'repaintAll';
    _this.outputContext = canvas.getContext('2d');

    if (canvas.cloneNode) {
      var shadowCanvas = canvas.cloneNode(true);
      _this.shadowContext = shadowCanvas.getContext('2d');
    }

    _this[_children] = [];
    _this[_updateSet] = new _set2.default();
    _this[_zOrder] = 0;
    _this[_tRecord] = []; // calculate FPS
    _this[_timeline] = new _spriteAnimator.Timeline();

    _this.afterRender = readyState;
    return _this;
  }

  (0, _createClass3.default)(Layer, [{
    key: 'prepareRender',
    value: function prepareRender() {
      return this.afterRender;
    }
  }, {
    key: _render,
    value: function value() {
      if (this.afterRender === readyState) {
        var that = this,
            _dispatchEvent = (0, _get3.default)(Layer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Layer.prototype), 'dispatchEvent', this);

        this.afterRender = new _promise2.default(function (resolve, reject) {
          requestAnimationFrame(function step(t) {
            var renderer = void 0;
            if (that.renderMode === 'repaintDirty') {
              renderer = that.renderRepaintDirty.bind(that);
            } else if (that.renderMode === 'repaintAll') {
              renderer = that.renderRepaintAll.bind(that);
            } else {
              throw new Error('unknown render mode!');
            }

            if (that[_updateSet].size) {
              renderer(t);

              _dispatchEvent.call(that, 'update', { target: that, timeline: that.timeline, currentTime: that.timeline.currentTime }, true);
            }

            if (that[_updateSet].size) {
              requestAnimationFrame(step);
            } else {
              that.afterRender = readyState;
              resolve();
            }
          });
        });
        // .catch(ex => console.error(ex.message))
      }

      return this.afterRender;
    }
  }, {
    key: 'update',
    value: function update(target) {
      if (target && this[_updateSet].has(target)) return;
      // invisible... return
      if (target && !target.lastRenderBox && !this.isVisible(target)) return;
      if (target) this[_updateSet].add(target);

      return this[_render]();
    }
  }, {
    key: 'isVisible',
    value: function isVisible(sprite) {
      var opacity = sprite.attr('opacity');
      if (opacity <= 0) {
        return false;
      }

      var _sprite$offsetSize = (0, _slicedToArray3.default)(sprite.offsetSize, 2),
          width = _sprite$offsetSize[0],
          height = _sprite$offsetSize[1];

      if (width <= 0 || height <= 0) {
        return false;
      }

      var _canvas = this.canvas,
          maxWidth = _canvas.width,
          maxHeigth = _canvas.height;


      var box = sprite.renderBox;
      if (box[0] > maxWidth || box[1] > maxHeigth || box[2] < 0 || box[3] < 0) {
        return false;
      }

      return true;
    }
  }, {
    key: 'sortChildren',
    value: function sortChildren(children) {
      children.sort(function (a, b) {
        var a_zidx = a.attr('zIndex'),
            b_zidx = b.attr('zIndex');
        if (a_zidx === b_zidx) {
          return a.zOrder - b.zOrder;
        }
        return a_zidx - b_zidx;
      });
    }
  }, {
    key: 'drawSprites',
    value: function drawSprites(renderEls, t) {
      if (this.evaluateFPS) {
        this[_tRecord].push(t);
        this[_tRecord] = this[_tRecord].slice(-10);
      }

      for (var i = 0; i < renderEls.length; i++) {
        var child = renderEls[i];
        if (child.parent === this) {
          if (this.isVisible(child)) {
            child.draw(t);
          } else {
            // invisible, only need to remove lastRenderBox
            delete child.lastRenderBox;
          }
        }
      }
    }
  }, {
    key: 'renderRepaintAll',
    value: function renderRepaintAll(t) {
      var _this2 = this;

      var renderEls = this[_children].filter(function (e) {
        return _this2.isVisible(e);
      });
      var _canvas2 = this.canvas,
          width = _canvas2.width,
          height = _canvas2.height;


      this.sortChildren(renderEls);

      var outputContext = this.outputContext;
      outputContext.clearRect(0, 0, width, height);

      var shadowContext = this.shadowContext;

      if (shadowContext) {
        shadowContext.clearRect(0, 0, width, height);
        this.drawSprites(renderEls, t);
        outputContext.drawImage(shadowContext.canvas, 0, 0);
      } else {
        this.drawSprites(renderEls, t);
      }

      this[_updateSet].clear();
    }
  }, {
    key: 'renderRepaintDirty',
    value: function renderRepaintDirty(t) {
      var _this3 = this;

      var _resolution = (0, _slicedToArray3.default)(this.resolution, 2),
          width = _resolution[0],
          height = _resolution[1];

      var updateSet = this[_updateSet];
      var children = this[_children].filter(function (e) {
        return _this3.isVisible(e);
      });
      var restEls = children.filter(function (el) {
        return !updateSet.has(el);
      });
      var affectedSet = new _set2.default(),
          unaffectedSet = new _set2.default();

      var updateEls = (0, _from2.default)(updateSet);

      for (var i = 0; i < restEls.length; i++) {
        var unaffectedEl = restEls[i];
        var affected = false;

        for (var j = 0; j < updateEls.length; j++) {
          var affectedEl = updateEls[j];
          var box1 = affectedEl.renderBox,
              box2 = unaffectedEl.renderBox,
              box3 = affectedEl.lastRenderBox;

          if ((0, _spriteUtils.boxIntersect)(box1, box2) || box3 && (0, _spriteUtils.boxIntersect)(box3, box2)) {
            affected = true;
            break;
          }
        }
        if (affected) affectedSet.add(unaffectedEl);else unaffectedSet.add(unaffectedEl);
      }

      if (affectedSet.size > 0 && unaffectedSet.size > 0) {
        var changed = void 0;
        do {
          changed = false;
          var _affectedEls = (0, _from2.default)(affectedSet),
              unaffectedEls = (0, _from2.default)(unaffectedSet);

          for (var _i = 0; _i < _affectedEls.length; _i++) {
            var _affectedEl = _affectedEls[_i];
            for (var _j = 0; _j < unaffectedEls.length; _j++) {
              var _unaffectedEl = unaffectedEls[_j];
              var _box = _affectedEl.renderBox,
                  _box2 = _unaffectedEl.renderBox;

              if ((0, _spriteUtils.boxIntersect)(_box, _box2)) {
                affectedSet.add(_unaffectedEl);
                unaffectedSet.delete(_unaffectedEl);
                changed = true;
                break;
              }
            }
            if (changed) break;
          }
        } while (changed);
      }

      var shadowContext = this.shadowContext;
      var outputContext = this.outputContext;

      if (shadowContext) {
        shadowContext.save();
        shadowContext.beginPath();
      }
      outputContext.save();
      outputContext.beginPath();

      for (var _i2 = 0; _i2 < updateEls.length; _i2++) {
        var updateEl = updateEls[_i2];
        var box = updateEl.renderBox;

        var dirtyBox = (0, _spriteUtils.boxIntersect)(box, [0, 0, width, height]);

        if (dirtyBox) {
          var dirtyRect = (0, _spriteUtils.boxToRect)(dirtyBox);

          if (shadowContext) shadowContext.rect.apply(shadowContext, (0, _toConsumableArray3.default)(dirtyRect));
          outputContext.rect.apply(outputContext, (0, _toConsumableArray3.default)(dirtyRect));
        }

        var lastRenderBox = updateEl.lastRenderBox;
        if (lastRenderBox && !(0, _spriteUtils.boxEqual)(lastRenderBox, box)) {
          dirtyBox = (0, _spriteUtils.boxIntersect)(lastRenderBox, [0, 0, width, height]);

          if (dirtyBox) {
            var _dirtyRect = (0, _spriteUtils.boxToRect)(dirtyBox);

            if (shadowContext) shadowContext.rect.apply(shadowContext, (0, _toConsumableArray3.default)(_dirtyRect));
            outputContext.rect.apply(outputContext, (0, _toConsumableArray3.default)(_dirtyRect));
          }
        }
      }

      var affectedEls = (0, _from2.default)(affectedSet);
      for (var _i3 = 0; _i3 < affectedEls.length; _i3++) {
        var _affectedEl2 = affectedEls[_i3];
        var _box3 = _affectedEl2.renderBox;
        var _dirtyBox = (0, _spriteUtils.boxIntersect)(_box3, [0, 0, width, height]);

        if (_dirtyBox) {
          var _dirtyRect2 = (0, _spriteUtils.boxToRect)(_dirtyBox);

          if (shadowContext) shadowContext.rect.apply(shadowContext, (0, _toConsumableArray3.default)(_dirtyRect2));
          outputContext.rect.apply(outputContext, (0, _toConsumableArray3.default)(_dirtyRect2));
        }
      }

      if (shadowContext) {
        shadowContext.clip();
        shadowContext.clearRect(0, 0, width, height);
      }

      outputContext.clip();
      outputContext.clearRect(0, 0, width, height);

      var renderEls = [].concat((0, _toConsumableArray3.default)(updateSet), (0, _toConsumableArray3.default)(affectedSet));
      this.sortChildren(renderEls);

      if (shadowContext) {
        this.drawSprites(renderEls, t);
        outputContext.drawImage(shadowContext.canvas, 0, 0);
        shadowContext.restore();
      } else {
        this.drawSprites(renderEls, t);
      }

      outputContext.restore();
      this[_updateSet].clear();
    }
  }, {
    key: 'appendChild',
    value: function appendChild(sprite) {
      var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.removeChild(sprite);
      this[_children].push(sprite);
      sprite.connect(this, this[_zOrder]++);
      if (update) this.update(sprite);
      return sprite;
    }
  }, {
    key: 'append',
    value: function append() {
      var _this4 = this;

      for (var _len = arguments.length, sprites = Array(_len), _key = 0; _key < _len; _key++) {
        sprites[_key] = arguments[_key];
      }

      sprites.forEach(function (sprite) {
        return _this4.appendChild(sprite);
      });
    }
  }, {
    key: 'removeChild',
    value: function removeChild(sprite) {
      var idx = this[_children].indexOf(sprite);
      if (idx === -1) {
        return null;
      }
      this[_children].splice(idx, 1);
      if (this.isVisible(sprite) || sprite.lastRenderBox) {
        sprite.forceUpdate();
      }
      sprite.disconnect(this);
      return sprite;
    }
  }, {
    key: 'remove',
    value: function remove() {
      var _this5 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (args.length === 0) {
        args = this[_children].slice(0);
      }
      return args.map(function (child) {
        return _this5.removeChild(child);
      });
    }
  }, {
    key: 'pointCollision',
    value: function pointCollision(evt) {
      var layerX = evt.layerX,
          layerY = evt.layerY;

      var _resolution2 = (0, _slicedToArray3.default)(this.resolution, 2),
          width = _resolution2[0],
          height = _resolution2[1];

      if (layerX >= 0 && layerY >= 0 && layerX < width && layerY < height) {
        return [layerX, layerY];
      }
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(type, evt) {
      var forceTrigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      evt.layer = this;
      var sprites = this[_children].slice(0);
      sprites.sort(function (a, b) {
        var a_zidx = a.attr('zIndex'),
            b_zidx = b.attr('zIndex');

        if (a_zidx === b_zidx) {
          return b.zOrder - a.zOrder;
        }
        return b_zidx - a_zidx;
      });

      var targetSprites = [];
      for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        var hit = sprite.dispatchEvent(type, evt, forceTrigger);
        if (hit) {
          // detect mouseenter/mouseleave
          targetSprites.push(sprite);
        }
      }

      evt.targetSprites = targetSprites;
      (0, _get3.default)(Layer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Layer.prototype), 'dispatchEvent', this).call(this, type, evt, forceTrigger);
    }
  }, {
    key: 'connect',
    value: function connect(parent, zOrder, zIndex) {
      (0, _get3.default)(Layer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Layer.prototype), 'connect', this).call(this, parent, zOrder);
      this.zIndex = zIndex;
      this.updateResolution();
      return this;
    }
  }, {
    key: 'disconnect',
    value: function disconnect(parent) {
      this.outputContext.canvas.remove();
      return (0, _get3.default)(Layer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Layer.prototype), 'disconnect', this).call(this, parent);
    }
  }, {
    key: 'timeline',
    get: function get() {
      return this[_timeline];
    }
  }, {
    key: 'canvas',
    get: function get() {
      return this.outputContext.canvas;
    }
  }, {
    key: 'context',
    get: function get() {
      return this.shadowContext ? this.shadowContext : this.outputContext;
    }
  }, {
    key: 'id',
    get: function get() {
      return this.canvas.dataset.layerId;
    }
  }, {
    key: 'fps',
    get: function get() {
      if (!this.evaluateFPS) {
        return NaN;
      }
      var sum = 0;
      var tr = this[_tRecord].slice(-10);
      var len = tr.length;

      if (len <= 5) {
        return NaN;
      }
      tr.reduceRight(function (a, b, i) {
        sum += a - b;return b;
      });

      return Math.round(1000 * (len - 1) / sum);
    }
  }]);
  return Layer;
}(_basenode2.default), (_applyDecoratedDescriptor(_class.prototype, 'prepareRender', [_dec], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'prepareRender'), _class.prototype)), _class));
exports.default = Layer;