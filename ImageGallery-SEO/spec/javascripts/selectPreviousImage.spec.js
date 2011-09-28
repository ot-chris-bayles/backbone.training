describe("select previous image", function(){
  beforeEach(function(){
    var vent = _.extend({}, Backbone.Events);
    this.images = new ImageGallery.Images(imageList, {vent: vent});
  });

  describe("when no image is selected and previous is called", function(){
    beforeEach(function(){
      this.images.previous();
    });

    it("should select the last image", function(){
      var expectedIndex = imageList.length - 1;
      expect(this.images).toHaveSelectedImageAt(expectedIndex);
    });
  });

  describe("when the last image is selected and previous is called", function(){
    beforeEach(function(){
      this.images.last().select();
      this.images.previous();
    });

    it("should select the next to last image", function(){
      var expectedIndex = imageList.length - 2;
      expect(this.images).toHaveSelectedImageAt(expectedIndex);
    });
  });

  describe("when the first image is selected and previous is called", function(){
    beforeEach(function(){
      this.images.first().select();
      this.images.previous();
    });

    it("should select the last image", function(){
      var expectedIndex = imageList.length - 1;
      expect(this.images).toHaveSelectedImageAt(expectedIndex);
    });
  });
});
