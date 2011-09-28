ImageGallery = {};

ImageGallery.Image = Backbone.Model.extend({
  initialize: function(){
    var memento = new Backbone.Memento(this, {ignore: ["selected"]});
    _.extend(this, memento);
  },

  urlRoot: "/images",

  initialize: function(){
    var commentData = this.get("comments");
    this.comments = new ImageGallery.Comments(commentData);
    this.unset("comments");
  },

  select: function(){
    if (!this.get("selected")){
      this.set({selected: "selected"});
      this.collection.imageSelected(this);
    }
  },

  deselect: function(){
    this.unset("selected");
    this.collection.imageDeselected(this);
  },

  toJSON: function(){
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.comments = this.comments.toJSON();
    return json;
  }
});

ImageGallery.Images = Backbone.Collection.extend({
  model: ImageGallery.Image,
  url: "/images",

  initialize: function(models, options){
    this.vent = options.vent;
  },

  imageSelected: function(image){
    if (this.selectedImage){
      this.selectedImage.deselect();
    }
    this.selectedImage = image;
    this.vent.trigger("image:selected", image);
  },

  imageDeselected: function(image){
    if (this.selectedImage == image){
      delete this.selectedImage;
    }
  },

  next: function(){
    var index = 0;
    if (this.selectedImage){
      index = this.indexOf(this.selectedImage) + 1;
    }
    if (index >= this.length){
      index = 0;
    }
    this.at(index).select();
  },

  previous: function(){
    var index = this.length - 1;
    if (this.selectedImage){
      index = this.indexOf(this.selectedImage) - 1;
    }
    if (index < 0){
      index = this.length - 1;
    }
    this.at(index).select();
  }
});

ImageGallery.Comment = Backbone.Model.extend({
  url: function(){
    var imageId = this.get("imageId");
    return "/images/" + imageId + "/comments"
  },

  initialize: function(){
    var memento = new Backbone.Memento(this);
    _.extend(this, memento);
  }
});

ImageGallery.Comments = Backbone.Collection.extend({
  model: ImageGallery.Comment
});

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
}

ImageGallery.jQueryView = Backbone.View.extend({
  render: function(){
    var data;
    if (this.model){
      data = this.model.toJSON();
    }
    var html = this.template.tmpl(data);
    $(this.el).html(html);
    Backbone.ModelBinding.bind(this);

    if (this.onRender){
      this.onRender();
    }

    return this;
  }
});

ImageGallery.MenuView = Backbone.View.extend({
  el: "#menu",

  events: {
    "click a": "addImage"
  },

  addImage: function(e){
    e.preventDefault();
    this.options.vent.trigger("image:add");
  }
});

ImageGallery.LoadImageView = Backbone.View.extend({
  tagName: "form",
  id: "add-image-form",

  events: {
    "click #save": "save",
    "click #cancel": "cancel"
  },

  initialize: function(){
    _.bindAll(this, "saveSuccess", "saveError");
    this.template = $("#load-image-form-template");
  },

  save: function(e){
    e.preventDefault();
    this.model.save(null, {success: this.saveSuccess, error: this.saveError});
  },

  saveSuccess: function(model, response){
    this.collection.add(this.model);
    this.model.select();
  },

  saveError: function(model, response){
    console.log(response);
  },

  cancel: function(e){
    e.preventDefault();
    this.model.clear();
  },

  render: function(){
    var html = this.template.tmpl();
    $(this.el).html(html);
    Backbone.ModelBinding.bind(this);
    return this;
  },

  onClose: function(){
    Backbone.ModelBinding.unbind(this);
  }
});

ImageGallery.EditImageView = ImageGallery.jQueryView.extend({
  tagName: "form",
  id: "add-image-form",

  events: {
    "click #cancel": "cancelClicked",
    "click #save": "saveClicked",
    "click #delete-image a": "deleteClicked"
  },

  initialize: function(){
    _.bindAll(this, "saveSuccess", "saveError", "deleteSuccess", "deleteError");
    this.template = $("#edit-image-template");
    this.model.store();
  },

  cancelClicked: function(e){
    e.preventDefault();
    this.cancel();
    this.options.vent.trigger("image:edit:cancelled", this.model);
  },

  saveClicked: function(e){
    e.preventDefault();
    this.model.save(null, {success: this.saveSuccess, error: this.saveError});
  },

  saveSuccess: function(model, response){
    this.saved = true;
    this.options.vent.trigger("image:edit:saved", this.model);
  },

  saveError: function(model, response){
    console.log(response);
  },

  deleteClicked: function(e){
    e.preventDefault();
    this.model.destroy({success: this.deleteSuccess, error: this.deleteError});
  },

  deleteSuccess: function(model, response){
    this.options.vent.trigger("image:deleted");
  },

  deleteError: function(model, response){
    console.log(response);
  },

  cancel: function(){
    this.model.restore();
  },

  onClose: function(){
    if (!this.saved){
      this.cancel();
    }
  }
});

ImageGallery.ImageListView = Backbone.View.extend({
  tagName: "ul",
  className: "image-list",

  initialize: function(){
    _.bindAll(this, "renderImage");
    this.imageTemplate = $("#image-preview-template");

    this.collection.bind("add", this.renderImage, this);
    this.collection.bind("destroy", this.removeImage, this);

    this.imagePreviewList = {};
  },

  renderImage: function(image){
    var imagePreview = new ImageGallery.ImagePreview({
      model: image,
      template: this.imageTemplate
    });
    $(this.el).prepend(imagePreview.render().el);
    this.imagePreviewList[image.id] = imagePreview;
  },

  removeImage: function(image){
    var imagePreview = this.imagePreviewList[image.id];
    imagePreview.close();
  },

  render: function(){
    this.collection.each(this.renderImage);
    return this;
  }
});

ImageGallery.ImagePreview = ImageGallery.jQueryView.extend({
  tagName: "li",

  events: {
    "click a": "selectImage"
  },

  initialize: function(options){
    this.template = options.template;
  },

  selectImage: function(e){
    e.preventDefault();
    this.model.select();
  }
});

ImageGallery.ImageView = ImageGallery.jQueryView.extend({
  className: "image-view",
  template: "#image-view-template",

  events: {
    "click .nav-previous a": "previousImage",
    "click .nav-next a": "nextImage",
    "click .edit a": "editImage"
  },

  initialize: function(options){
    this.template = $(this.template);
    this.vent = options.vent;
  },

  nextImage: function(e){
    e.preventDefault();
    this.vent.trigger("image:next");
  },

  previousImage: function(e){
    e.preventDefault();
    this.vent.trigger("image:previous");
  },

  editImage: function(e){
    e.preventDefault();
    this.vent.trigger("image:edit", this.model);
  },

  onClose: function(){
    this.model.deselect();
  },

  onRender: function(){
    var commentsView = new ImageGallery.ImageCommentsView({
      model: this.model
    });
    commentsView.render();
    $(this.el).append(commentsView.el);
  }
});

ImageGallery.ImageCommentsView = Backbone.View.extend({
  tagName: "fieldset",
  id: "comments",
  template: "#image-comments-template",

  renderAddComment: function(){
    this.addCommentView = new ImageGallery.AddCommentView({
      imageId: this.model.id
    });
    this.addCommentView.render();
    this.$("#add-comment").html(this.addCommentView.el);

    this.addCommentView.bind("comment:saved", this.commentAdded, this);
  },

  commentAdded: function(comment){
    this.model.comments.add(comment);
    this.addCommentView.close();
    this.renderAddComment();
  },

  renderCommentList: function(){
    var commentListView = new ImageGallery.CommentListView({
      collection: this.model.comments
    });
    commentListView.render();
    $(this.el).append(commentListView.el);
  },

  render: function(){
    var html = $(this.template).tmpl();
    $(this.el).html(html);

    this.renderAddComment();
    this.renderCommentList();

    return this;
  }
});

ImageGallery.CommentListView = Backbone.View.extend({
  tagName: "ul",
  id: "comment-list",

  initialize: function(){
    _.bindAll(this, "renderComment");
    this.collection.bind("add", this.renderComment);
  },

  renderComment: function(comment){
    var commentView = new ImageGallery.CommentView({
      model: comment
    });
    commentView.render();
    $(this.el).append(commentView.el);
  },

  render: function(){
    this.collection.each(this.renderComment);
  }
});

ImageGallery.CommentView = Backbone.View.extend({
  tagName: "li",
  template: "#comment-template",

  render: function(){
    var html = $(this.template).tmpl(this.model.toJSON());
    $(this.el).html(html);
    return;
  }
});

ImageGallery.AddCommentView = Backbone.View.extend({
  tagName: "ul",
  template: "#add-comment-template",

  events: {
    "focus #comment": "focused",
    "blur #comment": "blurred",
    "click #save": "save",
    "click #cancel": "cancel"
  },

  initialize: function(){
    _.bindAll(this, "commentAddSuccess");
    var imageId = this.options.imageId;
    this.model = new ImageGallery.Comment({imageId: imageId});
    this.model.store();
  },

  focused: function(e){
    var textEl = $(e.currentTarget);
    textEl.css("height", "75px");
  },

  blurred: function(e){
    var textEl = $(e.currentTarget);
    if (!textEl.val().trim()){
      this.shrinkCommentInput(textEl);
    }
  },

  shrinkCommentInput: function(textEl){
    textEl.css("height", "20px");
  },

  save: function(e){
    e.preventDefault();
    this.model.save(null, {
      success: this.commentAddSuccess,
      error: this.commentAddError
    });
  },

  commentAddSuccess: function(model, reponses){
    this.trigger("comment:saved", this.model);
  },

  commentAddError: function(model, response){
    console.log(response);
  },

  cancel: function(e){
    e.preventDefault();
    this.model.restore();
    var textEl = this.$("#comment");
    this.shrinkCommentInput(textEl);
  },

  render: function(){
    var html = $(this.template).tmpl(this.model.toJSON());
    $(this.el).html(html);
    Backbone.ModelBinding.bind(this);
    return this;
  }
});

ImageGallery.ImageNotFoundView = Backbone.View.extend({
  className: "image-not-found",

  initialize: function(){
    this.template = $("#image-not-found-template");
  },

  render: function(){
    var html = this.template.tmpl({modelId: this.options.modelId});
    $(this.el).html(html);
    return this;
  }
});

ImageGallery.MainView = function(){
  var el = $("#main");

  var openView = function(view){
    $(view.el).slideToggle(500);
  }

  var closeView = function(view){
    if (view){
      $(view.el).slideToggle(500, function(){
        view.close();
      });
    }
  }

  this.show = function(view){
    var closingView = this.view;

    this.view = view;
    this.view.render();
    $(this.view.el).hide();
    el.append(this.view.el);

    openView(this.view);
    closeView(closingView);
  }
}

ImageGallery.Controller = function(images, mainView, vent){
  this.mainView = mainView;
  this.images = images;

  var processImageById = function(id, callback){
    var image = this.images.get(id);
    if (image){
      callback.call(this, image);
    } else {
      this.showImageNotFound(id);
    }
  }

  this.home = function(){
    if (this.images.length > 0) {
      this.images.last().select();
    } else {
      this.addImage();
    }
  }

  this.showImageById = function(id){
    processImageById.call(this, id, function(image){
      image.select();
    });
  }

  this.showImageNotFound = function(modelId){
    var view = new ImageGallery.ImageNotFoundView({modelId: modelId});
    this.mainView.show(view);
  }

  this.showImage = function(image){
    var imageView = new ImageGallery.ImageView({
      model: image,
      vent: vent
    });
    this.mainView.show(imageView);
  }

  this.addImage = function(){
    var image = new ImageGallery.Image();
    var loadImageView = new ImageGallery.LoadImageView({
      model: image,
      collection: this.images
    });
    this.mainView.show(loadImageView);
  }

  this.editImage = function(image){
    var view = new ImageGallery.EditImageView({
      model: image,
      vent: vent
    });
    this.mainView.show(view);
  }

  this.editImageById = function(id){
    processImageById.call(this, id, this.editImage);
  }
}

ImageGallery.Router = Backbone.Router.extend({
  routes: {
    "": "home",
    "/images/:id": "showImage",
    "/add": "addImage",
    "/edit/:id": "editImage"
  },

  initialize: function(options){
    this.controller = options.controller;
  },

  home: function(){
    this.controller.home();
  },

  showImage: function(id){
    this.controller.showImageById(id);
  },

  addImage: function(){
    this.controller.addImage();
  },

  editImage: function(id){
    this.controller.editImageById(id);
  }
});

ImageGallery.App = function(initialImages){
  var vent = _.extend({}, Backbone.Events);

  var images = new ImageGallery.Images(initialImages, {
    vent: vent
  });

  var mainView = new ImageGallery.MainView();

  var controller = new ImageGallery.Controller(images, mainView, vent);

  var router = new ImageGallery.Router({
    images: images,
    mainView: mainView,
    controller: controller
  });

  var showImage = function(image){
    controller.showImage(image);
    router.navigate("/images/" + image.id);
  }

  vent.bind("image:selected", showImage, this);
  vent.bind("image:edit:cancelled", showImage, this);
  vent.bind("image:edit:saved", showImage, this);
  vent.bind("image:deleted", function(){
    controller.home();
  });

  vent.bind("image:add", function(){
    controller.addImage();
    router.navigate("/add");
  });

  vent.bind("image:next", images.next, images);
  vent.bind("image:previous", images.previous, images);

  vent.bind("image:edit", function(image){
    controller.editImage(image);
    router.navigate("/edit/" + image.id);
  });

  this.initialize = function(){
    var imageListView = new ImageGallery.ImageListView({
      collection: images
    });
    $("#image-list").html(imageListView.render().el);

    new ImageGallery.MenuView({
      vent: vent
    });

    Backbone.history.start();
  }
}
