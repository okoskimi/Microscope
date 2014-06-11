

require("famousPolyfills"); // Add polyfills
require("famous/core/famous"); // Add the default css file



Meteor.startup(function () {
    var templateSurfaceHeightFix = 60;
    var Engine = require("famous/core/Engine");
    var Scrollview = require("famous/views/Scrollview");
    var Surface = require("famous/core/Surface");
    var LightboxLayout = require("LightboxLayout");
    var RenderControllerLayout = require("RenderControllerLayout");

    var _layout = null;
    var _transitions = {};
    var _defaultTransition = {};
    var _views = [];

    Template.famousYield.rendered = function() {
        if (! _layout) {
            console.log("Famous yield: ", this);
            console.log("Root element: ", this.firstNode);
            var rootWidth = $(this.firstNode).width();
            var rootHeight = $(this.firstNode).height();
            console.log("Root element size: ", rootWidth, rootHeight);
            _layout = new /* RenderControllerLayout({ */ LightboxLayout({
                size: [rootWidth, rootHeight]
            });
            _defaultTransition = _layout.getOptions().layoutOpts;
            var mainContext = Engine.createContext(this.firstNode);
            mainContext.add(_layout);
            mainContext.setPerspective(1000);
            Engine.pipe(_layout);
        }
    }

    function layoutAction() {
        console.log("layoutAction: ", this);
        var templateName = this.router._currentController.lookupTemplate();
        var viewName = this.router._currentController.lookupProperty('view');
        var newTransitions = this.router._currentController.lookupProperty('transitions') || {};
        var data = this.data();
        console.log("Handling route " + this.route.name);
        console.log("Data: ", data);
        console.log("Template: ", templateName);
        console.log("View: ", viewName);
        console.log("Layout view: ", this.router._currentController.lookupProperty('layoutView'));
        var view = _views[this.path];
        if (! view) {
            if (viewName) {
                var viewConstructor = require(viewName);
                if (viewConstructor) {
                    console.log("Instantiating custom view");
                    view = _views[this.path] = new viewConstructor(_.extend({
                        template: templateName
                    }, this.route.options.viewOptions || {}));
                }
            } else {
                console.log("Instantiating Scrollview and Surface");
                view = _views[this.path] = new Scrollview();
                view.templateSurface = new Surface();
                view.sequenceFrom([ view.templateSurface ]);
                view.templateSurface.pipe(view);
            }
        }
        if (view.templateSurface) {
            if (view.templateRoot) {
                $(view.templateRoot).remove();
            }
            view.templateRoot = document.createElement('div');
            UI.insert(UI.renderWithData(Template[templateName], data), view.templateRoot);
            view.templateSurface.setContent(view.templateRoot);
        }
        if (view) {
            console.log("Showing view...");
            if (_transitions[this.route.name]) {
                console.log("Using custom transition: ", _transitions[this.route.name]);
                _layout.setOptions( {
                    layoutOpts: _transitions[this.route.name]
                });
            } else {
                _layout.setOptions( {
                    layoutOpts: _defaultTransition
                })
            }
            _layout.show(view, function() {
                if (view.templateSurface) {
                    Meteor.defer(function() {
                        console.log("Showing template surface:", view.templateRoot);
                        console.log("Defer: Setting template surface height to " + view.templateRoot.offsetHeight + "px");
                        view.templateSurface.setContent(view.templateRoot);
                        view.templateSurface.setSize([
                            undefined, view.templateRoot.offsetHeight + templateSurfaceHeightFix
                        ]);
                    });
                }
            });
            _transitions = newTransitions;
        } else {
            throw new Error("Unable to instantiate view: " + viewName);
        }
    }

    // setup famous sections from templates
    _.each(Router.routes, function(route) {
        route.action = layoutAction;

    });

});

