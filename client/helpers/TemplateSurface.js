define("TemplateSurface", [], function(require, exports, module) {

    var Surface = require("famous/core/Surface");


    var TemplateSurface = function() {
        Surface.apply(this, arguments);
    };

    TemplateSurface.prototype = Object.create(Surface.prototype);
    TemplateSurface.prototype.constructor = TemplateSurface;

    TemplateSurface.DEFAULT_OPTIONS = {};

    TemplateSurface.prototype.deploy = function(target) {
        if (options.template && Template[options.template]) {
            // Create container
            surface.content = document.createElement('div');
            if (options.data) {
                // Create instance
                this.templateInstance = UI.renderWithData(Template[options.template], options.data);
            } else {
                // Create instance
                this.templateInstance = UI.render(Template[options.template]);
            }
            // Insert template into container
            UI.insert(this.templateInstance, surface.content);
        }

        // Call super
        Surface.prototype.deploy.call(this, target);
    };

    // Clean up
    TemplateSurface.prototype.cleanup = function(allocator) {
        // Remove template instance
        this.templateInstance && this.templateInstance.dom.remove();
        // Call super
        Surface.prototype.cleanup.call(surface, allocator);
    };

    // Export the function
    module.exports = TemplateSurface;

});