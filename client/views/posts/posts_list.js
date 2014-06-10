Template.postsList.helpers({
  postsWithRank: function() {
    if (!this.posts) {
        return;
    }
    this.posts.rewind();
    var rval = this.posts.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
    console.log("postsWithRank: ", rval);
    return rval;
  }
});
