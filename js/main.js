$(function(){
  // Model defined with two fields.
  var Translation = Backbone.Model.extend({
    defaults: {
     english: 'blank',
      spanish: 'blank'
    }
  });

  // Collection defined with localStorage.
  var Dictionary = Backbone.Collection.extend({
    model: Translation,
    localStorage: new Store("dictionary-store")
  });

  // Initialize Dictionary.
  var Translations = new Dictionary;

  // The AppView.
  var AppView = Backbone.View.extend({
    el: $('body'),
    events: {
      'click #add-tran': 'insertItem', // Listen to when Add button is pressed.
      'click #get-tran': 'getItem', // Listen to when Add button is pressed.
      'click #get-alert .close': 'closeGetAlert',
      'change #edit-select': 'selectorChange',
      'click #edit-delete': 'deleteEdit',
      'click #make-edit': 'makeEdit'
    },

   initialize: function () {

      Translations.fetch();
      Translations.toJSON(); // Fetch collection and put in to JSON format.
      this.updateSelect();
    },

    updateSelect: function() {
      var editSelect = $('#edit-select');
      var editFieldsInput = $('#edit-fields input');
      var editFieldsA = $('#edit-fields a');
      editSelect.empty();
      Translations.each( function( obj ){
        editSelect.append($('<option>', {
          value: obj.get('english'),
          text : obj.get('english') + ' > ' + obj.get('spanish')
        }));
      });

      editSelect.prop("selectedIndex", -1);
      editFieldsInput.val('');
      editFieldsInput.prop('disabled', true);
      editFieldsA.addClass('disabled');
    },

    insertItem: function (e) {
      var inputEnglish = $('#input-add-english'), inputSpanish = $('#input-add-spanish');
      var newEnglish = inputEnglish.val(), newSpanish = inputSpanish.val();
      // Create new Translation object and add to collection.
      newTranslation = new Translation({
        english: newEnglish,
        spanish: newSpanish
      });

      this.collection.add(newTranslation);
      newTranslation.save();
      inputEnglish.val('');
      inputSpanish.val('');
      $('#edit-select').append($('<option>', {
        value: newEnglish,
        text : newEnglish + ' > ' + newSpanish
      }));
    },

    getItem: function() {
      var searchEnglish = $('#input-get-english').val();
      var search = Translations.find(function(model) { return model.get('english') == searchEnglish; });
      $('#input-get-spanish').val(search.get('spanish'));
      $("#get-alert").removeClass("hidden").fadeIn().addClass("in");
    },

    closeGetAlert: function() {
      $("#get-alert").removeClass("in").addClass("hidden");
    },

    selectorChange: function() {
      var selectVal = $('#edit-select option:selected').val();
      var editModel = this.collection.findWhere({english: selectVal});
      $('#input-edit-english').val(editModel.get('english'));
      $('#input-edit-spanish').val(editModel.get('spanish'));
      $("#edit-fields input").prop('disabled', false);
      $('#edit-fields a').removeClass('disabled');
    },

    deleteEdit: function() {
      var selectVal = $('#edit-select option:selected').val();
      var editModel = this.collection.findWhere({english: selectVal});
      editModel.destroy();
      this.updateSelect();
    },

    makeEdit: function() {
      var selectVal = $('#edit-select option:selected').val();
      var editModel = this.collection.findWhere({english: selectVal});
      var editEnglish = $('#input-edit-english').val();
      var editSpanish = $('#input-edit-spanish').val();
      editModel.set({english: editEnglish, spanish: editSpanish});
      editModel.save();
      this.updateSelect();
    }
  });

  // Initialize AppView.
  var App = new AppView({
    collection: Translations
  });
});
