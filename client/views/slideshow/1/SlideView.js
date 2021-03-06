/*
 * Original Slideshow tutorial example (c) Famous 2014 Famous Industries, Inc.
 * Published under Mozilla Public License Version 2.0.
 */

define('SlideView', [], function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var TemplateSurface = require('TemplateSurface');
    var Transitionable   = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');

    Transitionable.registerMethod('spring', SpringTransition);

    function SlideView() {
        View.apply(this, arguments);

        console.log("Created slideview with options: ", this.options);


        this.rootModifier = new StateModifier({
            size: this.options.size
        });

        this.mainNode = this.add(this.rootModifier);

        _createBackground.call(this);
        _createFilm.call(this);
        _createPhoto.call(this);
    }

    SlideView.prototype = Object.create(View.prototype);
    SlideView.prototype.constructor = SlideView;

    SlideView.DEFAULT_OPTIONS = {
        size: [400, 450],
        filmBorder: 15,
        photoBorder: 3,
        photoUrl: "/img/image-missing.png",
        angle: -0.5
    };

    function _createBackground() {
        var background = new Surface({
            properties: {
                backgroundColor: '#FFFFF5',
                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer'
            }
        });

        this.mainNode.add(background);

        background.on('click', function() {
            this._eventOutput.emit('click');
        }.bind(this));
    }

    function _createFilm() {
        this.options.filmSize = this.options.size[0] - 2 * this.options.filmBorder;

        var film = new Surface({
            size: [this.options.filmSize, this.options.filmSize],
            properties: {
                backgroundColor: '#222',
                zIndex: 1,
                pointerEvents: 'none'
            }
        });

        var filmModifier = new StateModifier({
            origin: [0.5, 0],
            align: [0.5, 0],
            transform: Transform.translate(0, this.options.filmBorder, 0.05)
        });

        this.mainNode.add(filmModifier).add(film);
    }

    function _createPhoto() {
        var size = this.options.filmSize - 2 * this.options.photoBorder;

        /*
        var photo = new ImageSurface({
            size: [size, size],
            content: this.options.photoUrl,
            properties: {
                zIndex: 2,
                pointerEvents: 'none'
            }
        });
        */
        console.log("Creating TemplateSurface");
        var photo = new TemplateSurface({
            size: [size, size],
            template: this.options.template,
            data: this.options.data,
            properties: {
                zIndex: 2
            }
        });
        console.log("Created TemplateSurface");

        this.photoModifier = new StateModifier({
            origin: [0.5, 0],
            align: [0.5, 0],
            transform: Transform.translate(0, this.options.filmBorder + this.options.photoBorder, 0.1),
            opacity: 0.01
        });

        this.mainNode.add(this.photoModifier).add(photo);
    }

    SlideView.prototype.fadeIn = function() {
        this.photoModifier.setOpacity(1, { duration: 1500, curve: 'easeIn' });
        this.shake();
    };

    SlideView.prototype.shake = function() {
        this.rootModifier.halt();

        this.rootModifier.setTransform(
            Transform.rotateX(this.options.angle),
            { duration: 200, curve: 'easeOut' }
        );

        this.rootModifier.setTransform(
            Transform.identity,
            { method: 'spring', period: 600, dampingRatio: 0.15 }
        );
    };

    module.exports = SlideView;
});
