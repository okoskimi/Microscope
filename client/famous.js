
/*
require("famous-polyfills"); // Add polyfills
require("famous/core/famous"); // Add the default css file

Application = null;
var Application_show = null;

Meteor.startup(function () {
    var mainContextId = "famous-main-context";
    var templateSurfaceHeightFix = 60;

    var Engine = require("famous/core/Engine");
    var View = require("famous/core/View");
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Scrollview = require("famous/views/Scrollview");
    var Surface = require("famous/core/Surface");
    var Lightbox = require("famous/views/Lightbox");

    function AppView() {
        View.apply(this, arguments);

        this.container = new ContainerSurface({
            properties: {
                overflow: 'hidden'
            }
        });
        this.add(this.container);

        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.container.add(this.lightbox);
        this._eventInput.pipe(this.lightbox);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        size: [undefined, undefined],
        lightboxOpts: {
            size: [undefined, undefined],
            inTransition: {curve: 'easeIn', duration: 300},
            inOrigin: [0, 0],
            showOrigin: [0, 0],
            outOrigin: [0, 0]
        },
        properties: {
            backgroundColor: 'green'
        }
    };

    AppView.prototype.show = function (renderable) {
        this.lightbox.show(renderable);
    };



    Template.famousYield.rendered = function() {
        if (! Application) {
            console.log("Famous yield: ", this);
            console.log("Root element: ", this.firstNode);
            var rootWidth = $(this.firstNode).width();
            var rootHeight = $(this.firstNode).height();
            console.log("Root element size: ", rootWidth, rootHeight);
            Application = new AppView({
                size: [rootWidth, rootHeight]
            });
            var mainContext = Engine.createContext(this.firstNode);
            mainContext.add(Application);
            mainContext.setPerspective(1000);
            Engine.pipe(Application);
        }
    }


    var templateSurfaces = [];
    var views = [];

    function lightboxAction() {
        console.log("Lightboxaction: ", this);
        var templateName = this.router._currentController.lookupTemplate();
        var viewName = this.router._currentController.lookupProperty('view');
        var data = this.data();
        var dataFunc = this.data;
        Deps.autorun(function() {
            console.log("Data is now: ", dataFunc());
        });
        console.log("Handling route " + this.route.name);
        console.log("Data: ", data);
        console.log("Template: ", templateName);
        console.log("View: ", viewName);
        if (viewName) {
            var view = views[viewName];
            if (! view) {
                var viewConstructor = require(viewName);
                if (viewConstructor) {
                    console.log("Instantiating view");
                    view = views[viewName] = new viewConstructor(this.route.options.viewOptions || {});
                }
            }
            if (view) {
                console.log("Showing view...");
                Application.show(view);
            } else {
                throw new Error("Unable to instantiate view: " + viewName);
            }
        } else {
            var scrollview = templateSurfaces[templateName];
            if (!scrollview) {
                    console.log("Instantiating Scrollview and Surface");
                    scrollview = templateSurfaces[templateName] = new Scrollview();

                    scrollview.templateSurface = new Surface();
                    console.log("Instantiating scrollview");
                    scrollview.sequenceFrom([ scrollview.templateSurface ]);
                    scrollview.templateSurface.pipe(scrollview);

            }
            if (scrollview.templateRoot) {
                $(scrollview.templateRoot).remove();
            }
            scrollview.templateRoot = document.createElement('div');
            UI.insert(UI.renderWithData(Template[templateName], data), scrollview.templateRoot);
            scrollview.templateSurface.setContent(scrollview.templateRoot);
            Meteor.defer(function() {
                console.log("Showing template surface:", scrollview.templateRoot);
                console.log("Defer: Setting template surface height to " + scrollview.templateRoot.offsetHeight + "px");
                scrollview.templateSurface.setContent(scrollview.templateRoot);
                scrollview.templateSurface.setSize([
                    undefined, scrollview.templateRoot.offsetHeight + templateSurfaceHeightFix
                ]);
            });
            Application.show(scrollview);



        }

    }

    // setup famous sections from templates
    _.each(Router.routes, function(route) {
        // route.action = lightboxAction;
        route.action = function() {
            console.log("Rendering: ", this.render());
        }
    });

});

*/