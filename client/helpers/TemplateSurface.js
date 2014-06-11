// Credit to @raix

define("TemplateSurface", [], function(require, exports, module) {

    var Surface = require("famous/core/Surface");


    var TemplateSurface = function(options) {
        console.log("TemplateSurface arguments: ", arguments);
        Surface.apply(this, arguments);
        // Surface constructor does not do this automatically, unlike View
        this.options = options;
        console.log("Created TemplateSurface with options: ", this.options);
        if (!this.options.template) {
            throw new Error("Template not specified");
        }
    };

    TemplateSurface.prototype = Object.create(Surface.prototype);
    TemplateSurface.prototype.constructor = TemplateSurface;

    TemplateSurface.prototype.deploy = function(target) {
        if (this.options.template && Template[this.options.template]) {
            // Create container
            this.content = document.createElement('div');
            if (this.options.data) {
                // Create instance
                this.templateInstance = UI.renderWithData(Template[this.options.template], this.options.data);
            } else {
                // Create instance
                this.templateInstance = UI.render(Template[this.options.template]);
            }
            // Insert template into container
            UI.insert(this.templateInstance, this.content);
        }

        // Call super
        Surface.prototype.deploy.call(this, target);
    };

    // Clean up
    TemplateSurface.prototype.cleanup = function(allocator) {

        // Remove template instance
        $(this.content).remove();
        // this.templateInstance && this.templateInstance.dom.remove();
        // Call super
        Surface.prototype.cleanup.call(this, allocator);
    };

    // Export the function
    module.exports = TemplateSurface;

});