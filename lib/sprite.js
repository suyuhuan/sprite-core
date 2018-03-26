'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _desc, _value, _class, _class2, _temp;

var _basesprite = require('./basesprite');

var _basesprite2 = _interopRequireDefault(_basesprite);

var _filters = require('./filters');

var _filters2 = _interopRequireDefault(_filters);

var _spriteUtils = require('sprite-utils');

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

var _texturesCache = (0, _symbol2.default)('_texturesCache');
var _images = (0, _symbol2.default)('_images');

var TextureAttr = (_class = function (_BaseSprite$Attr) {
  (0, _inherits3.default)(TextureAttr, _BaseSprite$Attr);

  function TextureAttr(subject) {
    (0, _classCallCheck3.default)(this, TextureAttr);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TextureAttr.__proto__ || (0, _getPrototypeOf2.default)(TextureAttr)).call(this, subject));

    _this.setDefault({
      texturesSize: [0, 0],
      textures: []
    });
    return _this;
  }
  /*
    {
      image: ...,  //texture resource
      srcRect: ..., //texture clip
      rect: ....,  //texture in sprite offset
      filter: ...  //texture filters
    }
   */


  (0, _createClass3.default)(TextureAttr, [{
    key: 'loadTextures',
    value: function loadTextures(textures) {
      var subject = this.subject;

      // adaptive textures
      var width = 0,
          height = 0;

      subject.images = textures.map(function (_ref) {
        var image = _ref.image,
            rect = _ref.rect,
            srcRect = _ref.srcRect;

        var w = void 0,
            h = void 0;
        if (rect) {
          w = rect[2] + rect[0];
          h = rect[3] + rect[1];
        } else if (srcRect) {
          w = srcRect[2];
          h = srcRect[3];
        } else {
          w = image.width;
          h = image.height;
        }
        if (width < w) {
          width = w;
        }
        if (height < h) {
          height = h;
        }
        return image;
      });
      this.set('texturesSize', [width, height]);
    }
  }, {
    key: 'textures',
    set: function set(textures) {
      if (!Array.isArray(textures)) {
        textures = [textures];
      }

      textures = textures.map(function (texture) {
        if (!texture.image) {
          texture = { image: texture };
        }
        return texture;
      });

      this.set('textures', textures);
      this.loadTextures(textures);
    }
  }, {
    key: 'texturesSize',
    get: function get() {
      return this.get('texturesSize');
    }
  }]);
  return TextureAttr;
}(_basesprite2.default.Attr), (_applyDecoratedDescriptor(_class.prototype, 'textures', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'textures'), _class.prototype)), _class);
var Sprite = (_temp = _class2 = function (_BaseSprite) {
  (0, _inherits3.default)(Sprite, _BaseSprite);

  /**
    new Sprite({
      attr: {
        ...
      },
      attributeChangedCallback: function(prop, oldValue, newValue){
       }
    })
   */
  function Sprite(attr) {
    (0, _classCallCheck3.default)(this, Sprite);

    if (typeof attr === 'string') {
      attr = { textures: [attr] };
    }

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (Sprite.__proto__ || (0, _getPrototypeOf2.default)(Sprite)).call(this, attr));

    _this2[_texturesCache] = new _map2.default();
    return _this2;
  }

  (0, _createClass3.default)(Sprite, [{
    key: 'cloneNode',
    value: function cloneNode(copyContent) {
      var node = (0, _get3.default)(Sprite.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sprite.prototype), 'cloneNode', this).call(this, copyContent);
      if (copyContent) {
        node.textures = this.textures;
      }
      return node;
    }
  }, {
    key: 'pointCollision',
    value: function pointCollision(evt) {
      var _this3 = this;

      if ((0, _get3.default)(Sprite.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sprite.prototype), 'pointCollision', this).call(this, evt)) {
        var textures = this.textures;

        if (textures) {
          var offsetX = evt.offsetX,
              offsetY = evt.offsetY;

          evt.targetTextures = [];

          var _attr = this.attr('anchor'),
              _attr2 = (0, _slicedToArray3.default)(_attr, 2),
              anchorX = _attr2[0],
              anchorY = _attr2[1],
              _contentSize = (0, _slicedToArray3.default)(this.contentSize, 2),
              width = _contentSize[0],
              height = _contentSize[1];

          offsetX += width * anchorX;
          offsetY += height * anchorY;

          textures.forEach(function (texture) {
            var _ref2 = texture.rect || [0, 0].concat((0, _toConsumableArray3.default)(_this3.innerSize)),
                _ref3 = (0, _slicedToArray3.default)(_ref2, 4),
                x = _ref3[0],
                y = _ref3[1],
                w = _ref3[2],
                h = _ref3[3];

            if (offsetX >= x && offsetX - x < w && offsetY >= y && offsetY - y < h) {
              // touched textures
              evt.targetTextures.push(texture);
            }
          });
        }
        return true;
      }
    }
  }, {
    key: 'render',
    value: function render(t, drawingContext) {
      var _this4 = this;

      var context = (0, _get3.default)(Sprite.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sprite.prototype), 'render', this).call(this, t, drawingContext);
      var textures = this.textures;

      if (this.images) {
        var _attr3 = this.attr(),
            borderWidth = _attr3.border[0];

        textures.forEach(function (texture, i) {
          var img = _this4.images[i];
          var rect = (texture.rect || [0, 0].concat((0, _toConsumableArray3.default)(_this4.innerSize))).slice(0);
          var srcRect = texture.srcRect;
          rect[0] += borderWidth;
          rect[1] += borderWidth;

          context.save();

          if (texture.filter) {
            var outterRect = void 0;
            var imgRect = srcRect ? [0, 0, srcRect[2], srcRect[3]] : [0, 0, img.width, img.height];

            if (texture.filter.dropShadow) {
              var dsArr = texture.filter.dropShadow;
              var shadowRect = [dsArr[0] - 2 * dsArr[2], dsArr[1] - 2 * dsArr[2], imgRect[2] + 4 * dsArr[2], imgRect[3] + 4 * dsArr[2]].map(function (val) {
                return Math.round(val);
              });

              outterRect = (0, _spriteUtils.boxToRect)((0, _spriteUtils.boxUnion)((0, _spriteUtils.rectToBox)(shadowRect), (0, _spriteUtils.rectToBox)(imgRect))).map(function (val) {
                return Math.abs(val);
              });
            } else {
              outterRect = imgRect;
            }

            var sx = rect[2] / outterRect[2],
                sy = rect[3] / outterRect[3];

            context.filter = _filters2.default.compile(texture.filter);

            if (srcRect) {
              context.drawImage.apply(context, [img].concat((0, _toConsumableArray3.default)(srcRect), [sx * outterRect[0] + rect[0], sy * outterRect[1] + rect[1], sx * srcRect[2], sy * srcRect[3]]));
            } else {
              context.drawImage(img, sx * outterRect[0] + rect[0], sy * outterRect[1] + rect[1], sx * img.width, sy * img.height);
            }
          } else if (srcRect) {
            context.drawImage.apply(context, [img].concat((0, _toConsumableArray3.default)(srcRect), (0, _toConsumableArray3.default)(rect)));
          } else {
            context.drawImage.apply(context, [img].concat((0, _toConsumableArray3.default)(rect)));
          }

          context.restore();
        });
      }

      return context;
    }
  }, {
    key: 'images',
    set: function set(images) {
      this[_images] = images;
    },
    get: function get() {
      return this[_images];
    }
  }, {
    key: 'textures',
    set: function set(textures) {
      this.attr('textures', textures);
    },
    get: function get() {
      return this.attr('textures');
    }

    // override to adapt textures' size

  }, {
    key: 'contentSize',
    get: function get() {
      var _attr4 = this.attr('size'),
          _attr5 = (0, _slicedToArray3.default)(_attr4, 2),
          width = _attr5[0],
          height = _attr5[1];

      var boxSize = this.attr('texturesSize');

      if (width === '') {
        width = boxSize[0] | 0;
      }
      if (height === '') {
        height = boxSize[1] | 0;
      }

      return [width, height];
    }
  }, {
    key: 'cache',
    set: function set(context) {
      if (context == null) {
        this[_texturesCache].clear();
        return;
      }
      var key = (0, _stringify2.default)(this.textures),
          cacheMap = this[_texturesCache];

      if (!cacheMap.has(key)) {
        cacheMap.set(key, context);
      }
    },
    get: function get() {
      var key = (0, _stringify2.default)(this.textures),
          cacheMap = this[_texturesCache];
      if (cacheMap.has(key)) {
        return cacheMap.get(key);
      }
      return null;
    }
  }]);
  return Sprite;
}(_basesprite2.default), _class2.Attr = TextureAttr, _temp);
exports.default = Sprite;