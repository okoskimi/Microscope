define('RenderControllerLayout', [], function(require, exports, module) {
    var Engine = require("famous/core/Engine");
    var View = require("famous/core/View");
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Scrollview = require("famous/views/Scrollview");
    var Surface = require("famous/core/Surface");
    var RenderController = require("famous/views/RenderController");
    var Transform = require('famous/core/Transform');

    /*
     * Credit: http://stackoverflow.com/questions/24082190/rendercontroller-with-sliding-transitions-transform-translate/
     */

    function RenderControllerLayout() {
        View.apply(this, arguments);

        this.container = new ContainerSurface({
            properties: {
                overflow: 'hidden'
            }
        });
        this.add(this.container);

        this.renderController = new RenderController(this.options.layoutOpts);
        this.renderController.inTransformFrom(function(progress) {
            return Transform.translate(window.innerWidth * (1.0 - progress), 0, 0);
        });
        this.renderController.outTransformFrom(function(progress) {
            return Transform.translate(window.innerWidth * progress - window.innerWidth, 0, 0);
        });
        // no cross-fading
        this.renderController.inOpacityFrom(function() { return 1; });
        this.renderController.outOpacityFrom(function() { return 1; });


        this.container.add(this.renderController);
        this._eventInput.pipe(this.renderController);
    }

    RenderControllerLayout.prototype = Object.create(View.prototype);
    RenderControllerLayout.prototype.constructor = RenderControllerLayout;


    RenderControllerLayout.DEFAULT_OPTIONS = {
        size: [undefined, undefined],
        layoutOpts: {
            inTransition: { curve: "linear", duration: 500 },
            outTransition: { curve: "linear", duration: 500 },
            overlap: true
        },
        properties: {
            backgroundColor: 'green'
        }
    };

    RenderControllerLayout.prototype.show = function (renderable) {
        this.renderController.show(renderable);
    };

    module.exports = RenderControllerLayout;
});
