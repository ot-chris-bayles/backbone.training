describe("select next image", function(){
  beforeEach(function(){
    var vent = _.extend({}, Backbone.Events);
    this.images = new ImageGallery.Images(imageList, {vent: vent});
  });

  describe("when no image is selected and next is called", function(){
    beforeEach(function(){
      this.images.next();
    });

    it("should select the first image", function(){
      var expectedIndex = 0;
      expect(this.images).toHaveSelectedImageAt(expectedIndex);
    });
  });

  describe("when the first image is selected and next is called", function(){
    beforeEach(function(){
      this.images.first().select();
      this.images.next();
    });

    it("should select the second image", function(){
      var expectedIndex = 1;
      expect(this.images).toHaveSelectedImageAt(expectedIndex);
    });
  });

  describe("when the last image is selected and next is called", function(){
    beforeEach(function(){
      this.images.last().select();
      this.images.next();
    });

    it("should select the first image", function(){
      var expectedIndex = 0;
      expect(this.images).toHaveSelectedImageAt(expectedIndex);
    });
  });
});
