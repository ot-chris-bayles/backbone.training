describe("editing an image", function(){
  beforeEach(function(){
    loadTemplate("edit-image-template");
    this.vent = _.extend({}, Backbone.Events);
    this.image = new ImageGallery.Image(imageList[0]);
    this.view = new ImageGallery.EditImageView({
      model: this.image,
      vent: this.vent
    });
    this.view.render();
    spyOn(this.image, "save");
  });

  describe("when rendering the view for editing an image", function(){
    it("should not allow the url to be edited", function(){
      expect(this.view.$("#url")).toBeDisabled();
    });

    it("should allow the name to be edited", function(){
      expect(this.view.$("#name")).not.toBeDisabled();
    });

    it("should allow the description to be edited", function(){
      expect(this.view.$("#description")).not.toBeDisabled();
    });

    it("should display the image", function(){
      expect(this.view.$("#image-preview img")).toHaveAttr("src", imageList[0].url);
    });
  });

  describe("when editing the name and description", function(){
    beforeEach(function(){
      spyOn(this.vent, "trigger");
      this.view.changeVal("#name", "some change");
      this.view.changeVal("#description", "a description change");
    });
    
    describe("and cancelling", function(){
      beforeEach(function(){
        this.view.clickEl("#cancel");
      });

      it("should not update the name", function(){
        expect(this.image).toHaveAttribute("name", imageList[0].name);
      });

      it("should not update the description", function(){
        expect(this.image).toHaveAttribute("description", imageList[0].description);
      });

      it("should notify of image edit cancel", function(){
        expect(this.vent.trigger).wasCalledWith("image:edit:cancelled", this.image);
      });
    });

    describe("and saving is successfull", function(){
      beforeEach(function(){
        spyOn(this.image, "restore");
        this.view.clickEl("#save");
        this.image.callSaveCallback("success");
        this.view.onClose();
      });

      it("should save the new name", function(){
        expect(this.image).toHaveAttribute("name", "some change");
      });

      it("should save the new description", function(){
        expect(this.image).toHaveAttribute("description", "a description change");
      });

      it("should notify of image edit save", function(){
        expect(this.vent.trigger).wasCalledWith("image:edit:saved", this.image);
      });

      it("should not restore the image", function(){
        expect(this.image.restore).not.wasCalled();
      });
    });

    describe("and saving fails", function(){
      beforeEach(function(){
        this.view.clickEl("#save");
        this.image.callSaveCallback("error");
      });

      it("should notify of image edit save", function(){
        expect(this.vent.trigger).not.wasCalledWith("image:edit:saved", this.image);
      });
    });

    describe("and closing the edit form without saving or cancelling", function(){
      beforeEach(function(){
        this.view.onClose();
      });

      it("should not update the name", function(){
        expect(this.image).toHaveAttribute("name", imageList[0].name);
      });

      it("should not update the description", function(){
        expect(this.image).toHaveAttribute("description", imageList[0].description);
      });

      it("should not notify of image edit cancel", function(){
        expect(this.vent.trigger).not.wasCalledWith("image:edit:cancelled", this.image);
      });
    });
  });

  describe("when deleting an image", function(){
    beforeEach(function(){
      spyOn(this.image, "destroy");
      spyOn(this.vent, "trigger");
      this.view.clickEl("#delete-image a");
      this.image.callDestroyCallback("success");
    });

    it("should delete from the server", function(){
      expect(this.image.destroy).wasCalled();
    });

    it("should notify of the deletion", function(){
      expect(this.vent.trigger).wasCalledWith("image:deleted");
    });
  });
});
