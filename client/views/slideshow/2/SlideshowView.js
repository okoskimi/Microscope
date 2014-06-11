/*
 * Original Slideshow tutorial example (c) Famous 2014 Famous Industries, Inc.
 * Published under Mozilla Public License Version 2.0.
 */

define('SlideshowView', [], function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Lightbox = require('famous/views/Lightbox');
    var Easing = require('famous/transitions/Easing');

    var SlideView = require('SlideView');

    function SlideshowView() {
        View.apply(this, arguments);

        console.log("Created slideshowview with options: ", this.options);


        this.rootModifier = new StateModifier({
            size: this.options.size,
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        var that = this;

        this.mainNode = this.add(this.rootModifier);

        _createLightbox.call(this);

        //_createSlides.call(this);

        Deps.autorun(function() {
            var slide = new SlideView({
                size: that.options.size,
                template: that.options.template,
                data: Posts.find({}).fetch()[0] // There is only post in this route
            });
            that.lightbox.show(slide, function() {
                that.ready = true;
                slide.fadeIn();
            }.bind(that));
        });

    }

    SlideshowView.prototype = Object.create(View.prototype);
    SlideshowView.prototype.constructor = SlideshowView;

    SlideshowView.DEFAULT_OPTIONS = {
        size: [450, 500],
        data: undefined,
        lightboxOpts: {
            inOpacity: 1,
            outOpacity: 0,
            inOrigin: [0, 0],
            outOrigin: [0, 0],
            showOrigin: [0, 0],
            inTransform: Transform.thenMove(Transform.rotateX(0.9), [0, -300, -300]),
            outTransform: Transform.thenMove(Transform.rotateZ(0.7), [0, window.innerHeight, -1000]),
            inTransition: { duration: 650, curve: 'easeOut' },
            outTransition: { duration: 500, curve: Easing.inCubic }
        }
    };

    function _createLightbox() {
        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.mainNode.add(this.lightbox);
    }
    /*

    function _createSlides() {
        this.slides = [];
        this.currentIndex = 0;

        for (var i = 0; i < this.options.data.length; i++) {
            var slide = new SlideView({
                size: this.options.size,
                photoUrl: "http://ichef.bbci.co.uk/food/ic/food_16x9_608/foods/c/cheese_16x9.jpg" //this.options.data[i]
            });

            this.slides.push(slide);

            slide.on('click', this.showNextSlide.bind(this));
        }

        this.showCurrentSlide();
    }
    SlideshowView.prototype.showCurrentSlide = function() {
        this.ready = false;

        var slide = this.slides[this.currentIndex];
        this.lightbox.show(slide, function() {
            this.ready = true;
            slide.fadeIn();
        }.bind(this));
    };

    SlideshowView.prototype.showNextSlide = function() {
        if (!this.ready) return;

        this.currentIndex++;
        if (this.currentIndex === this.slides.length) this.currentIndex = 0;
        this.showCurrentSlide();
    };
*/
    module.exports = SlideshowView;
});
