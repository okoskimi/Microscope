define('LightboxLayout', [], function(require, exports, module) {
    var Engine = require("famous/core/Engine");
    var View = require("famous/core/View");
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Scrollview = require("famous/views/Scrollview");
    var Surface = require("famous/core/Surface");
    var Lightbox = require("famous/views/Lightbox");
    var Transform = require('famous/core/Transform');

    function LightboxLayout() {
        View.apply(this, arguments);

        this.container = new ContainerSurface({
            properties: {
                overflow: 'hidden'
            }
        });
        this.add(this.container);

        this.lightbox = new Lightbox(this.options.layoutOpts);
        this.container.add(this.lightbox);
        this._eventInput.pipe(this.lightbox);
        console.log("Constructor this: ", this);
    }

    LightboxLayout.prototype = Object.create(View.prototype);
    LightboxLayout.prototype.constructor = LightboxLayout;


    LightboxLayout.DEFAULT_OPTIONS = {
        size: [undefined, undefined],
        layoutOpts: {
            // 'in' state
            inTransform: Transform.translate(0, 0, 0),
            inOpacity: 0,
            inOrigin: [0, 0],

            // 'show' state
            showTransform: Transform.identity,
            showOpacity: 1,
            showOrigin: [0, 0],

            // 'out' state
            outTransform: Transform.translate(0, 0, 0),
            outOpacity: 0,
            outOrigin: [0, 0],

            // transition parameters
            inTransition: { duration: 500, curve: 'linear' },
            outTransition: { duration: 500, curve: 'linear' },
            overlap: false
        },
        properties: {
            backgroundColor: 'green'
        }
    };

    LightboxLayout.prototype.show = function (renderable, cb) {
        this.lightbox.show(renderable, undefined, cb);
    };

    LightboxLayout.prototype.setOptions = function (options) {
        console.log("Lightbox.setOptions");
        console.log("setoptions this:", this);
        View.prototype.setOptions.apply(this, arguments);
        if (this.lightbox) { // This is also called from View constructor before this.lightbox is set
            console.log("Setting lightbox layout options to ", this.options.layoutOpts);
            this.lightbox.setOptions(this.options.layoutOpts);
        }
    };


    module.exports = LightboxLayout;
});
