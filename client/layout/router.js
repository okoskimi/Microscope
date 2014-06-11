var Transform = require('famous/core/Transform');

var layoutView = "LightboxLayout";
var forwardTransition, backTransition, refreshTransition, resultTransition;


if (layoutView === "LightboxLayout") {
    forwardTransition = {
        // 'in' state
        inTransform: Transform.translate(window.innerWidth, 0, 0),
        inOpacity: 1,
        inOrigin: [0, 0],

        // 'show' state
        showTransform: Transform.identity,
        showOpacity: 1,
        showOrigin: [0, 0],

        // 'out' state
        outTransform: Transform.translate(-window.innerWidth, 0, 0),
        outOpacity: 1,
        outOrigin: [0, 0],

        // transition parameters
        inTransition: { duration: 500, curve: 'linear' },
        outTransition: { duration: 500, curve: 'linear' },
        overlap: true
    };
    backTransition = _.extend({}, forwardTransition, {
        inTransform: Transform.translate(-window.innerWidth, 0, 0),
        outTransform: Transform.translate(window.innerWidth, 0, 0)
    });

    refreshTransition = {
        inTransform: Transform.scale(1, 0.1, 1),
        showTransform: Transform.identity,
        outTransform: Transform.scale(1, 0.1, 1),

        inTransition: { duration: 500, curve: 'linear' },
        outTransition: { duration: 500, curve: 'linear' },
        overlap: false
    };

    resultTransition = {
        inOpacity: 0,
        showOpacity: 1,
        outOpacity: 0,

        inTransition: { duration: 500, curve: 'linear' },
        outTransition: { duration: 500, curve: 'linear' },
        overlap: false
    };
} else if (layoutView === "FlipperLayout") {
    // Transition is always the same
} else {
    throw new Error("Unknown layout view: ", layoutView);
}


Router.configure({
    layoutView: layoutView,
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
        return [Meteor.subscribe('notifications')]
    }
});

PostsListController = RouteController.extend({
    template: 'postsList',
    increment: 5,
    limit: function () {
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function () {
        return {sort: this.sort, limit: this.limit()};
    },
    waitOn: function () {
        return Meteor.subscribe('posts', this.findOptions());
    },
    posts: function () {
        return Posts.find({}, this.findOptions());
    },
    data: function () {
        var hasMore = this.posts().count() === this.limit();
        return {
            posts: this.posts(),
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});

NewPostsListController = PostsListController.extend({
    sort: {submitted: -1, _id: -1},
    nextPath: function () {
        return Router.routes.newPosts.path({postsLimit: this.limit() + this.increment})
    }
});

BestPostsListController = PostsListController.extend({
    sort: {votes: -1, submitted: -1, _id: -1},
    nextPath: function () {
        return Router.routes.bestPosts.path({postsLimit: this.limit() + this.increment})
    }
});

Router.map(function () {
    this.route('home', {
        path: '/',
        controller: NewPostsListController,
        transitions: {
            newPosts: refreshTransition,
            bestPosts: forwardTransition,
            postPage: forwardTransition
        }
    });

    this.route('newPosts', {
        path: '/new/:postsLimit?',
        controller: NewPostsListController,
        transitions: {
            home: refreshTransition,
            bestPosts: forwardTransition,
            newPosts: refreshTransition,
            postPage: forwardTransition
        }
    });

    this.route('famPosts', {
        path: '/fam_new/:postsLimit?',
        view: 'AppView',
        template: 'postItem',
        waitOn: function () {
            return Meteor.subscribe('posts', { sort: {submitted: -1, _id: -1}, limit: 1});
        }
    });

    this.route('bestPosts', {
        path: '/best/:postsLimit?',
        controller: BestPostsListController,
        transitions: {
            newPosts: backTransition,
            home: backTransition,
            bestPosts: refreshTransition,
            postPage: forwardTransition
        }
    });

    this.route('postPage', {
        path: '/posts/:_id',
        waitOn: function () {
            return [
                Meteor.subscribe('singlePost', this.params._id),
                Meteor.subscribe('comments', this.params._id)
            ];
        },
        data: function () {
            return Posts.findOne(this.params._id);
        },
        transitions: {
            home: backTransition,
            newPosts: backTransition,
            bestPosts: backTransition
        }
    });

    this.route('postEdit', {
        path: '/posts/:_id/edit',
        waitOn: function () {
            return Meteor.subscribe('singlePost', this.params._id);
        },
        data: function () {
            return Posts.findOne(this.params._id);
        },
        transitions: {
            home: backTransition,
            newPosts: backTransition,
            bestPosts: backTransition,
            postPage: resultTransition
        }
    });

    this.route('postSubmit', {
        path: '/submit',
        progress: {enabled: false},
        transitions: {
            home: backTransition,
            newPosts: backTransition,
            bestPosts: backTransition,
            postPage: resultTransition
        }
    });
});


var requireLogin = function (pause) {
    if (!Meteor.user()) {
        if (Meteor.loggingIn())
            this.render(this.loadingTemplate);
        else
            this.render('accessDenied');

        pause();
    }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
Router.onBeforeAction(function () {
    clearErrors()
});

